import React, { useState } from "react";
import { 
  Database, 
  Download, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Table
} from "lucide-react";

export default function DatasetCard({ dataset }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="card-interactive flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] hover:border-blue-300 dark:hover:border-blue-500/50 p-5 shadow-xs">
      
      <div>
        {/* Source & Category */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-[#60A5FA]">
            {dataset.source}
          </span>
          <span className="filter-badge-animated text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-[#CBD5E1] border border-slate-200 dark:border-[#273449]">
            {dataset.category}
          </span>
        </div>

        {/* Dataset Title */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] mb-2 flex items-center gap-1.5 group">
          <Database className="w-4 h-4 text-blue-600 dark:text-[#60A5FA] transition-transform duration-300 group-hover:scale-110" />
          <span className="group-hover:text-blue-600 dark:group-hover:text-[#60A5FA] transition-colors">{dataset.name}</span>
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-[#94A3B8] line-clamp-2 mb-4 leading-relaxed">
          {dataset.description}
        </p>

        {/* Meta Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="filter-badge-animated text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 dark:bg-[#1E293B] text-slate-700 dark:text-[#CBD5E1] border border-slate-200 dark:border-[#273449]">
            Size: {dataset.size}
          </span>
          <span className="filter-badge-animated text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-[#1E293B] text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-[#273449]">
            Format: {dataset.format}
          </span>
          <span className="filter-badge-animated text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 font-semibold">
            Usability: {dataset.usabilityScore} / 10
          </span>
        </div>
      </div>

      {/* Interactive Table Preview Drawer */}
      {showPreview && dataset.previewRows && (
        <div className="animate-slide-down mb-4 p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] overflow-x-auto text-[11px]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] mb-2">
            <Table className="w-3.5 h-3.5 text-blue-600 dark:text-[#60A5FA]" />
            <span>Sample Records:</span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#273449] text-slate-500 dark:text-[#94A3B8] font-mono text-[10px]">
                {Object.keys(dataset.previewRows[0]).map((key) => (
                  <th key={key} className="py-1 px-2 uppercase font-semibold">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.previewRows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-200/60 dark:border-[#273449]/60 text-slate-700 dark:text-[#CBD5E1] text-[10px] hover:bg-white/60 dark:hover:bg-[#1E293B]/60 transition-colors">
                  {Object.values(row).map((val, cIdx) => (
                    <td key={cIdx} className="py-1.5 px-2 font-mono truncate max-w-[150px]">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Stats & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#273449]">
        
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8] mb-3">
          <span className="flex items-center gap-1 text-slate-600 dark:text-[#CBD5E1]" title="Downloads">
            <Download className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{dataset.downloads} downloads</span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-mono">
            {dataset.license}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-animated flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-[#1E293B]/80 text-slate-700 dark:text-[#CBD5E1] hover:text-blue-700 dark:hover:text-[#60A5FA] text-xs font-semibold border border-slate-200 dark:border-[#273449] hover:border-blue-200 dark:hover:border-blue-700/60 shadow-2xs"
          >
            <span>{showPreview ? "Hide Preview" : "View Sample Rows"}</span>
            {showPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <a
            href={dataset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-animated p-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#273449] text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-[#F8FAFC] border border-slate-200 dark:border-[#273449] shadow-2xs"
            title="Open Dataset Source"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
