// src/pages/SummarizerPage.tsx

"use client";

import React, { useState } from "react";
import InputPanel from "../component/InputPanel";
import OutputPanel from "../component/OutputPanel";
import Layout from "../component/Layout";

const SummarizerPage: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"paragraph" | "bullet">("paragraph");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [summary, setSummary] = useState<string>("");

  return (
    <Layout>
      <div
        className="min-h-full w-full flex flex-col gap-6 p-6 md:p-10
          bg-gradient-to-br from-[#030014] via-[#1a0a2f] to-[#0c0420] 
          text-white transition-all duration-300"
      >
        {/* Welcome Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          AI Summarizer Tool ✨
        </h1>

        {/* Panels (Side-by-Side) */}
        <div className="flex flex-col md:flex-row gap-6">
          <InputPanel
            text={text}
            setText={setText}
            file={file}
            setFile={setFile}
            mode={mode}
            setMode={setMode}
            length={length}
            setLength={setLength}
            setSummary={setSummary}
          />
          <OutputPanel summary={summary} />
        </div>
      </div>
    </Layout>
  );
};

export default SummarizerPage;