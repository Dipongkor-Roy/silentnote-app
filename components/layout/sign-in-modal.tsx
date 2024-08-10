import Modal from "@/components/shared/modal";
import { signIn, useSession } from "next-auth/react";
import logo from "public/logo.png";

import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { LoadingDots, Google } from "@/components/shared/icons";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [signInClicked, setSignInClicked] = useState(false);
  const [signInClicke, setSignInClicke] = useState(false);
  const [email, setEmail] = useState<string>(""); // Initialize email as an empty string
  const [emailError, setEmailError] = useState<boolean>(false); // State for email error message
  const { toast } = useToast();

  async function SignInWithEmail() {
    if (email === "") {
      setEmailError(true);
      return;
    }

    const signInResult = await signIn("email", {
      email: email,
      callbackUrl: `${window.location.origin}`,
      redirect: false,
    });

    if (!signInResult?.ok) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your Email",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return "error";
    }

    setEmail("");
    setSignInClicke(false);
    toast({
      title: "Success",
      description: "Please Check Your Email To Log In",
    });

    return "success";
  }

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href="">
            <Image
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
          </a>
          <h3 className="font-display text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Sign In to SilentNote - Securely Connect and Share Anonymously with
            Confidence and Ease
          </p>
        </div>

        {/* sign in magic link */}
        <form action={SignInWithEmail}>
          <div className="flex flex-col space-y-2 bg-gray-50 px-4 pt-3 md:px-16">
            <Input
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false); // Reset the error state when the user types
              }}
              className="w-full rounded-lg border-2 h-10 px-3" // Adjust input field size
              placeholder="example@gmail.com"
              name="email"
              type="email"
              value={email} // Ensure the input value is controlled
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">Please enter your email First.</p>
            )}
            <div className="flex flex-col space-y-4 bg-gray-50 py-2 ">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  SignInWithEmail();
                }}
                disabled={signInClicke} // Disable if signInClicke is true
                type="submit"
                className="flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-gray-200 bg-white text-sm text-black shadow-sm transition-all duration-75 hover:bg-gray-50 focus:outline-none"
              >
                {signInClicke ? (
                  <LoadingDots color="#808080" />
                ) : (
                  <>
                    <Image src={logo} alt="image" className="h-4 w-4" />
                    <p> Sign In</p>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        {/* sign in magic link end */}
        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <button
            disabled={signInClicked}
            className={`${
              signInClicked
                ? "cursor-not-allowed border-gray-200 bg-gray-100"
                : "border border-gray-200 bg-white text-black hover:bg-gray-50"
            } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            onClick={() => {
              setSignInClicked(true);
              signIn("google");
            }}
          >
            {signInClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <Google className="h-5 w-5" />
                <p>Sign In with Google</p>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback]
  );
}
