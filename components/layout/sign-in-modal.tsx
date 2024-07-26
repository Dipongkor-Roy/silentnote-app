
import Modal from '@/components/shared/modal';
import { signIn, useSession } from "next-auth/react";
import logo from 'public/logo.png'

import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { LoadingDots, Google } from "@/components/shared/icons";
import Image from "next/image";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [signInClicked, setSignInClicked] = useState(false);
  const [signInClicke, setSignInClicke] = useState(false);
  const { data:session } = useSession();
  const [email, setEmail] = useState<null | string>(null);
  const { toast } = useToast()
  async function SignInWithEmail() {
    const signInResult = await signIn('email', {
      email: email,
      callbackUrl: `${window.location.origin}`,
      redirect: false
    })

    if (!signInResult?.ok) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your Email",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      return "error"
    }

    setEmail("")
    setSignInClicke(false)
    toast({
      title: "Success",
      description: "Please Check Your Email To Log In",
    })

    return "success"
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
            This is strictly for demo purposes - only your email and profile
            picture will be stored.
          </p>
        </div>
      
      {/* sign in magic link  */}
      <form action={SignInWithEmail}>
      <div className='flex flex-col space-y-2 bg-gray-50 px-4 pt-3 md:px-16'>
        <Input onChange={(e) => setEmail(e.target.value)}className="rounded-lg border-2 w-full" placeholder="example@gmail.com" name="email" type="email"/>
       <div className='flex flex-col space-y-4 bg-gray-50 px-4 py-2 md:px-16'>
       <button onClick={() => {
              setSignInClicke(true);
              SignInWithEmail();
            }}  disabled={signInClicke} type='submit' className="  border-gray-200 bg-white text-black hover:bg-gray-50 flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none">
        
       {signInClicke ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <Image src={logo} alt='image' className=' h-4 w-4'></Image>
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
    [setShowSignInModal, SignInModalCallback],
  );
}
