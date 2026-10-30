import React, { useState } from "react";
import { 
  GraduationCap, 
  GitPullRequest, 
  Copy, 
  Check, 
  HeartHandshake, 
  FileCode,
  ShieldCheck
} from "lucide-react";
import { LEARNING_MODULES } from "../data/mockData";

export default function LearningHubView({ onOpenRoadmap }) {
  const [activeModule, setActiveModule] = useState(LEARNING_MODULES[0]);
  const [copiedCode, setCopiedCode] = useState(null);

  const copySnippet = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-[#273449] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/50">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-[#60A5FA]" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              Beginner <span className="text-blue-600 dark:text-[#60A5FA]">Learning Hub</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Everything you need to go from a blank terminal to your first merged open-source pull request.
          </p>
        </div>

        <button
          onClick={onOpenRoadmap}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all self-start md:self-auto"
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Launch 5-Step PR Roadmap</span>
        </button>
      </div>

      {/* Main Interactive Guide Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module Selector Sidebar */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Learning Tracks:
          </span>
          {LEARNING_MODULES.map((m) => {
            const isSelected = activeModule.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setActiveModule(m)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-sm"
                    : "bg-white dark:bg-[#111827] border-slate-200 dark:border-[#273449] hover:bg-slate-50 dark:hover:bg-[#1E293B] shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">{m.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-[#CBD5E1] font-medium">
                    {m.duration}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-blue-600 dark:text-[#60A5FA]">
                  {m.level}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Module Details */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-6">
          
          <div className="border-b border-slate-100 dark:border-[#273449] pb-4">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60">
              {activeModule.level}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#F8FAFC] mt-2 mb-1">
              {activeModule.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              {activeModule.description}
            </p>
          </div>

          <div className="space-y-4">
            {activeModule.steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/90 dark:border-[#273449] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </span>

                  {step.code && (
                    <button
                      onClick={() => copySnippet(step.code, idx)}
                      className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-[#60A5FA] hover:text-blue-700 dark:hover:text-blue-400 font-mono font-medium"
                    >
                      {copiedCode === idx ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === idx ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </div>

                {step.detail && (
                  <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed pl-7">
                    {step.detail}
                  </p>
                )}

                {step.code && (
                  <pre className="p-3 rounded-xl bg-slate-900 dark:bg-[#030712] border border-slate-800 dark:border-[#1F2937] font-mono text-[11px] text-cyan-200 overflow-x-auto leading-relaxed shadow-inner">
                    {step.code}
                  </pre>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Pull Request Anatomy Simulator */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileCode className="w-5 h-5 text-blue-600 dark:text-[#60A5FA]" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Anatomy of a High-Quality Pull Request</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-[#94A3B8] max-w-2xl leading-relaxed">
          Maintainers review dozens of PRs every day. Using this proven description template guarantees your pull request will be reviewed faster:
        </p>

        <div className="p-4 rounded-2xl bg-slate-900 dark:bg-[#030712] border border-slate-800 dark:border-[#1F2937] font-mono text-xs text-slate-200 space-y-2 leading-relaxed shadow-inner">
          <p className="text-emerald-400 font-bold">## What does this PR do?</p>
          <p className="text-slate-400">Adds refresh token rotation example in authentication tutorial documentation.</p>
          <p className="text-emerald-400 font-bold mt-2">## Related Issue</p>
          <p className="text-slate-400">Closes #4891</p>
          <p className="text-emerald-400 font-bold mt-2">## How has this been tested?</p>
          <p className="text-slate-400">- Executed `pytest tests/test_tutorial.py` (Passed 100%)</p>
          <p className="text-slate-400">- Ran markdown documentation validator with zero errors.</p>
        </div>
      </section>

      {/* Open Source Etiquette Rules */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-pink-500" />
            <span>Open Source Etiquette Rules</span>
          </h4>
          <ul className="text-xs text-slate-600 dark:text-[#94A3B8] space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Never open a PR without an existing issue or maintainer approval.</li>
            <li>Don't submit PRs that solely reformat whitespace or sort imports.</li>
            <li>Always thank the maintainers for their review comments.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
            <span>Understanding Licenses</span>
          </h4>
          <ul className="text-xs text-slate-600 dark:text-[#94A3B8] space-y-1.5 list-disc list-inside leading-relaxed">
            <li><strong className="text-slate-800 dark:text-[#F8FAFC]">MIT / Apache 2.0:</strong> Highly permissive, commercial use allowed.</li>
            <li><strong className="text-slate-800 dark:text-[#F8FAFC]">GPL / AGPL:</strong> Copyleft licenses requiring modifications to stay open.</li>
            <li><strong className="text-slate-800 dark:text-[#F8FAFC]">CC-BY-4.0:</strong> Common standard for research datasets and docs.</li>
          </ul>
        </div>

      </section>

    </div>
  );
}
