"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/SvgComps/loading";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  tomorrowNightBright,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

export const YoutubeVideoComponent = ({
  setSessionId,
}: {
  setSessionId: (sessionId: string) => void;
}) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("website");
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
        url + "/api/chat",
        {
          prompt: searchValue,
          projectId: selected === "website" ? "bs-1782" : "",
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        resetChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <h1 className="text-[28px] font-semibold text-center">
        Welcome to Ottomon
      </h1>
      <span className="text-gray-500 text-sm">
        This is just a POC, a lot of cool features will be added soon.
      </span>
      <div className="max-w-[900px] w-full bg-[#191724] rounded-md shadow-lg p-[16px] flex flex-col gap-[16px] animate-fadeIn">
        <div className="flex justify-between gap-[8px] text-center">
          <div
            onClick={() => setSelected("website")}
            className={`${
              selected === "website"
                ? "bg-gray-600 text-white"
                : "text-gray-400"
            } cursor-pointer p-[4px] rounded-md w-full border border-gray-700`}
          >
            Website
          </div>
          <div
            onClick={() => setSelected("youtube")}
            className={`${
              selected === "youtube"
                ? "bg-gray-600 text-white"
                : "text-gray-400"
            } cursor-pointer p-[4px] rounded-md w-full border border-gray-700`}
          >
            Youtube
          </div>
          {/* <div
            onClick={() => setSelected("github")}
            className={`${
              selected === "github" ? "bg-gray-600 text-white" : "text-gray-400"
            } cursor-pointer p-[4px] rounded-md w-full border border-gray-700`}
          >
            Github
          </div> */}
        </div>
        <div className="h-[50vh] chatsHolder flex overflow-scroll flex-col gap-[16px]">
          {chats?.length === 0 ? (
            <>
              <div className="flex flex-col m-auto w-full items-center gap-[8px] text-center">
                <div>
                  Ask questions related to{" "}
                  {selected === "website"
                    ? "Buildspace"
                    : "Kurzgesagt youtube videos"}
                </div>
                {selected === "website" ? (
                  <>
                    <div
                      onClick={() => {
                        handleSearch("What is buildspace?");
                      }}
                      className="rounded-md flex px-[6px] text-center justify-center py-[8px] w-full max-w-[500px] border border-gray-700 cursor-pointer"
                    >
                      <div>What is Buildspace?</div>
                    </div>
                    <div
                      onClick={() => {
                        handleSearch("How much funding has buildspace raised?");
                      }}
                      className="rounded-md flex px-[6px] text-center justify-center py-[8px] w-full max-w-[500px] border border-gray-700 cursor-pointer"
                    >
                      <div>How much funding has buildspace raised?</div>
                    </div>
                    <div
                      onClick={() => {
                        handleSearch("What are buildspace's expansion plans?");
                      }}
                      className="rounded-md flex px-[6px] text-center justify-center py-[8px] w-full max-w-[500px] border border-gray-700 cursor-pointer"
                    >
                      <div>What are buildspace's expansion plans?</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        handleSearch(
                          "What role do black holes play in powering quasars?"
                        );
                      }}
                      className="rounded-md flex px-[6px] text-center justify-center py-[8px] w-full max-w-[500px] border border-gray-700 cursor-pointer"
                    >
                      <div>
                        What role do black holes play in powering quasars?
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        handleSearch(
                          "What embarrassing mistake did Kurzgesagt make in the past?"
                        );
                      }}
                      className="rounded-md flex px-[6px] text-center justify-center py-[8px] w-full max-w-[500px] border border-gray-700 cursor-pointer"
                    >
                      <div>
                        What embarrassing mistake did Kurzgesagt make in the
                        past?
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            ""
          )}
          {chats.map((chat, index) => {
            return (
              <div className="bg-gray-700/50 border-gray-600 p-[8px] rounded-md">
                <span className="text-gray-500 text-xs flex flex-col">
                  {chat?.isSender ? "Ottomon" : "User"}
                </span>
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
            );
          })}
        </div>
        <Input
          value={search}
          // on enter
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(search);
            }
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button
          onClick={!loading ? handleSearch : undefined}
          type="button"
          className={`w-full text-white h-[40px] bg-gradient-to-br ${
            loading
              ? "from-purple-600/10 to-blue-500/10 "
              : "from-purple-600 to-blue-500"
          }  hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm flex  items-center justify-center text-center mr-2 mb-2`}
        >
          {!loading ? "Ask" : <Loading />}
        </button>
      </div>
    </>
  );
};

const Input = (
  props: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & {
    icon?: React.ReactNode;
    hint?: string;
    label?: string;
    error?: string;
    endIcon?: React.ReactNode;
    onEndClick?: () => void;
  }
) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const lineHeight = 20; // Adjust this value to match your textarea's line height
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = React.useState(1);

  const calculateRows = () => {
    const minRows = 1; // Minimum number of rows
    const maxRows = 30; // Maximum number of rows

    const textareaRows = Math.ceil((props?.value + "")?.split?.("\n").length);
    const calculatedRows = Math.min(Math.max(minRows, textareaRows), maxRows);
    console.log({ textareaRows: (props?.value + "")?.split?.("\n") });
    setRows(calculatedRows);
    return calculatedRows * lineHeight;
  };

  return (
    <div className="w-full flex flex-col gap-[4px] prose-nbx">
      {props?.label ? (
        <span className="text-light-neutral-50 dark:text-dark-neutral-50 title2">
          {props?.label}
        </span>
      ) : (
        ""
      )}
      <div
        className={`border text-sm rounded-lg block w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500  min-h-[32px] ${
          props.className || ""
        } ${props?.disabled ? "opacity-[0.7] cursor-not-allowed" : ""}
      rounded-md gap-[8px] flex items-center w-full border dark:border-dark-neutral-800 light-dark-neutral-800 dark:shadow-[0px_0px_0px_1px_#333,0px_1px_2px_0px_rgba(22,22,22,0.36)]`}
      >
        {props?.icon ? <div className="w-[16px]">{props?.icon}</div> : ""}
        <textarea
          {...props}
          ref={ref}
          // rows={calculateRows() / lineHeight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            props?.onChange?.(e);
            calculateRows();
          }}
          rows={rows}
          className={`${
            props.className || ""
          } h-full pb-[px] resize-none p-[8px] pt-[10px] ${
            props?.disabled ? "opacity-[0.7] cursor-not-allowed" : ""
          } outline-none w-full border-0 bg-[transparent] text-light-neutral-50 dark:text-dark-neutral-50 placeholder-light-neutral-200`}
        />

        {props?.endIcon ? (
          <div
            onClick={props?.onEndClick}
            className="w-[16px] cursor-pointer mt-auto"
          >
            {props?.endIcon}
          </div>
        ) : (
          ""
        )}
      </div>
      {props?.hint && !props?.error ? (
        <span className="mt-[2px] regular text-dark-neutral-200">
          {props?.hint ?? ""}
        </span>
      ) : props?.error ? (
        <span className="text-[rgba(223,28,65,1)] flex items-center gap-[4px] regular">
          {props?.error ?? ""}
        </span>
      ) : (
        ""
      )}
    </div>
  );
};

export const RenderCode = ({ children }: { children: any }) => {
  return (
    <pre className="">
      {children?.map((child: any, key: number) => {
        return (
          <code key={key}>
            <SyntaxHighlighter
              language="javascript"
              style={
                // variant === "light" ? vs : tomorrowNightBright
                tomorrowNightBright
              }
            >
              {child?.props?.children ?? ""}
            </SyntaxHighlighter>
          </code>
        );
      })}
    </pre>
  );
};

export default Input;
