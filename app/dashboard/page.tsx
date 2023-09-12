"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "../components/SvgComps/loading";
import { getGitHubRepoFiles } from "../services/ottomon.service";
import { Ottomon } from "ottomon";
import ReactMarkdown from "react-markdown";
import { RenderCode } from "../components/YoutubeVideoComponent";

export default function Home() {
  const [Email, setEmail] = useState<string>("");
  const [addModal, setAddModal] = useState<boolean>(false);
  const [website, setWebsite] = useState<string>("Submit");
  const [botActive, setBotActive] = useState<boolean>(false);
  const [faqs, setFaqs] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string>("");
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
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) return;
    else {
      router.push("/");
    }
  }, []);

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
                          setProjectName(val?.project_name);
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
                {/* {botActive ? (
                  <Ottomon
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
                )} */}
              </div>
            </div>
          </main>
        </div>
      </div>
      {botActive ? (
        <DetailsModal
          projectId={projectId}
          faqs={faqs}
          onClose={() => {
            setBotActive(false);
            setProjectId("");
            setProjectName("");
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
}

const DetailsModal = ({
  projectId,
  faqs,
  onClose,
  projectName,
}: {
  projectId: string;
  faqs: string[];
  onClose: () => void;
  projectName?: string;
}) => {
  const [selected, setSelected] = useState<string>("playground");
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [conversations, setConversations] = useState<any>({});

  useEffect(() => {
    getConversation();
  }, [selected]);

  const getConversation = async () => {
    await axios
      .get(`/otto-api/conversations?projectId=${projectId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setConversations(res?.data?.conversation || {});
      });
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 overflow-hidden flex justify-center items-center">
      {isActivated ? (
        <Ottomon
          faqs={faqs}
          projectId={projectId}
          onClose={() => {
            setIsActivated(false);
          }}
        />
      ) : null}
      <div className="bg-black/40 z-[100] w-full h-full blur-sm absolute top-0 left-0"></div>
      <div className="absolute h-[80vh] w-[800px] bg-[#1b1b1b] rounded-md p-[16px] z-[110] shadow-sm border border-gray-700 flex flex-col ">
        <div className="flex justify-between w-full text-white">
          {projectName}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="none"
            className="cursor-pointer"
            onClick={() => {
              onClose();
            }}
          >
            <path
              fill="#fff"
              d="M14.704 13.29a1.001 1.001 0 1 1-1.416 1.417L8 9.417l-5.29 5.288a1.002 1.002 0 0 1-1.417-1.416L6.583 8 1.296 2.71A1.001 1.001 0 0 1 2.71 1.294L8 6.584l5.29-5.29a1.001 1.001 0 0 1 1.416 1.415L9.416 8l5.288 5.29Z"
            />
          </svg>
        </div>
        <div className="flex gap-[8px] mt-[16px]">
          <div
            onClick={() => setSelected("playground")}
            className={`${
              selected === "playground"
                ? "bg-black text-white"
                : "text-gray-400"
            } cursor-pointer p-[4px] rounded-md w-[150px] border border-gray-700`}
          >
            Playground
          </div>
          <div
            onClick={() => setSelected("conversations")}
            className={`${
              selected === "conversations"
                ? "bg-black text-white"
                : "text-gray-400"
            } cursor-pointer p-[4px] rounded-md w-[150px] border border-gray-700`}
          >
            Conversations
          </div>
        </div>
        {selected === "playground" ? (
          <div className="flex flex-col overflow-scroll">
            <span className="text-xs mt-[16px] flex justify-between items-center">
              {/* Add instructions to use below code */}
              Use below code to add ottomon to your website
              <button
                onClick={() => {
                  setIsActivated(true);
                }}
                className="h-[32px] rounded-md text-sm font-semibold whitespace-nowrap p-[8px] outline-none text-black bg-white"
              >
                Try it out
              </button>
            </span>
            <ReactMarkdown
              className={`markdownHolder mt-0`}
              children={` \`\`\`
import { useState } from "react";
import { Ottomon } from "ottomon";

const MyOttomonBot = () => {
  const [botActive, setBotActive] = useState<boolean>(false);

  return <>
    {botActive?<Ottomon 
      onClose={() => {
        setBotActive(false);
      }}
      projectId="${projectId}" 
      faqs={${JSON.stringify(faqs, undefined, 2)}} />:null}
      <button
        onClick={() => {
          setBotActive(true);
        }}
      >Open Bot</button>
  </>
}
            `}
              components={{
                pre: (props: any) => <RenderCode {...props} />,
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-[8px] mt-[16px] overflow-scroll">
            {(Object.entries(conversations) as any).map(([key, val]) => (
              <div
                key={key}
                className=" p-[16px] w-full rounded-md border border-gray-700 hover:border-white cursor-pointer bg-black"
              >
                {val?.length} messages on{" "}
                {new Date(val?.[0]?.created_at).toLocaleDateString()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
