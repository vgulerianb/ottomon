import axios from "axios";
import { Ottomon } from "ottomon";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { RenderCode } from "./YoutubeVideoComponent";

export const DetailsModal = ({
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
