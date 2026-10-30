import React, { useState, useEffect } from "react";
import { 
  X, 
  Search, 
  Compass, 
  GitPullRequest, 
  Cpu, 
  Database 
} from "lucide-react";
import { REPOSITORIES, GOOD_FIRST_ISSUES, AI_MODELS, DATASETS } from "../data/mockData";

export default function GlobalSearchModal({ isOpen, onClose, onSelectResult }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const term = searchTerm.toLowerCase();

  const matchingRepos = REPOSITORIES.filter(r => 
    r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term) || r.language.toLowerCase().includes(term)
  );

  const matchingIssues = GOOD_FIRST_ISSUES.filter(i =>
    i.title.toLowerCase().includes(term) || i.repo.toLowerCase().includes(term)
  );

  const matchingModels = AI_MODELS.filter(m =>
    m.name.toLowerCase().includes(term) || m.task.toLowerCase().includes(term)
  );

  const matchingDatasets = DATASETS.filter(d =>
    d.name.toLowerCase().includes(term) || d.category.toLowerCase().includes(term)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      
      <div className="animate-modal-pop w-full max-w-2xl rounded-3xl bg-[#0b0f1a] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800/80 bg-slate-900/80">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a command or search repos, issues, models, datasets..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="btn-animated p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:rotate-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 text-xs overflow-x-auto">
          {["all", "projects", "issues", "ai", "datasets"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`nav-pill-animated px-3 py-1 rounded-full text-[11px] font-semibold capitalize transition-all ${
                category === cat
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Repos */}
          {(category === "all" || category === "projects") && matchingRepos.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Repositories</span>
              </span>
              {matchingRepos.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectResult("project", r);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white">{r.owner} / {r.name}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-md">{r.description}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {r.language}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Issues */}
          {(category === "all" || category === "issues") && matchingIssues.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                <span>Good First Issues</span>
              </span>
              {matchingIssues.slice(0, 3).map((i) => (
                <div
                  key={i.id}
                  onClick={() => {
                    onSelectResult("issue", i);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white truncate max-w-md">{i.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{i.repo}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    {i.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Models */}
          {(category === "all" || category === "ai") && matchingModels.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>AI Models</span>
              </span>
              {matchingModels.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectResult("ai", m);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white">{m.name}</p>
                    <p className="text-[11px] text-slate-400">{m.task} • {m.parameters}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-950 text-violet-400 border border-violet-800/60">
                    {m.downloads} dl
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Datasets */}
          {(category === "all" || category === "datasets") && matchingDatasets.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Datasets</span>
              </span>
              {matchingDatasets.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    onSelectResult("dataset", d);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white">{d.name}</p>
                    <p className="text-[11px] text-slate-400">{d.category} • {d.size}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {d.format}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to dismiss</span>
        </div>

      </div>

    </div>
  );
}
