import React, { useState } from "react";
import { 
  X, 
  Map, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  Sparkles
} from "lucide-react";
import { CONTRIBUTION_ROADMAP_STEPS } from "../data/mockData";

export default function ContributionRoadmapModal({ isOpen, onClose }) {
  const [steps, setSteps] = useState(() => {
    const saved = localStorage.getItem("gosource_roadmap_progress");
    return saved ? JSON.parse(saved) : CONTRIBUTION_ROADMAP_STEPS;
  });
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const toggleStep = (index) => {
    const updated = [...steps];
    updated[index].completed = !updated[index].completed;
    setSteps(updated);
    localStorage.setItem("gosource_roadmap_progress", JSON.stringify(updated));
  };

  const copyCommand = (cmd, index) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      
      <div className="animate-modal-pop relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-[#273449] bg-slate-50/70 dark:bg-[#0F172A] flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-[#A78BFA] border border-violet-200 dark:border-violet-800/60">
                <Map className="w-4 h-4 text-violet-600 dark:text-[#A78BFA]" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">First Pull Request Interactive Roadmap</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Your step-by-step master guide from finding an issue to landing your first merged PR.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white dark:bg-[#1E293B] text-slate-400 dark:text-[#94A3B8] hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#273449] border border-slate-200 dark:border-[#273449] transition-all shrink-0 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-[#273449] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-[#94A3B8] font-medium">Roadmap Progress:</span>
            <span className="font-bold text-blue-600 dark:text-[#60A5FA]">{completedCount} of {steps.length} Steps Completed</span>
          </div>
          <div className="w-36 h-2 rounded-full bg-slate-100 dark:bg-[#1E293B] overflow-hidden border border-slate-200/60 dark:border-[#273449]">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {steps.map((s, idx) => (
            <div 
              key={s.step} 
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                s.completed 
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 shadow-xs" 
                  : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#273449] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleStep(idx)}
                  className="btn-animated mt-0.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-[#60A5FA]"
                >
                  {s.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${s.completed ? "text-emerald-800 dark:text-emerald-300 line-through opacity-80" : "text-slate-900 dark:text-[#F8FAFC]"}`}>
                      Step {s.step}: {s.title}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 leading-relaxed">
                    {s.description}
                  </p>

                  {s.command && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900 dark:bg-[#030712] border border-slate-800 dark:border-[#1F2937] flex items-center justify-between font-mono text-[11px] text-cyan-200 shadow-inner">
                      <span className="truncate pr-2">{s.command}</span>
                      <button
                        onClick={() => copyCommand(s.command, idx)}
                        className="btn-animated p-1 text-slate-400 hover:text-white"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {completedCount === steps.length && (
            <div className="animate-modal-pop p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-center space-y-1">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">Congratulations, Contributor!</p>
              <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">You have completed all 5 steps of the open-source contribution cycle.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-[#273449] bg-slate-50/70 dark:bg-[#0F172A] flex justify-end">
          <button
            onClick={onClose}
            className="btn-animated px-5 py-2 rounded-xl bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#273449] text-slate-700 dark:text-[#CBD5E1] font-semibold text-xs border border-slate-200 dark:border-[#273449] shadow-xs"
          >
            Close Roadmap
          </button>
        </div>

      </div>

    </div>
  );
}
