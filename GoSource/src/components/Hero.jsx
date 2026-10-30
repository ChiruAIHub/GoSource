import React, { useState } from "react";
import { 
  Search, 
  ArrowRight, 
  GitPullRequest, 
  Cpu, 
  Terminal,
  Zap
} from "lucide-react";

export default function Hero({ 
  onSearch, 
  selectedSkills, 
  onToggleSkill, 
  allSkills, 
  setActiveTab,
  onOpenRoadmap 
}) {
  const [query, setQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, searchCategory);
  };

  return (
    <div className="relative overflow-hidden pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-slate-800/60 bg-gradient-to-b from-[#0a0f1e] via-[#090d18] to-[#080b11]">
      {/* Background glow meshes */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Eyebrow Pill */}
          <div className="animate-float inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/70 text-slate-300 text-xs font-medium mb-4 sm:mb-6 shadow-sm max-w-full truncate">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="text-cyan-400 font-semibold shrink-0">Open Source Launchpad:</span>
            <span className="truncate">Unifying GitHub, Hugging Face & Kaggle</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
            The Open-Source Launchpad for{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Next-Gen Builders
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-2">
            Discover curated projects, claim <span className="text-emerald-400 font-semibold">"good first issues"</span> matching your exact skills, 
            and explore state-of-the-art open AI models and datasets in one unified platform.
          </p>

          {/* Fully Responsive Unified Search Bar */}
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 shadow-2xl shadow-indigo-950/40 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all gap-2 sm:gap-0">
              
              <div className="flex items-center flex-1 min-w-0">
                <div className="pl-3 pr-2 text-slate-400 shrink-0">
                  <Search className="w-5 h-5 text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by technology (e.g. FastAPI, PyTorch, React, Llama)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none min-w-0 py-1"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0 justify-between sm:justify-end">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none cursor-pointer flex-1 sm:flex-initial"
                >
                  <option value="all">All Ecosystems</option>
                  <option value="projects">Repositories</option>
                  <option value="issues">Good First Issues</option>
                  <option value="ai">AI Models</option>
                  <option value="datasets">Datasets</option>
                </select>

                <button
                  type="submit"
                  className="btn-animated btn-shimmer flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-900/30 whitespace-nowrap"
                >
                  <span>Find</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </form>

          {/* Interactive Skill Selector Chips */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Select skills for instant auto-recommendations:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-2xl mx-auto px-1">
              {allSkills.slice(0, 10).map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => onToggleSkill(skill)}
                    className={`btn-animated filter-badge-animated px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-sm shadow-cyan-900/40"
                        : "bg-slate-900/70 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {isSelected && <span className="mr-1 text-cyan-400">✓</span>}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setActiveTab("issues")}
              className="btn-animated flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/40 text-xs font-semibold shadow-xs"
            >
              <GitPullRequest className="w-4 h-4 text-emerald-400" />
              <span>Good First Issues</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className="btn-animated flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-violet-800/60 text-violet-300 hover:bg-violet-950/40 text-xs font-semibold shadow-xs"
            >
              <Cpu className="w-4 h-4 text-violet-400" />
              <span>Open AI Models</span>
            </button>

            <button
              onClick={onOpenRoadmap}
              className="btn-animated flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white text-xs font-semibold shadow-xs"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>5-Step PR Roadmap</span>
            </button>
          </div>

        </div>

        {/* Live Metrics Banner */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-800/70 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className="card-interactive p-3 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">12,400+</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Curated Repositories</p>
          </div>
          <div className="card-interactive p-3 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-400">3,850+</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Beginner Issues Open</p>
          </div>
          <div className="card-interactive p-3 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-violet-400">1,200+</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Open AI Models</p>
          </div>
          <div className="card-interactive p-3 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-cyan-400">98.4%</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">First-PR Success</p>
          </div>
        </div>

      </div>
    </div>
  );
}
