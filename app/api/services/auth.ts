"use server";

import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import {
  compileAccountCreationTemplate,
  sendMail,
  sendVerificationEmail,
} from "../../../lib/mail";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generate new 6 characters code
function generate6CharCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

type TempUser = {
  email: string;
  verificationCode: string;
  expiresAt: Date;
  createdAt: Date;
};

// User authentication
export async function sendPreSignupCode({ email }: { email: string }) {
  // Check if user already exists as a temporary user
  const existingTempUser = await prisma.temporaryUser.findFirst({
    where: {
      email,
    },
  });

  // Check if user already exists as a user
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "User with this email exists" },
      { status: 409 }
    );
  }

  const verificationCode = generate6CharCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  let user: TempUser | null = null;

  if (existingTempUser) {
    // Update user
    user = await prisma.temporaryUser.update({
      where: {
        email: existingTempUser.email,
      },
      data: {
        verificationCode,
        expiresAt,
      },
    });
  } else {
    // Create user
    user = await prisma.temporaryUser.create({
      data: {
        email,
        verificationCode,
        expiresAt,
      },
    });
  }

  // Send email to the new customer & send verification email concurrently
  await Promise.all([
    // sendMail({
    //   to: user.email,
    //   name: "Account Created",
    //   subject: "Welcome to Yieldra",
    //   body: compileAccountCreationTemplate(`${user.username}`),
    // }),
    sendVerificationEmail(user.email, verificationCode),
  ]);

  return { message: "Successfully sent!" };
}

export async function signUp({
  username,
  email,
  password,
  verificationCode,
  referralCode,
}: {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
  referralCode: string;
}) {
  console.log("🚀 ~ verificationCode:", verificationCode);
  // Check if user exists as a temporary user, and hasn't expired.
  const temporaryUser = await prisma.temporaryUser.findFirst({
    where: {
      AND: [
        { email },
        { verificationCode },
        { expiresAt: { gt: new Date() } }, // Check if the code hasn't expired
      ],
    },
  });

  if (!temporaryUser || !verificationCode) {
    throw new Error("Invalid or expired verification code");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error("User with this email or username already exists");
  }

  // Hash password
  const hashedPassword = await hash(password, 10);

  // Check if referral code is valid
  let referrerId = null;
  if (referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (referrer) {
      referrerId = referrer.id;
    }
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      referralCode: generateReferralCode(),
      referredBy: referrerId,
    },
  });

  // Delete temporary user
  await prisma.temporaryUser.delete({
    where: {
      email: temporaryUser.email,
    },
  });

  // Create email verification
  //   const verificationToken = await createEmailVerification(email);

  // Send email to the new customer & send verification email concurrently
  await Promise.all([
    sendMail({
      to: user.email,
      name: "Account Created",
      subject: "Welcome to Yieldra",
      body: compileAccountCreationTemplate(`${user.username}`),
    }),
    // sendVerificationEmail(user.email, verificationToken),
  ]);

  return { userId: user.id };
}

export async function signIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  // Find user
  const [user, adminUser] = await prisma.$transaction([
    prisma.user.findFirst({
      where: {
        OR: [{ email: username }, { username }],
      },
    }),
    prisma.admin.findFirst({
      where: {
        OR: [{ email: username }, { username }],
      },
    }),
  ]);

  //   const user = await prisma.user.findFirst({
  //     where: {
  //       OR: [{ email: username }, { username }],
  //     },
  //   });

  if (!user && !adminUser) {
    throw new Error("Invalid credentials");
  }

  if (adminUser) {
    // Verify password
    const passwordValid = await compare(password, adminUser.password);

    if (!passwordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await new SignJWT({
      userId: adminUser.id,
      role: "SUPER_ADMIN",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(JWT_SECRET));

    await prisma.adminSession.create({
      data: {
        adminId: adminUser.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update last login
    await prisma.admin.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      token,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        isAdmin: true,
      },
    };
  }

  if (!user) {
    throw new Error("Invalid user credentials");
  }

  // If we get here, it means the person is not an admin...

  // Verify password
  const passwordValid = await compare(password, user.password);

  if (!passwordValid) {
    throw new Error("Invalid credentials");
  }

  // Create session
  //   const token = sign({ userId: user.id, role: "user" }, JWT_SECRET, {
  //     expiresIn: "7d",
  //   })
  const token = await new SignJWT({ userId: user.id, role: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET));

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
}

// Admin authentication
export async function adminSignIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  // Find admin
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ email: username }, { username }],
    },
    include: {
      permissions: true,
    },
  });

  if (!admin) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  const passwordValid = await compare(password, admin.password);

  if (!passwordValid) {
    throw new Error("Invalid credentials");
  }

  // Create session
  const token = await new SignJWT({
    adminId: admin.id,
    role: admin.role,
    permissions: admin.permissions.map((p) => p.name),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET));

  //   const token = sign(
  //     {
  //       adminId: admin.id,
  //       role: admin.role,
  //       permissions: admin.permissions.map((p) => p.name),
  //     },
  //     JWT_SECRET,
  //     { expiresIn: "1d" }
  //   );

  await prisma.adminSession.create({
    data: {
      adminId: admin.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    },
  });

  // Update last login
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions.map((p) => p.name),
    },
  };
}

// Password reset
export async function requestPasswordReset(email: string) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  const admin = !user
    ? await prisma.admin.findUnique({
        where: { email },
      })
    : null;

  if (!user && !admin) {
    // Don't reveal that the email doesn't exist
    return { success: true };
  }

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Create password reset record
  await prisma.passwordReset.create({
    data: {
      token,
      email,
      userId: user?.id,
      adminId: admin?.id,
      expiresAt,
    },
  });

  // Send password reset email (implementation depends on your email service)
  // await sendPasswordResetEmail(email, token)

  return { success: true };
}

export async function resetPassword({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  // Find valid token
  const passwordReset = await prisma.passwordReset.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
  });

  if (!passwordReset) {
    throw new Error("Invalid or expired token");
  }

  // Hash new password
  const hashedPassword = await hash(password, 10);

  // Update user or admin password
  if (passwordReset.userId) {
    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    });
  } else if (passwordReset.adminId) {
    await prisma.admin.update({
      where: { id: passwordReset.adminId },
      data: { password: hashedPassword },
    });
  }

  // Mark token as used
  await prisma.passwordReset.update({
    where: { id: passwordReset.id },
    data: { usedAt: new Date() },
  });

  return { success: true };
}

// Email verification
async function createEmailVerification(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.emailVerification.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function verifyEmail(token: string) {
  // Find valid token
  const verification = await prisma.emailVerification.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
  });

  if (!verification) {
    throw new Error("Invalid or expired token");
  }

  // Update user
  await prisma.user.updateMany({
    where: { email: verification.email },
    data: { isEmailVerified: true },
  });

  // Mark token as used
  await prisma.emailVerification.update({
    where: { id: verification.id },
    data: { usedAt: new Date() },
  });

  return { success: true };
}

// Session management
export async function validateSession(token: string) {
  console.log("🚀 ~ validateSession ~ token:", token);
  try {
    // Verify JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const userId = payload.userId as string;
    // const decoded = verify(token, JWT_SECRET) as {
    //   userId: string;
    //   role: string;
    // };

    // Check if session exists
    const session = await prisma.session.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isEmailVerified: true,
            balance: true,
          },
        },
      },
    });
    console.log("🚀 ~ validateSession ~ session:", session);

    if (!session) {
      return null;
    }

    return { user: session.user };
  } catch (error) {
    console.log("🚀 ~ validateSession ~ error:", error);
    return null;
  }
}

// Helper functions
function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}
