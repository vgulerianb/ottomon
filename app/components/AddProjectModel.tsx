export const AddProjectModel = ({
  projectType,
  projectName,
  setProjectType,
  setProjectName,
  createNewProject,
  setUrl,
  url,
}: {
  projectType: string;
  projectName: string;
  setProjectType: Function;
  setProjectName: Function;
  createNewProject: Function;
  setUrl: Function;
  url: string;
}) => {
  return (
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
          <span className="text-xs text-white/80 mt-[16px]">Bot Type</span>
          <div className="flex gap-[16px]">
            <div
              onClick={() => {
                setProjectType("website");
              }}
              className={`py-[12px] rounded-md mt-[4px] w-[200px] flex flex-col gap-[8px] items-center border ${
                projectType === "website" ? "border-white" : "border-gray-700"
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
                projectType === "youtube" ? "border-white" : "border-gray-700"
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
                projectType === "github" ? "border-white" : "border-gray-700"
              } cursor-pointer`}
            >
              <img src="/git.svg" width={32} height={32} alt="ottomon" />
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
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
