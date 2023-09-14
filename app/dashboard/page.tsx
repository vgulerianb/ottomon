"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "../components/SvgComps/loading";
import { getGitHubRepoFiles } from "../services/ottomon.service";
import { AddProjectModel } from "../components/AddProjectModel";
import { DetailsModal } from "../components/DetailsModal";

export default function Home() {
  const [Email, setEmail] = useState<string>("");
  const [addModal, setAddModal] = useState<boolean>(false);
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
          <AddProjectModel
            createNewProject={createNewProject}
            projectName={projectName}
            projectType={projectType}
            setProjectType={setProjectType}
            setProjectName={setProjectName}
            setUrl={setUrl}
            url={url}
          />
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
