import React, { useState } from "react";
import { 
  X, 
  Star, 
  GitFork, 
  Terminal, 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function ProjectDetailModal({ project, onClose, onStartIssue }) {
  const [activeTab, setActiveTab] = useState("setup");
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const copySetup = () => {
    navigator.clipboard.writeText(project.setupGuide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      
      <div className="animate-modal-pop relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-[#273449] bg-slate-50/70 dark:bg-[#0F172A] flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono text-blue-600 dark:text-[#60A5FA] font-semibold">{project.owner} /</span>
              <span className="text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">{project.name}</span>
              <span className="filter-badge-animated text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60">
                {project.language}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] max-w-xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white dark:bg-[#1E293B] text-slate-400 dark:text-[#94A3B8] hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#273449] border border-slate-200 dark:border-[#273449] transition-all shrink-0 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab("setup")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
              activeTab === "setup"
                ? "border-blue-600 dark:border-[#60A5FA] text-blue-600 dark:text-[#60A5FA]"
                : "border-transparent text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Setup & Quickstart</span>
          </button>

          <button
            onClick={() => setActiveTab("guidelines")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
              activeTab === "guidelines"
                ? "border-blue-600 dark:border-[#60A5FA] text-blue-600 dark:text-[#60A5FA]"
                : "border-transparent text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Contribution Guidelines</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
              activeTab === "skills"
                ? "border-blue-600 dark:border-[#60A5FA] text-blue-600 dark:text-[#60A5FA]"
                : "border-transparent text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Required Skills</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-[#CBD5E1] text-xs">
          
          {activeTab === "setup" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-[#F8FAFC]">Local Development Instructions:</span>
                <button
                  onClick={copySetup}
                  className="btn-animated flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-[#60A5FA] font-mono text-[11px] border border-blue-200 dark:border-blue-800/60"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Commands"}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 dark:bg-[#030712] border border-slate-800 dark:border-[#1F2937] font-mono text-cyan-200 space-y-2 leading-relaxed shadow-inner">
                <p className="text-slate-400 text-[10px]"># 1. Clone repository and install dependencies</p>
                <pre className="overflow-x-auto text-[11px]">{project.setupGuide}</pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Beginner Checklist for this Repository:</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-[#94A3B8] pl-1">
                  <li>Fork the repository to your own GitHub profile first.</li>
                  <li>Clone your fork locally, not the upstream main repository.</li>
                  <li>Run the automated test suite before writing any code to ensure clean state.</li>
                  <li>Create a feature branch with a descriptive name (`git checkout -b fix/xyz`).</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "guidelines" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm">Official Contributing Policy</h4>
                <p className="text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  Every mature open source project maintains strict quality standards to ensure stability. 
                  Below are the essential requirements for {project.name}:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-2xs">
                    <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mb-1">Code Style & Formatting</p>
                    <p className="text-slate-500 dark:text-[#94A3B8] text-[11px]">Run linter and formatter scripts before pushing (e.g. black, eslint, prettier).</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-2xs">
                    <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mb-1">Commit Conventions</p>
                    <p className="text-slate-500 dark:text-[#94A3B8] text-[11px]">Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `test:`.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <a
                  href={project.contributingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-animated inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-[#F8FAFC] font-semibold border border-slate-200 dark:border-[#273449] shadow-xs"
                >
                  <span>Read Full CONTRIBUTING.md on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-[#94A3B8]">
                To comfortably contribute to <span className="text-slate-900 dark:text-[#F8FAFC] font-semibold">{project.name}</span>, familiarity with the following skills is recommended:
              </p>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired?.map((skill) => (
                  <span key={skill} className="filter-badge-animated px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60 font-mono text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449]">
                <p className="font-semibold text-slate-900 dark:text-[#F8FAFC] mb-1">Don't know all the tools yet?</p>
                <p className="text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  Documentation fixes, typos, broken links, and adding test cases are great entry points that don't require knowing the entire codebase!
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-[#273449] bg-slate-50/70 dark:bg-[#0F172A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <strong className="text-slate-900 dark:text-[#F8FAFC]">{project.stars.toLocaleString()}</strong> stars
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <strong className="text-slate-900 dark:text-[#F8FAFC]">{project.forks.toLocaleString()}</strong> forks
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onStartIssue && (
              <button
                onClick={() => {
                  onClose();
                  onStartIssue(project);
                }}
                className="btn-animated flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-xs"
              >
                <span>Start Roadmap</span>
              </button>
            )}

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-animated btn-shimmer flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
            >
              <span>View GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
