import { SignJWT, jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function validateAdminSession(token: string) {
    try {
      // Verify JWT
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userId = payload.userId as string;
      // const decoded = verify(token, JWT_SECRET) as {
      //   adminId: string;
      //   role: string;
      //   permissions: string[];
      // };
  
      // Check if session exists
      const session = await prisma.adminSession.findFirst({
        where: {
          token,
          expiresAt: { gt: new Date() },
        },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              permissions: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
  
      if (!session) {
        return null;
      }
  
      return {
        admin: {
          ...session.admin,
          permissions: session.admin.permissions.map((p) => p.name),
        },
      };
    } catch (error) {
      return null;
    }
  }