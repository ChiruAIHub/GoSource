import React from "react";
import { 
  Star, 
  GitFork, 
  AlertCircle, 
  ExternalLink, 
  Bookmark, 
  Sparkles, 
  Terminal
} from "lucide-react";

export default function ProjectCard({ 
  project, 
  onSelectProject, 
  isBookmarked, 
  onToggleBookmark,
  userSkills = []
}) {
  // Compute match score dynamically based on user skills
  const matchingSkills = project.skillsRequired.filter(s => userSkills.includes(s));
  const dynamicMatchScore = matchingSkills.length > 0 
    ? Math.min(100, Math.round((matchingSkills.length / project.skillsRequired.length) * 100))
    : project.matchScore;

  const getLanguageColor = (lang) => {
    switch (lang?.toLowerCase()) {
      case "python": return "bg-blue-500";
      case "typescript": return "bg-sky-500";
      case "javascript": return "bg-amber-400";
      case "go": return "bg-teal-500";
      case "rust": return "bg-orange-500";
      case "c++": return "bg-pink-500";
      default: return "bg-slate-400";
    }
  };

  const getDifficultyBadge = (diff) => {
    if (diff?.toLowerCase().includes("beginner")) {
      return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60";
    }
    if (diff?.toLowerCase().includes("intermediate")) {
      return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-[#60A5FA] border-blue-200 dark:border-blue-800/60";
    }
    return "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-[#A78BFA] border-violet-200 dark:border-violet-800/60";
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] p-5 shadow-xs card-interactive transition-all duration-300">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#273449] flex items-center justify-center font-bold text-slate-700 dark:text-[#F8FAFC] text-xs uppercase shrink-0 shadow-2xs group-hover:scale-105 group-hover:border-blue-400/50 transition-all duration-200">
              {project.name.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-mono">{project.owner} /</span>
                <span className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-[#60A5FA] transition-colors truncate">
                  {project.name}
                </span>
              </div>
              <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${getDifficultyBadge(project.difficulty)}`}>
                {project.difficulty}
              </span>
            </div>
          </div>

          {/* Action buttons (Bookmark & Match pill) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {dynamicMatchScore >= 80 && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60 animate-pulse-glow" title="Match with your selected skills">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-[#60A5FA]" />
                <span>{dynamicMatchScore}%</span>
              </span>
            )}
            <button
              onClick={() => onToggleBookmark(project.id, "project")}
              className={`p-1.5 rounded-lg border btn-animated active:scale-90 transition-all ${
                isBookmarked 
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#60A5FA] border-blue-200 dark:border-blue-800" 
                  : "bg-slate-50 dark:bg-[#1E293B] text-slate-400 dark:text-[#94A3B8] border-slate-200 dark:border-[#273449] hover:text-slate-700 dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#273449]"
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Save Project"}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-[#CBD5E1] line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Topics / Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.topics?.slice(0, 4).map((topic) => (
            <span key={topic} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-[#1E293B] text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-[#273449] filter-badge-animated">
              #{topic}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#273449]/70">
        
        {/* Repo Stats Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8] mb-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(project.language)}`} />
            <span className="font-medium text-slate-700 dark:text-[#CBD5E1]">{project.language}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-600 dark:text-[#CBD5E1]" title="Stars">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span>{(project.stars / 1000).toFixed(1)}k</span>
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-[#CBD5E1]" title="Forks">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              <span>{(project.forks / 1000).toFixed(1)}k</span>
            </span>
            {project.goodFirstIssuesCount > 0 && (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold" title="Good First Issues Available">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{project.goodFirstIssuesCount} issues</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectProject(project)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-[#CBD5E1] hover:text-blue-700 dark:hover:text-[#60A5FA] text-xs font-semibold border border-slate-200 dark:border-[#273449] hover:border-blue-200 dark:hover:border-blue-700 shadow-2xs btn-animated btn-shimmer transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-[#60A5FA]" />
            <span>Setup & Issues</span>
          </button>
          
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#273449] text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-[#273449] shadow-2xs btn-animated transition-all"
            title="Open on GitHub"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
