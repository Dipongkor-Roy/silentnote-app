"use client";

import ImageFade from "@/components/custom/Dashboard/Dashboard-hero";
import Footer from "@/components/custom/Footer/Footer";
import StaticLogoCloud from "@/components/custom/LogoCloud/LogoCloud";
import { useSignInModal } from "@/components/layout/sign-in-modal";
import { Github, Twitter } from "@/components/shared/icons";
import { nFormatter } from "@/lib/utils";
import { Session } from "next-auth";

export default function Home({ session }: { session: Session | null }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();

  return (
    <>
      <SignInModal />
      <div className="z-10 w-full max-w-xl px-5 xl:px-0 ">
        <a
          href="https://x.com/Juniordipu"
          target="_blank"
          rel="noreferrer"
          className="animate-fade-up mx-auto mb-5 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
        >
          <Twitter className="h-5 w-5 text-[#1d9bf0]" />
          <p className="text-sm font-semibold text-[#1d9bf0]">
            Introducing SilentNote
          </p>
        </a>
        <h1
          className="animate-fade-up font-display bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent  drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Connect Anonymously, Share Freely
        </h1>
        <p
          className="animate-fade-up mt-6 text-center text-gray-500  [text-wrap:balance] md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Create your profile, share your unique link, and receive anonymous
          messages without the need for anyone to log in.
        </p>
        <div
          className="animate-fade-up mx-auto mt-6 flex items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <div className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black">
            <svg
              className="h-4 w-4 group-hover:text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L20 20H4L12 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {session ? (
              <button className=" disabled:">Get Started</button>
            ) : (
              <button onClick={() => setShowSignInModal(true)}>
                Get Started
              </button>
            )}
          </div>
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
            href="https://github.com/steven-tey/precedent"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>
              <span className="hidden sm:inline-block">Star on</span> GitHub{" "}
              <span className="font-semibold">{nFormatter(0)}</span>
            </p>
          </a>
        </div>
      </div>
      <div className="animate-fade-up my-10  w-full ">
        <StaticLogoCloud />
      </div>
      <div className="animate-fade-up w-full  pt-5">
        <ImageFade />
      </div>
    </>
  );
}
