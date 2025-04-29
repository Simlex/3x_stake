"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth, VerifyEmailRequest } from "@/app/api/apiClient";
import { StorageKeys } from "@/app/constants/storageKeys";
import { Loader, Verified, VerifiedIcon, Wallet } from "lucide-react";
import { useModalContext } from "@/app/context/ModalContext";
import { Button } from "../ui/button";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { useAuthContext } from "@/app/context/AuthContext";

interface VerifyEmailPageProps {}

const VerifyEmailPage: FunctionComponent<
  VerifyEmailPageProps
> = (): ReactElement => {
  const auth = useAuth();
  const { user, isLoading } = useAuthContext()
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
    <div className="max-[768px]:sectionPadding flex md:grid place-items-center py-[5rem] min-h-[90vh] bg-dark-grey">
      <div
        className={`bg-dark-grey-2 text-white rounded-[1.25rem] flex w-screen max-h-none md:mx-auto md:max-h-fit md:w-[70vw] xl:w-[35vw] h-fit overflow-hidden max-w-[450px]`}
      >
        {
          // If there is no token in the search params
          !token && (
            <div className="py-6 flex px-5 w-full flex-col gap-6">
              <div className="flex items-center flex-col gap-1 mb-3">
                <h3 className="font-semibold text-xl mb-3">
                  Verify your email
                </h3>
                <p className="text-center text-base w-[80%]">
                  We have sent a verification link to your email address
                  {retrieveNewlyCreatedUserEmail() && (
                    <>
                      &nbsp;
                      <span className="font-medium text-primary-color-sub underline">
                        {retrieveNewlyCreatedUserEmail()}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-4 md:min-w-[25rem] w-full min-w-[auto]">
                <button
                  className="p-[0.65rem] rounded-lg bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80"
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
            <div className="py-6 flex px-5 w-full flex-col gap-6">
              <h3 className="font-semibold text-xl text-center mb-3">
                Verifying your email...
              </h3>
              <div className="h-[150px] relative grid place-items-center">
                <Loader />
              </div>
              {verificationError && (
                <span className="text-xs text-[#eb485b] flex items-center gap-0.5">
                  {verificationError}
                </span>
              )}
            </div>
          )
        }
        {
          // If there is a token in the search params, and the email has been verified successfully
          token && isEmailVerified && !isVerifyingEmail && (
            <div className="py-6 flex px-5 w-full flex-col items-center gap-6">
              <h3 className="font-semibold text-xl mb-3">Email verified</h3>
              <span>
                <span className="w-20 h-20 grid place-items-center mx-auto">
                  <Verified className="w-14 h-14 [&_path]:fill-success-color" />
                </span>
              </span>
              <p className="text-center">
                Your email has been verified successfully.
                {!user && "You can now login to your account."}
              </p>
              {user ? (
                <Link
                  className="w-full p-[0.65rem] rounded-lg bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80"
                  href={ApplicationRoutes.Home}
                >
                  Go to homepage
                </Link>
              ) : (
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                variant="outline"
                className="border-purple-500/50 hover:border-purple-500 text-white dark:text-white"
              >
                <Wallet className="mr-2 h-4 w-4 ml-auto" /> Login
              </Button>
              )}
            </div>
          )
        }
        {
          // If there is a token in the search params, and the email verification failed
          token && !isEmailVerified && !isVerifyingEmail && (
            <div className="py-6 flex px-5 w-full flex-col gap-6 text-center">
              <h3 className="font-semibold text-xl mb-3">
                Failed to verify email
              </h3>
              <p>
                An error occurred while verifying your email. Please click the
                button below to resend the verification email.
              </p>
              <button
                className="p-[0.65rem] rounded-lg bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80"
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
