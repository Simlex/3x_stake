"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import styles from "../../styles/AuthStyles.module.scss";
import { useSearchParams } from "next/navigation";
import { useAuth, VerifyEmailRequest } from "@/app/api/apiClient";
import { StorageKeys } from "@/app/constants/storageKeys";
import { Loader, VerifiedIcon, Wallet } from "lucide-react";
import { useModalContext } from "@/app/context/ModalContext";
import { Button } from "../ui/button";

interface VerifyEmailPageProps {}

const VerifyEmailPage: FunctionComponent<
  VerifyEmailPageProps
> = (): ReactElement => {
  const auth = useAuth();
  const searchParams = useSearchParams();

  // Get the token from the search params
  const token = searchParams.get("vrtkn");

  const [verificationError, setVerificationError] = useState<string>();
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const { setLoginModalVisibility: setIsLoginModalOpen } = useModalContext();

  function retrieveNewlyCreatedUserEmail() {
    const newlyCreatedUserEmail = sessionStorage.getItem(
      StorageKeys.NewlyCreatedUserEmail
    );

    if (
      newlyCreatedUserEmail &&
      newlyCreatedUserEmail !== "" &&
      newlyCreatedUserEmail !== null
    ) {
      return newlyCreatedUserEmail;
    }
  }

  function openMailApp() {
    const mailtoLink = "mailto:";
    window.location.href = mailtoLink;
  }

  async function handleVerifyUserEmail() {
    // Set the isVerifyingEmail state to true
    setIsVerifyingEmail(true);

    try {
      const data: VerifyEmailRequest = {
        token: token as string,
      };

      await auth.verifyEmail(data);

      setIsEmailVerified(true);
    } catch (error: any) {
      // For security reasons, we don't show specific errors
      // Just set submitted to true anyway
      setIsVerifyingEmail(true);
    } finally {
      setIsVerifyingEmail(false);
    }
  }

  async function handleResendVerificationLink() {
    // Set the isResendingEmail state to true
    setIsResendingEmail(true);

    try {
      await auth.resendVerificationEmail(
        retrieveNewlyCreatedUserEmail() as string
      );
    } catch (error: any) {
    } finally {
      setIsResendingEmail(false);
    }
  }

  useEffect(() => {
    if (token && !isVerifyingEmail) {
      handleVerifyUserEmail();
    }
  }, [token]);

  return (
    <div className={styles.main}>
      <div className={`${styles.container} ${styles.verifyEmailContainer}`}>
        {
          // If there is no token in the search params
          !token && (
            <div className={styles.content}>
              <div className={styles.content__top}>
                <h3>Verify your email</h3>
                <br />
                <br />
                <br />
                <p>
                  We have sent a verification link to your email address
                  {retrieveNewlyCreatedUserEmail() && (
                    <>
                      &nbsp;<strong>{retrieveNewlyCreatedUserEmail()}</strong>
                    </>
                  )}
                  .
                </p>
              </div>
              <div className={styles.content__form}>
                <button
                  type="submit"
                  onClick={openMailApp}
                  disabled={isVerifyingEmail}
                >
                  Open email
                </button>
              </div>
            </div>
          )
        }
        {
          // If there is a token in the search params, and the user's email isn't verified yet, and the email is being verified
          token && !isEmailVerified && isVerifyingEmail && (
            <div className={styles.verifyingContent}>
              <h3>Verifying your email...</h3>
              <div className={styles.loader}>
                <Loader />
              </div>
              {verificationError && (
                <span className={styles.errorMsg}>{verificationError}</span>
              )}
            </div>
          )
        }
        {
          // If there is a token in the search params, and the email has been verified successfully
          token && isEmailVerified && !isVerifyingEmail && (
            <div className={styles.verifiedContent}>
              <h3>Email verified</h3>
              <span>
                <span className={styles.verifiedIcon}>
                  <VerifiedIcon />
                </span>
              </span>
              <p>
                Your email has been verified successfully. You can now login to
                your account.
              </p>
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                variant="outline"
                className="border-purple-500/50 hover:border-purple-500 text-white dark:text-white"
              >
                <Wallet className="mr-2 h-4 w-4 ml-auto" /> Login
              </Button>
            </div>
          )
        }
        {
          // If there is a token in the search params, and the email verification failed
          token && !isEmailVerified && !isVerifyingEmail && (
            <div className={styles.verifiedContent}>
              <h3>Failed to verify email</h3>
              <p>
                An error occurred while verifying your email. Please click the
                button below to resend the verification email.
              </p>
              <button
                type="submit"
                onClick={() => handleResendVerificationLink()}
                disabled={isResendingEmail}
              >
                Resend verification email
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default VerifyEmailPage;
