"use client";

import Script from "next/script";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { RenderCode } from "./components/YoutubeVideoComponent";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Magic } from "magic-sdk";
import Loading from "./components/SvgComps/loading";
import { Ottomon } from "ottomon";

const Faqs = {
  buildspace: [
    "What is Buildspace?",
    "How much funding has buildspace raised?",
    "What are buildspace's expansion plans?",
  ],
  kurzgesagt: [
    "What is Kurzgesagt?",
    "What role do black holes play in powering quasars?",
    "What embarrassing mistake did Kurzgesagt make in the past?",
  ],
};

export default function Home() {
  const [Email, setEmail] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleSubmit = async () => {
    // regex for email
    if (!Email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address");
      return;
    }
    const magic = new Magic("pk_live_0D93C29D7C5BA056", { network: "mainnet" });

    setLoading(true);
    magic.auth
      .loginWithEmailOTP({ email: Email })
      .then((didToken) => {
        axios
          .post("/otto-api/login", { token: didToken })
          .then((response) => {
            localStorage.setItem("token", response?.data?.jwtToken);
            setEmail("");
            setIsLoggedIn(true);
            router.push("/dashboard");
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        alert("Something went wrong, please try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {loading ? (
        <div className="fixed w-full h-full flex justify-center items-center z-[1200]">
          <div className="bg-[#131313]/30 w-full h-full absolute top-0 left-0 blur-[20px]"></div>
          <div className="w-[150px] relative z-[1210] flex-col gap-[4px] bg-[#131313] rounded-md p-[16px] border-gray-700 border flex justify-center items-center">
            <Loading />
            <span>Please wait</span>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="fixed top-0 flex items-center w-full z-50 p-[16px] max-w-[800px] justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" width={32} height={32} alt="ottomon" />
        </div>
        <Link
          className="flex gap-[16px] items-center cursor-pointer"
          target="_blank"
          href="https://x.com/vguleria19"
        >
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
          {isLoggedIn ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/dashboard");
              }}
              className="h-[36px] rounded-md text-sm font-medium whitespace-nowrap p-[8px] outline-none text-black bg-white"
            >
              Dashboard
            </button>
          ) : (
            ""
          )}
        </Link>
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
                  {!isLoggedIn ? (
                    <div className="flex gap-[8px] max-w-[500px] items-center ">
                      <input
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-[50px] w-full rounded-md bg-[rgba(89,89,89,0.6)] p-[8px] outline-none"
                        placeholder="Your Email Address"
                      />
                      <button
                        onClick={handleSubmit}
                        className="h-[50px] w-[140px] rounded-md text-sm font-semibold whitespace-nowrap p-[8px] outline-none text-black bg-white"
                      >
                        Login
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mt-[60px] text-3xl">Examples</div>
                <BotBoddy />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
