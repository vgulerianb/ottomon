"use client";
import { useState } from "react";
import { YoutubeVideoComponent } from "./components/YoutubeVideoComponent";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full flex items-center flex-col transition-all">
        <YoutubeVideoComponent setSessionId={setSessionId} />
      </div>
    </div>
  );
}
