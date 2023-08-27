"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { RenderCode } from "../components/YoutubeVideoComponent";
import axios from "axios";
import Link from "next/link";

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
  const [created, setCreated] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [website, setWebsite] = useState<string>("Submit");
  const [botActive, setBotActive] = useState<boolean>(false);

  const handleSubmit = async () => {
    // regex for email
    if (!Email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address");
      return;
    }
    await axios
      .post("/api/waitlist", {
        email: Email,
      })
      .then(() => {
        setEmail("");
        alert("You've been added to the waitlist!");
      });
  };

  const startTimer = () => {
    // change website to Submitting... after 3 second Genrating FAQs
    setWebsite("Submitting...");
    setTimeout(() => {
      // change website to Submit after 3 second Genrating FAQs
      setWebsite("Generating FAQs...");
      // setCreated(true);
      // setAddModal(false);
      setTimeout(() => {
        // change website to Submit after 3 second Genrating FAQs
        setWebsite("Generated!");
        setCreated(true);
        setAddModal(false);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {addModal ? (
        <>
          <div className="w-screen h-screen fixed top-0 left-0 bg-black/40 z-[1000] flex justify-center items-center">
            <div className="w-[700px] bg-black flex flex-col relative z-[1000] rounded-md border border-gray-700">
              <div className="p-[8px] text-white border-b border-gray-700">
                New Project
              </div>
              <div className="p-[16px] text-white border-b border-gray-700 flex flex-col">
                <input
                  placeholder="Project Name"
                  className="text-white/70 outline-none w-full border-gray-700 border p-[4px] bg-black text-xs rounded-md"
                />
                <span className="text-xs text-white/80 mt-[16px]">
                  Bot Type
                </span>
                <div className="flex gap-[16px]">
                  <div className="py-[12px] rounded-md mt-[4px] w-[200px] flex flex-col gap-[8px] items-center border border-white cursor-pointer">
                    <img src="/web.png" width={32} height={32} alt="ottomon" />
                    <span className="text-white/70 text-sm">Website</span>
                  </div>
                  <div className="py-[12px] rounded-md mt-[4px] w-[200px] flex flex-col gap-[8px] items-center border border-gray-700 cursor-pointer">
                    <img src="/you.png" width={32} height={32} alt="ottomon" />
                    <span className="text-white/70 text-sm">Youtube</span>
                  </div>
                </div>
                <span className="text-xs text-white/80 mt-[16px]">Website</span>
                <input
                  placeholder="https://ottomon.in"
                  className="text-white/70 mt-[4px] outline-none w-full border-gray-700 border p-[4px] bg-black text-xs h-[32px] rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    startTimer();
                  }}
                  className={`mt-[16px] w-full text-white h-[40px] bg-gradient-to-br ${"from-purple-600 to-blue-500"}  hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm flex  items-center justify-center text-center mr-2 mb-2`}
                >
                  {website}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <div className="fixed top-0 flex items-center w-full z-50 p-[16px] max-w-[1200px] justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" width={32} height={32} alt="ottomon" />
        </div>
        <Link
          className="flex gap-[16px] items-center cursor-pointer"
          target="_blank"
          href="https://x.com/vguleria19"
        >
          {/* <svg
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
          </svg> */}
          <div className="bg-red-800 rounded-full w-[32px] h-[32px] flex justify-center text-sm items-center text-white">
            V
          </div>
        </Link>
      </div>
      {/* <Script src="/particles.js" /> */}
      <div className="w-full flex items-center flex-col transition-all h-full">
        <div className="relative font-inter antialiased w-full h-fit">
          <main className="relative min-h-screen flex flex-col bg-[#131313] overflow-hidden">
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
                  <div className="flex gap-[8px] max-w-[1200px] w-full items-center ">
                    <input
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[32px] w-full rounded-md bg-[rgba(89,89,89,0.6)] p-[8px] outline-none"
                      placeholder="Search projects"
                    />
                    <button
                      onClick={() => {
                        setAddModal(true);
                      }}
                      className="h-[32px] rounded-md text-sm font-semibold whitespace-nowrap p-[8px] outline-none text-black bg-white"
                    >
                      Add New
                    </button>
                  </div>
                  <div className="flex gap-[16px] items-center justify-start w-full mt-[32px]">
                    {created ? (
                      <div
                        onClick={() => {
                          setBotActive(true);
                        }}
                        className=" p-[16px] rounded-md border border-gray-700 hover:border-white cursor-pointer bg-black"
                      >
                        <div className="flex gap-[8px] items-center ">
                          <img
                            src="/web.png"
                            alt="ottomon"
                            className="h-[28px] w-[28px] grayscale"
                          />
                          <div className="flex flex-col text-left">
                            <span className="text-white text-sm font-semibold">
                              Buildspace
                            </span>
                            <span className="text-white/70 text-sm">
                              Bot for buildspace website
                            </span>
                          </div>
                        </div>
                        <div className="w-full buildspacecard text-left text-white/70 mt-[30px] flex justify-between">
                          <span className="text-xs font-semibold ">
                            Created by <span>Vikrant</span>
                          </span>
                          {/* <button className="bg-[rgb(133,89,244)] text-white  text-sm px-[8px] rounded-md">
                          Try me
                        </button> */}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className=" p-[16px] rounded-md border border-gray-700 hover:border-white cursor-pointer bg-black">
                      <div className="flex gap-[8px] items-center ">
                        <img
                          src="/you.png"
                          alt="ottomon"
                          className="h-[28px] w-[28px] grayscale"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-white text-sm font-semibold">
                            Kurzgesagt
                          </span>
                          <span className="text-white/70 text-sm">
                            Bot for Kurzgesagt youtube
                          </span>
                        </div>
                      </div>
                      <div className="w-full buildspacecard text-left text-white/70 mt-[30px] flex justify-between">
                        <span className="text-xs font-semibold ">
                          Created by <span>Vikrant</span>
                        </span>
                        {/* <button className="bg-[rgb(133,89,244)] text-white  text-sm px-[8px] rounded-md">
                          Try me
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
                {botActive ? (
                  <BotBoddy
                    onClose={() => {
                      setBotActive(false);
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const BotBoddy = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [chats, setChats] = useState<any[]>([]);
  const [value, setValue] = useState<string>("");
  const [search, setSearch] = useState("");
  const scrollToBottom = () => {
    const chatsHolder = document.querySelector(".chatsHolder");
    if (chatsHolder) {
      chatsHolder.scrollTop = chatsHolder.scrollHeight;
    }
  };
  const [selected, setSelected] = useState<string>("buildspace");
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setChats([]);
  }, [selected]);

  const handleSearch = async (val) => {
    if (loading) return;
    const searchValue = val || search.trim();
    setSearch("");
    setChats((prev) => [
      ...prev,
      {
        msg: val || search,
        isSender: true,
      },
      {
        msg: "",
        isSender: false,
      },
    ]);
    setLoading(true);

    await axios
      .post(
        "/api/chat",
        {
          prompt: searchValue,
          projectId: selected === "buildspace" ? "bs-1782" : "",
        },
        {
          onDownloadProgress: (progressEvent: any) => {
            console.log({ progressEvent });
            if (progressEvent?.event?.target?.response)
              setAnswer(progressEvent?.event?.target?.response);
          },
        }
      )
      .then((response) => {
        setAnswer(response?.data);
      })
      .catch(() => {
        setAnswer("Something went wrong, please try again later.");
      });
    setLoading(false);
    setTimeout(() => {
      setAnswer("");
    });
  };

  const resetChat = () => {
    setChats([]);
  };

  useEffect(() => {
    scrollToBottom();
    if (answer !== "") {
      let tempChats = [...chats];
      tempChats[tempChats.length - 1].msg = answer;
      setChats(tempChats);
    }
  }, [answer, loading]);

  return (
    <div
      onClick={onClose}
      className="fixed bg-black/40 w-screen h-screen top-0 left-0 flex justify-center items-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-[#1b1b1b] shadow-sm flex flex-col text-start z-[1000] w-full max-w-[700px] mx-auto relative border-[rgba(40,40,40,.9)] rounded-md border"
      >
        {!chats?.length ? (
          <div className="w-full border-b p-[8px] flex items-center border-[rgba(40,40,40)]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(search);
                }
              }}
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
        ) : (
          ""
        )}
        {!chats?.length ? (
          <div className="p-[8px]">
            <span className="leading-[20px] font-[400] text-[rgb(112,112,112)] text-[14px]">
              Quickstarts
            </span>
            <div className="flex flex-col gap-[4px] max-h-[400px]">
              {Faqs[selected].map((faq, key) => (
                <div
                  key={key}
                  onClick={() => {
                    setSearch(faq);
                    handleSearch(faq);
                  }}
                  className="flex gap-[8px] p-[8px] hover:bg-[#323232] cursor-pointer rounded-md text-sm"
                >
                  <span>{`->`}</span>
                  {faq}
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}

        {chats?.length ? (
          <div className="flex flex-col gap-[8px] p-[16px]">
            {chats.map((chat, index) =>
              !loading ||
              answer !== "" ||
              chats?.length !== index + 1 ||
              chat.isSender ? (
                <div className="flex gap-[8px]">
                  {!chat?.isSender ? (
                    <Image
                      src="/logo.png"
                      width={32}
                      height={32}
                      alt="ottomon"
                      className="h-[32px]"
                    />
                  ) : (
                    <div className="flex justify-center items-center border border-white/60 w-[32px] h-[32px] min-w-[32px] rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                  <ReactMarkdown
                    className={`markdownHolder`}
                    children={
                      (answer !== "" && index === chats.length - 1
                        ? answer
                        : chat?.msg?.includes?.("[DISCLAIMER]")
                        ? chat?.msg?.replace?.("[DISCLAIMER]", "")
                        : chat?.msg
                      )?.split("+Sources+")[0]
                    }
                    components={{
                      pre: (props: any) => <RenderCode {...props} />,
                    }}
                  />
                </div>
              ) : (
                ""
              )
            )}
          </div>
        ) : (
          ""
        )}
        {loading && answer === "" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textAlign: "center",
              color: "#ffffff",
              paddingTop: "16px",
              paddingBottom: "16px",
              fontSize: "14px",
              borderTop: `1px solid rgba(255, 255, 255, 0.6)`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48px"
              height="48px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <g>
                <circle cx="60" cy="50" r="4" fill="#7cb9e8">
                  <animate
                    attributeName="cx"
                    repeatCount="indefinite"
                    dur="0.9900990099009901s"
                    values="95;35"
                    keyTimes="0;1"
                    begin="-0.6767000000000001s"
                  ></animate>
                  <animate
                    attributeName="fill-opacity"
                    repeatCount="indefinite"
                    dur="0.9900990099009901s"
                    values="0;1;1"
                    keyTimes="0;0.2;1"
                    begin="-0.6767000000000001s"
                  ></animate>
                </circle>
                <circle cx="60" cy="50" r="4" fill="#7cb9e8">
                  <animate
                    attributeName="cx"
                    repeatCount="indefinite"
                    dur="0.9900990099009901s"
                    values="95;35"
                    keyTimes="0;1"
                    begin="-0.33330000000000004s"
                  ></animate>
                  <animate
                    attributeName="fill-opacity"
                    repeatCount="indefinite"
                    dur="0.9900990099009901s"
                    values="0;1;1"
                    keyTimes="0;0.2;1"
                    begin="-0.33330000000000004s"
                  ></animate>
                </circle>
                <circle cx="60" cy="50" r="4" fill="#7cb9e8">
                  <animate
                    attributeName="cx"
                    repeatCount="indefinite"
                    dur="0.9900990099009901s"
                    values="95;35"
                    keyTimes="0;1"
                    begin="0s"
                  ></animate>
                  <animate
                    attributeName="fill-opacity"
                    repeatCount="indefinite"
                    dur="0.9900990099009901s"
                    values="0;1;1"
                    keyTimes="0;0.2;1"
                    begin="0s"
                  ></animate>
                </circle>
              </g>
              <g transform="translate(-15 0)">
                <path
                  d="M50 50L20 50A30 30 0 0 0 80 50Z"
                  fill="#1e88e5"
                  transform="rotate(90 50 50)"
                ></path>
                <path d="M50 50L20 50A30 30 0 0 0 80 50Z" fill="#1e88e5">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="0.9900990099009901s"
                    values="0 50 50;45 50 50;0 50 50"
                    keyTimes="0;0.5;1"
                  ></animateTransform>
                </path>
                <path d="M50 50L20 50A30 30 0 0 1 80 50Z" fill="#1e88e5">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="0.9900990099009901s"
                    values="0 50 50;-45 50 50;0 50 50"
                    keyTimes="0;0.5;1"
                  ></animateTransform>
                </path>
              </g>
            </svg>{" "}
            Searching. This may take a second!
          </div>
        ) : (
          ""
        )}
        {chats?.length ? (
          <div className="w-full border-t p-[8px] flex items-center border-[rgba(40,40,40)]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(search);
                }
              }}
              className="w-full h-full bg-transparent outline-none text-white placeholder-gray-500/80"
              placeholder="Ask me something"
            />
            <button
              onClick={!loading ? handleSearch : undefined}
              disabled={loading}
              className="bg-[rgb(133,89,244)] text-sm px-[8px] rounded-md"
            >
              Ask
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
