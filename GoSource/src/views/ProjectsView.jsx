import React, { useState, useMemo } from "react";
import { 
  Search, 
  Compass, 
  RotateCcw
} from "lucide-react";
import ProjectCard from "../components/ProjectCard";

export default function ProjectsView({
  repositories,
  onSelectProject,
  bookmarkedProjects,
  onToggleBookmark,
  userSkills
}) {
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState("stars");

  const languages = ["All", "Python", "TypeScript", "JavaScript", "Go", "Rust"];
  const domains = ["All", "Web & API", "AI & Machine Learning", "Database & Backend", "Frontend & UI", "Desktop & Systems"];
  const difficulties = ["All", "Beginner Friendly", "Intermediate", "Advanced"];

  const filtered = useMemo(() => {
    return repositories.filter((repo) => {
      const matchQuery = !query || 
        repo.name.toLowerCase().includes(query.toLowerCase()) ||
        repo.description.toLowerCase().includes(query.toLowerCase()) ||
        repo.topics.some(t => t.toLowerCase().includes(query.toLowerCase()));

      const matchLang = selectedLanguage === "All" || repo.language.toLowerCase() === selectedLanguage.toLowerCase();
      const matchDomain = selectedDomain === "All" || repo.domain.toLowerCase().includes(selectedDomain.toLowerCase());
      const matchDiff = selectedDifficulty === "All" || repo.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());

      return matchQuery && matchLang && matchDomain && matchDiff;
    }).sort((a, b) => {
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "issues") return b.goodFirstIssuesCount - a.goodFirstIssuesCount;
      if (sortBy === "match") return b.matchScore - a.matchScore;
      return 0;
    });
  }, [repositories, query, selectedLanguage, selectedDomain, selectedDifficulty, sortBy]);

  const resetFilters = () => {
    setQuery("");
    setSelectedLanguage("All");
    setSelectedDomain("All");
    setSelectedDifficulty("All");
    setSortBy("stars");
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-[#273449] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/50">
              <Compass className="w-5 h-5 text-blue-600 dark:text-[#60A5FA]" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              All <span className="text-blue-600 dark:text-[#60A5FA]">Repositories</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Explore {repositories.length} curated open-source projects filtered by tech stack, difficulty, and beginner opportunities.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-700 dark:text-[#CBD5E1] font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 shadow-2xs"
          >
            <option value="stars">Most Stars</option>
            <option value="issues">Most Good First Issues</option>
            <option value="match">Highest Skill Match</option>
          </select>
        </div>
      </div>

      {/* Filter Controls Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter repositories by name, topic, or keyword..."
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          
          {/* Language filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#CBD5E1] mb-1.5">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-[#CBD5E1] focus:outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-blue-500 dark:focus:border-blue-400 transition-all"
            >
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Domain filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#CBD5E1] mb-1.5">Domain:</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-[#CBD5E1] focus:outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-blue-500 dark:focus:border-blue-400 transition-all"
            >
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Difficulty filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#CBD5E1] mb-1.5">Difficulty:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-[#CBD5E1] focus:outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-blue-500 dark:focus:border-blue-400 transition-all"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filters / Reset */}
        {(query || selectedLanguage !== "All" || selectedDomain !== "All" || selectedDifficulty !== "All") && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#273449] text-xs">
            <span className="text-slate-500 dark:text-[#94A3B8]">Found {filtered.length} matching repositories</span>
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

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
              isBookmarked={bookmarkedProjects.includes(project.id)}
              onToggleBookmark={onToggleBookmark}
              userSkills={userSkills}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs">
          <p className="text-slate-600 dark:text-[#94A3B8] text-sm mb-3">No repositories match your current filter settings.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}
