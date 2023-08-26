"use client";

import Script from "next/script";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="fixed top-0 flex items-center w-full z-50 p-[16px] max-w-[800px] justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" width={32} height={32} alt="ottomon" />
        </div>
        <div className="flex gap-[16px] items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1.5em"
            fill="none"
            strokeWidth="1.5"
            color="#FFF"
            viewBox="0 0 24 24"
            style={{ width: "20px", height: "20px" }}
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M23 3.01s-2.018 1.192-3.14 1.53a4.48 4.48 0 00-7.86 3v1a10.66 10.66 0 01-9-4.53s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5 0-.278-.028-.556-.08-.83C21.94 5.674 23 3.01 23 3.01z"
            ></path>
          </svg>
          <button className="h-[36px] rounded-md text-sm font-medium whitespace-nowrap p-[8px] outline-none text-black bg-white">
            Sign In
          </button>
        </div>
      </div>
      <Script src="/particles.js" />
      <div className="w-full flex items-center flex-col transition-all h-full">
        <div className="relative font-inter antialiased w-full h-fit">
          <main className="relative min-h-screen flex flex-col justify-center bg-[#131313] overflow-hidden">
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
              <div className="text-center">
                {/* Illustration #1 */}
                <div
                  className="absolute top-0 left-0 rotate-180 -translate-x-3/4 -scale-x-100 blur-3xl opacity-70 pointer-events-none"
                  aria-hidden="true"
                >
                  <img
                    src="https://cruip-tutorials.vercel.app/particle-animation/shape.svg"
                    className="max-w-none"
                    alt="Illustration"
                    width={852}
                    height={582}
                  />
                </div>
                {/* Illustration #2 */}
                <div
                  className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 blur-3xl opacity-70 pointer-events-none"
                  aria-hidden="true"
                >
                  <img
                    src="https://cruip-tutorials.vercel.app/particle-animation/shape.svg"
                    className="max-w-none"
                    alt="Illustration"
                    width={852}
                    height={582}
                  />
                </div>
                {/* Particles animation */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                >
                  <canvas data-particle-animation="" />
                </div>
                <div className="relative flex flex-col items-center">
                  <h1 className="max-w-[550px] inline-flex font-extrabold text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-slate-200 to-slate-200/60 pb-4">
                    Chat with code, videos, and docs
                  </h1>
                  <div className="max-w-3xl mx-auto mb-8">
                    <p className="text-lg text-slate-400">
                      Elevate your data apps with seamless, production-ready
                      chat integration. Effortlessly ingest, personalize, and
                      deploy using just a single line of code.
                    </p>
                  </div>
                  <div className="flex gap-[8px] max-w-[500px] items-center ">
                    <input
                      className="h-[50px] w-full rounded-md bg-[rgba(89,89,89,0.6)] p-[8px] outline-none"
                      placeholder="Your Email Address"
                    />
                    <button className="h-[50px] rounded-md text-sm font-semibold whitespace-nowrap p-[8px] outline-none text-black bg-white">
                      Join Waitlist
                    </button>
                  </div>
                </div>
                <div className="mt-[60px] text-4xl">Examples</div>
                <BotBoddy />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const BotBoddy = () => {
  return (
    <div className="bg-[#1b1b1b] shadow-sm flex flex-col text-start z-[1000] w-full max-w-[700px] mx-auto relative border-[rgba(40,40,40,.9)] rounded-md border">
      <div className="w-full border-b p-[8px] flex items-center border-[rgba(40,40,40)]">
        <input
          className="w-full h-full bg-transparent outline-none text-white placeholder-gray-500/80"
          placeholder="Ask me something"
        />
        <button
          disabled
          className="bg-[rgb(133,89,244)] text-sm px-[8px] rounded-md"
        >
          Ask
        </button>
      </div>
      <div className="p-[8px]">
        <span className="leading-[20px] font-[400] text-[rgb(112,112,112)] text-[14px]">
          Quickstarts
        </span>
        <div className="flex flex-col gap-[4px] max-h-[400px]">
          <div className="flex gap-[8px] p-[8px] hover:bg-[#323232] cursor-pointer rounded-md text-sm">
            <span>{`->`}</span>
            How do I get started with Supabase?
          </div>
          <div className="flex gap-[8px] p-[8px] hover:bg-[#323232] cursor-pointer rounded-md text-sm">
            <span>{`->`}</span>
            How do I get started with Supabase?
          </div>
          <div className="flex gap-[8px] p-[8px] hover:bg-[#323232] cursor-pointer rounded-md text-sm">
            <span>{`->`}</span>
            How do I get started with Supabase?
          </div>
        </div>
      </div>
    </div>
  );
};
