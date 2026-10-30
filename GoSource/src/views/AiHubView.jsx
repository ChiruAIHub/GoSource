import React, { useState, useMemo } from "react";
import { 
  Cpu, 
  Search, 
  ExternalLink
} from "lucide-react";
import ModelCard from "../components/ModelCard";

export default function AiHubView({ aiModels }) {
  const [query, setQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState("All");

  const tasks = [
    "All", 
    "Text Generation", 
    "Text-to-Image", 
    "Code Generation", 
    "Automatic Speech Recognition"
  ];

  const filtered = useMemo(() => {
    return aiModels.filter((model) => {
      const matchQuery = !query || 
        model.name.toLowerCase().includes(query.toLowerCase()) ||
        model.creator.toLowerCase().includes(query.toLowerCase()) ||
        model.description.toLowerCase().includes(query.toLowerCase());

      const matchTask = selectedTask === "All" || model.task.toLowerCase().includes(selectedTask.toLowerCase());

      return matchQuery && matchTask;
    });
  }, [aiModels, query, selectedTask]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-[#273449] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-[#A78BFA] border border-violet-200 dark:border-violet-800/50">
              <Cpu className="w-5 h-5 text-violet-600 dark:text-[#A78BFA]" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              AI Models & <span className="text-violet-600 dark:text-[#A78BFA]">Open Weights</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Discover top open-weights models (DeepSeek, Llama, FLUX, Qwen) with ready-to-run Python code snippets.
          </p>
        </div>

        <a
          href="https://huggingface.co/models"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-xs text-slate-700 dark:text-[#CBD5E1] font-medium transition-all self-start md:self-auto shadow-2xs"
        >
          <span>Official Hugging Face Hub</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        </a>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-4">
        
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI models by name (e.g. DeepSeek, Llama, FLUX, Whisper)..."
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/50 transition-all"
          />
        </div>

        {/* Task Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-600 dark:text-[#CBD5E1] font-semibold mr-1">Filter by Task:</span>
          {tasks.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTask(t)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                selectedTask === t
                  ? "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-[#A78BFA] border border-violet-200 dark:border-violet-800/60 shadow-2xs"
                  : "bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-[#273449] hover:bg-slate-100 dark:hover:bg-[#1E293B]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

    </div>
  );
}
