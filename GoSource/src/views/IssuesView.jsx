import React, { useState, useMemo } from "react";
import { 
  GitPullRequest, 
  Search, 
  UserCheck, 
  RotateCcw
} from "lucide-react";
import IssueCard from "../components/IssueCard";

export default function IssuesView({
  issues,
  bookmarkedIssues,
  onToggleBookmark,
  onStartContribution
}) {
  const [query, setQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [onlyMentored, setOnlyMentored] = useState(false);

  const labels = ["All", "good first issue", "documentation", "bug", "feature", "accessibility"];
  const languages = ["All", "Python", "TypeScript", "Go", "Rust"];

  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      const matchQuery = !query || 
        issue.title.toLowerCase().includes(query.toLowerCase()) ||
        issue.repo.toLowerCase().includes(query.toLowerCase()) ||
        issue.description.toLowerCase().includes(query.toLowerCase());

      const matchLabel = selectedLabel === "All" || issue.labels.some(l => l.toLowerCase() === selectedLabel.toLowerCase());
      const matchLang = selectedLanguage === "All" || issue.repoLanguage.toLowerCase() === selectedLanguage.toLowerCase();
      const matchMentor = !onlyMentored || issue.mentorshipAvailable;

      return matchQuery && matchLabel && matchLang && matchMentor;
    });
  }, [issues, query, selectedLabel, selectedLanguage, onlyMentored]);

  const resetFilters = () => {
    setQuery("");
    setSelectedLabel("All");
    setSelectedLanguage("All");
    setOnlyMentored(false);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-[#273449] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <GitPullRequest className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              Good First <span className="text-blue-600 dark:text-[#60A5FA]">Issues</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Hand-picked issues explicitly labeled for newcomers. Start your open-source journey with manageable tasks.
          </p>
        </div>

        {/* Mentorship Toggle */}
        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-700 dark:text-[#CBD5E1] cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-2xs">
          <input
            type="checkbox"
            checked={onlyMentored}
            onChange={(e) => setOnlyMentored(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 bg-slate-50 dark:bg-[#0F172A] border-slate-300 dark:border-[#273449] focus:ring-0"
          />
          <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">Mentorship Available Only</span>
        </label>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues by title, repository or keywords..."
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all"
          />
        </div>

        {/* Labels & Language select */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-[#CBD5E1] font-semibold">Filter Label:</span>
            <div className="flex flex-wrap gap-1.5">
              {labels.map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLabel(l)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    selectedLabel === l
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60 shadow-2xs"
                      : "bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-[#273449] hover:bg-slate-100 dark:hover:bg-[#1E293B]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-[#273449]">
            <span className="text-slate-600 dark:text-[#CBD5E1] font-semibold">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-[#CBD5E1] focus:outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-blue-500 dark:focus:border-blue-400 transition-all"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filters / Reset */}
        {(query || selectedLabel !== "All" || selectedLanguage !== "All" || onlyMentored) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#273449] text-xs">
            <span className="text-slate-500 dark:text-[#94A3B8]">Found {filtered.length} matching issues</span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-blue-600 dark:text-[#60A5FA] hover:text-blue-700 dark:hover:text-blue-400 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Issues Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              isBookmarked={bookmarkedIssues.includes(issue.id)}
              onToggleBookmark={onToggleBookmark}
              onStartContribution={onStartContribution}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs">
          <p className="text-slate-600 dark:text-[#94A3B8] text-sm mb-3">No beginner issues match this criteria.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            Reset Issue Filters
          </button>
        </div>
      )}

    </div>
  );
}
