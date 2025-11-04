import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Download } from "lucide-react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

interface OutputPanelProps {
  summary: string;
}

// 💡 Word Count Calculation Helper Function
const calculateWordCount = (text: string): number => {
  // Trim whitespace, split by any sequence of whitespace, and filter out empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

const OutputPanel: React.FC<OutputPanelProps> = ({ summary }) => {
  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    Swal.fire({ icon: "success", title: "Copied!", timer: 1000, showConfirmButton: false });
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "summary.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  // 💡 Calculate word count for the summary output
  const outputWordCount = calculateWordCount(summary);

  return (
    <motion.div
      data-aos="fade-left"
      className="flex-1 bg-[#0b0b18] p-4 rounded-lg border border-gray-700 shadow-md flex flex-col gap-3 backdrop-blur-sm"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-400">
        Summary
      </h2>

      <div className="flex-1 bg-[#141427] border border-gray-700 p-3 rounded-lg min-h-[120px] overflow-auto transition-all duration-200 hover:border-purple-600">
        <p className={`text-gray-300 leading-relaxed ${summary ? "" : "text-gray-500 italic"}`}>
          {summary || "✨ Your summarized text will appear here..."}
        </p>
      </div>

      {/* 🔑 OUTPUT WORD COUNT DISPLAY */}
      <p className="text-sm text-gray-400">
        Output Words: <span className="font-bold text-white">{outputWordCount}</span>
      </p>

      <div className="flex gap-3 mt-3">
        <button
          onClick={handleCopy}
          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Copy size={16} /> Copy
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Download size={16} /> Download
        </button>
      </div>
    </motion.div>
  );
};

export default OutputPanel;