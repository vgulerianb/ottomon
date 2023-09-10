"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { RenderCode } from "../components/YoutubeVideoComponent";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "../components/SvgComps/loading";
import { getGitHubRepoFiles } from "../services/ottomon.service";

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
  const [faqs, setFaqs] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) return;
    else {
      router.push("/");
    }
  }, []);

  const [projectName, setProjectName] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("website");
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [urlsFound, setUrlsFound] = useState<number>(0);
  const [urlMeta, setUrlMeta] = useState<
    {
      content: string;
      fileUrl: string;
      url: string;
    }[]
  >([]);

  useEffect(() => {
    if (!addModal) return;
    setProjectName("");
    setProjectType("website");
    setUrl("");
    setUrlsFound(0);
    setUrlMeta([]);
  }, [addModal]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    await axios
      .get("/otto-api/project", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        setProjects(res?.data?.projects || []);
      });
  };

  const createNewProject = async () => {
    setLoading(true);

    setTimeout(async () => {
      await axios
        .post(
          "/otto-api/project",
          {
            name: projectName,
            type: projectType,
            url: url,
            urlMeta:
              projectType === "github"
                ? await getGitHubRepoFiles(url)
                : undefined,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setUrlsFound(res?.data?.finalResponse);
          getProjects();
          setTimeout(() => {
            setLoading(false);
          }, 60000);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      setAddModal(false);
    });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {loading ? (
        <div className="fixed w-full h-full flex justify-center items-center z-[1200]">
          <div className="bg-[#131313]/30 w-full h-full absolute top-0 left-0 blur-[20px]"></div>
          <div className="w-[250px] relative z-[1210] flex-col gap-[4px] bg-[#131313] rounded-md p-[16px] border-gray-700 border flex justify-center items-center">
            <Loading />
            <span>Please wait</span>
            {urlsFound ? (
              <span className="text-xs text-center">
                {urlsFound} Resources found on given url. Please wait while we
                process them this can take upto 2 minutes.
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {addModal ? (
        <>
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-[100]">
            <div className="w-[700px] bg-black flex flex-col relative  rounded-md border border-gray-700">
              <div className="p-[8px] text-white border-b border-gray-700">
                New Project
              </div>
              <div className="p-[16px] text-white border-b border-gray-700 flex flex-col">
                <input
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                  placeholder="Project Name"
                  className="text-white/70 outline-none w-full border-gray-700 border p-[4px] bg-black text-xs rounded-md"
                />
                <span className="text-xs text-white/80 mt-[16px]">
                  Bot Type
                </span>
                <div className="flex gap-[16px]">
                  <div
                    onClick={() => {
                      setProjectType("website");
                    }}
                    className={`py-[12px] rounded-md mt-[4px] w-[200px] flex flex-col gap-[8px] items-center border ${
                      projectType === "website"
                        ? "border-white"
                        : "border-gray-700"
                    } cursor-pointer`}
                  >
                    <img src="/web.png" width={32} height={32} alt="ottomon" />
                    <span className="text-white/70 text-sm">Website</span>
                  </div>
                  <div
                    onClick={() => {
                      setProjectType("youtube");
                    }}
                    className={`py-[12px] rounded-md mt-[4px] w-[200px] flex flex-col gap-[8px] items-center border ${
                      projectType === "youtube"
                        ? "border-white"
                        : "border-gray-700"
                    } cursor-pointer`}
                  >
                    <img src="/you.png" width={32} height={32} alt="ottomon" />
                    <span className="text-white/70 text-sm">Youtube</span>
                  </div>
                  <div
                    onClick={() => {
                      setProjectType("github");
                    }}
                    className={`py-[12px] rounded-md mt-[4px] w-[200px] flex flex-col gap-[8px] items-center border ${
                      projectType === "github"
                        ? "border-white"
                        : "border-gray-700"
                    } cursor-pointer`}
                  >
                    <img src="/you.png" width={32} height={32} alt="ottomon" />
                    <span className="text-white/70 text-sm">Github</span>
                  </div>
                </div>
                <span className="text-xs text-white/80 mt-[16px] uppercase">
                  {projectType === "website"
                    ? "Website Url"
                    : projectType === "github"
                    ? "Github repo url"
                    : "Youtube channel url"}
                </span>
                <input
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                  placeholder={
                    projectType === "website"
                      ? "https://buildspace.io"
                      : projectType === "github"
                      ? "https://github.com/vgulerianb/ottomon"
                      : "https://youtube.com/channel/83883"
                  }
                  className="text-white/70 mt-[4px] outline-none w-full border-gray-700 border p-[4px] bg-black text-xs h-[32px] rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    createNewProject();
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
        <div
          className="cursor-pointer relative z-30"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/");
          }}
        >
          Logout
        </div>
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
                  <div className="bg-green-800/20 p-[8px] mb-[16px] w-full rounded-md text-sm">
                    Detailed dashboard and reports coming soon
                  </div>
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
                  <div className="flex gap-[16px] flex-wrap items-center justify-start w-full mt-[32px]">
                    {projects?.map((val) => (
                      <div
                        onClick={() => {
                          setBotActive(true);
                          setProjectId(val?.project_id);
                          setFaqs(val?.faqs?.[0]?.questions || []);
                        }}
                        key={val?.project_id}
                        className=" p-[16px] w-[250px] rounded-md border border-gray-700 hover:border-white cursor-pointer bg-black"
                      >
                        <div className="flex gap-[8px] items-center ">
                          <img
                            src="/web.png"
                            alt="ottomon"
                            className="h-[28px] w-[28px] grayscale"
                          />
                          <div className="flex flex-col text-left">
                            <span className="text-white text-sm font-semibold">
                              {val?.project_name}
                            </span>
                            <span className="text-white/70 text-sm">
                              No description
                            </span>
                          </div>
                        </div>
                        <div className="w-full buildspacecard text-left text-white/70 mt-[30px] flex justify-between">
                          <span className="text-xs font-semibold ">
                            Created on{" "}
                            <span>
                              {new Date(val?.created_at).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {botActive ? (
                  <BotBoddy
                    faqs={faqs}
                    projectId={projectId}
                    onClose={() => {
                      setBotActive(false);
                      setProjectId("");
                      setFaqs([]);
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

const BotBoddy = ({
  onClose,
  projectId,
  faqs,
}: {
  onClose: () => void;
  projectId: string;
  faqs: string[];
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [chats, setChats] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const scrollToBottom = () => {
    const chatsHolder = document.querySelector(".chatsHolder");
    if (chatsHolder) {
      chatsHolder.scrollTop = chatsHolder.scrollHeight;
    }
  };
  const [session, setSession] = useState<string>("");

  useEffect(() => {
    if (session === "") {
      setSession(Math.random().toString(36).substring(7) + Date.now());
    }
    setChats([]);
  }, []);

  const handleSearch = async (val) => {
    if (loading) return;
    scrollToBottom();
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
        "/api/ask",
        {
          query: searchValue,
          projectId: projectId,
          sessionId: session,
          history:
            chats?.map((chat) => ({
              role: chat?.isSender ? "user" : "assistant",
              content: chat?.msg,
            })) || [],
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
        className="bg-[#1b1b1b] mx-[8px] shadow-sm flex flex-col text-start z-[1000] w-full max-w-[650px] relative border-[rgba(40,40,40,.9)] rounded-md border"
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
              className="w-full h-full bg-transparent outline-none text-white placeholder-gray-500/80 text-sm"
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
              {faqs.map((faq, key) => (
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
        <div className="max-h-[500px] h-full overflow-scroll chatsHolder">
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
                      className={`markdownHolder overflow-scroll`}
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
        </div>

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
              className="w-full h-full bg-transparent text-sm outline-none text-white placeholder-gray-500/80"
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
        <div className="flex text-xs justify-center items-center py-[4px]">
          Powered by Ottomon
        </div>
      </div>
    </div>
  );
};
