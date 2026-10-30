import React from "react";
import { 
  GitPullRequest, 
  Clock, 
  MessageSquare, 
  Bookmark, 
  UserCheck, 
  ArrowUpRight 
} from "lucide-react";

export default function IssueCard({ 
  issue, 
  isBookmarked, 
  onToggleBookmark,
  onStartContribution 
}) {
  return (
    <div className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] p-5 shadow-xs card-interactive transition-all duration-300">
      
      <div>
        {/* Repo & Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-[#CBD5E1] border border-slate-200 dark:border-[#273449] font-semibold filter-badge-animated">
              {issue.repo}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-mono">
              {issue.repoLanguage}
            </span>
          </div>

          <button
            onClick={() => onToggleBookmark(issue.id, "issue")}
            className={`p-1.5 rounded-lg border btn-animated active:scale-90 transition-all ${
              isBookmarked 
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#60A5FA] border-blue-200 dark:border-blue-800" 
                : "bg-slate-50 dark:bg-[#1E293B] text-slate-400 dark:text-[#94A3B8] border-slate-200 dark:border-[#273449] hover:text-slate-700 dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#273449]"
            }`}
            title="Bookmark Issue"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Issue Title */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-[#60A5FA] transition-colors line-clamp-2 mb-2 leading-snug">
          {issue.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-[#CBD5E1] line-clamp-2 mb-4 leading-relaxed">
          {issue.description}
        </p>

        {/* Labels & Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {issue.labels?.map((label) => {
            const isGoodFirst = label.toLowerCase().includes("good first");
            return (
              <span
                key={label}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border filter-badge-animated ${
                  isGoodFirst
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-[#60A5FA] border-blue-200 dark:border-blue-800/60"
                    : "bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-[#94A3B8] border-slate-200 dark:border-[#273449]"
                }`}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#273449]/70">
        
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#94A3B8] mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-600 dark:text-[#CBD5E1]" title="Estimated Time">
              <Clock className="w-3 h-3 text-blue-600 dark:text-[#60A5FA]" />
              <span>{issue.estimatedTime}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-[#CBD5E1]" title="Discussions / Comments">
              <MessageSquare className="w-3 h-3 text-slate-400" />
              <span>{issue.comments}</span>
            </span>
          </div>

          {issue.mentorshipAvailable && (
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 text-[10px] font-semibold">
              <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Mentor Ready</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartContribution(issue)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs btn-animated btn-shimmer transition-all"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Start Solving</span>
          </button>

          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#273449] text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-[#273449] shadow-2xs btn-animated transition-all"
            title="Open Issue on GitHub"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
