import React, { useState, useMemo } from "react";
import { 
  Database, 
  Search, 
  ExternalLink
} from "lucide-react";
import DatasetCard from "../components/DatasetCard";

export default function DatasetsView({ datasets }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All", 
    "Source Code & Programming", 
    "Audio & Speech", 
    "Developer Experience & Education", 
    "NLP & Synthetic Knowledge"
  ];

  const filtered = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchQuery = !query || 
        dataset.name.toLowerCase().includes(query.toLowerCase()) ||
        dataset.description.toLowerCase().includes(query.toLowerCase()) ||
        dataset.source.toLowerCase().includes(query.toLowerCase());

      const matchCat = selectedCategory === "All" || dataset.category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchQuery && matchCat;
    });
  }, [datasets, query, selectedCategory]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-[#273449] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/50">
              <Database className="w-5 h-5 text-blue-600 dark:text-[#60A5FA]" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              Open <span className="text-blue-600 dark:text-[#60A5FA]">Datasets</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Discover benchmark open-source training data, code corpora, and audio datasets from Hugging Face & Kaggle.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="https://huggingface.co/datasets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-xs text-slate-700 dark:text-[#CBD5E1] font-medium transition-all shadow-2xs"
          >
            <span>Hugging Face</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </a>
          <a
            href="https://www.kaggle.com/datasets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-xs text-slate-700 dark:text-[#CBD5E1] font-medium transition-all shadow-2xs"
          >
            <span>Kaggle</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </a>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-4">
        
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search datasets by name or source..."
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-600 dark:text-[#CBD5E1] font-semibold mr-1">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                selectedCategory === c
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60 shadow-2xs"
                  : "bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-[#273449] hover:bg-slate-100 dark:hover:bg-[#1E293B]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </div>

    </div>
  );
}
