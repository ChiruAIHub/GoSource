import React, { useState } from "react";
import { 
  Cpu, 
  Download, 
  Heart, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal
} from "lucide-react";

export default function ModelCard({ model }) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(model.pipelineCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-interactive flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] hover:border-violet-300 dark:hover:border-violet-500 p-5 shadow-xs">
      
      <div>
        {/* Creator & Task */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-[#94A3B8]">
            {model.creator} /
          </span>
          <span className="filter-badge-animated text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-[#A78BFA] border border-violet-200 dark:border-violet-800/60">
            {model.task}
          </span>
        </div>

        {/* Model Name */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] mb-2 flex items-center gap-1.5 group">
          <Cpu className="w-4 h-4 text-violet-600 dark:text-[#A78BFA] transition-transform duration-300 group-hover:rotate-12" />
          <span className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{model.name}</span>
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-[#CBD5E1] line-clamp-2 mb-4 leading-relaxed">
          {model.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="filter-badge-animated text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60">
            {model.parameters}
          </span>
          {model.tags?.map((tag) => (
            <span key={tag} className="filter-badge-animated text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-50 dark:bg-[#1E293B] text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-[#273449]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Code Drawer (Optional) */}
      {showCode && (
        <div className="animate-slide-down mb-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-200 relative shadow-inner">
          <div className="flex items-center justify-between mb-1.5 text-slate-400">
            <span className="text-[10px] font-semibold text-slate-300">Python Transformers Code:</span>
            <button onClick={copyCode} className="btn-animated text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]">
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="overflow-x-auto text-[10px] text-cyan-200 leading-relaxed">
            {model.pipelineCode}
          </pre>
        </div>
      )}

      {/* Footer Stats & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#273449]/70">
        
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8] mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-600 dark:text-[#CBD5E1]" title="Downloads">
              <Download className="w-3 h-3 text-slate-400" />
              <span>{model.downloads}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-[#CBD5E1]" title="Likes">
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500/20" />
              <span>{model.likes}</span>
            </span>
          </div>

          <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-mono">
            {model.license}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle blue-to-violet gradient button for AI Action */}
          <button
            onClick={() => setShowCode(!showCode)}
            className="btn-animated btn-shimmer flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-xs font-semibold shadow-xs"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showCode ? "Hide Code" : "Inference Code"}</span>
          </button>

          <a
            href={model.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-animated p-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#273449] text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-[#273449] shadow-2xs"
            title="Open on Hugging Face"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
