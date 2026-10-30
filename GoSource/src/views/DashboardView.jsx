import React, { useState } from "react";
import { 
  Zap, 
  CheckCircle2, 
  Flame,
  Calendar,
  Sparkles,
  ExternalLink,
  Code2,
  FolderGit2,
  BookOpen,
  Boxes
} from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import IssueCard from "../components/IssueCard";

export default function DashboardView({
  userSkills,
  allSkills,
  onToggleSkill,
  repositories,
  issues,
  bookmarkedProjects,
  bookmarkedIssues,
  onToggleBookmark,
  onSelectProject,
  onStartContribution,
  onOpenRoadmap,
  currentUser,
  onOpenAuthModal
}) {
  const [activeBookmarkTab, setActiveBookmarkTab] = useState("projects");
  const [linkingPlatform, setLinkingPlatform] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("github");

  const profileName = currentUser?.display_name || currentUser?.username || "Open-Source Contributor";
  const profileInitials = currentUser?.avatar_initials || (currentUser?.username ? currentUser.username.slice(0, 2).toUpperCase() : "OS");
  const profileTier = currentUser?.tier || "Tier 1 Contributor";
  const profileBio = currentUser?.bio || "Open-Source Contributor & AI Explorer across GitHub, Hugging Face Hub & Kaggle";
  const ghHandle = currentUser?.platforms?.github?.username ? `@${currentUser.platforms.github.username}` : "@contributor";
  const hfHandle = currentUser?.platforms?.huggingface?.username ? `@${currentUser.platforms.huggingface.username}` : "@contributor";
  const kaggleHandle = currentUser?.platforms?.kaggle?.username ? `@${currentUser.platforms.kaggle.username}` : "Verified";

  const savedRepos = repositories.filter(r => bookmarkedProjects.includes(r.id));
  const savedIssuesList = issues.filter(i => bookmarkedIssues.includes(i.id));

  // Generate simulated GitHub contribution streak squares
  const generateStreakDays = () => {
    const days = [];
    for (let i = 0; i < 28; i++) {
      const level = i % 7 === 0 ? 3 : i % 5 === 0 ? 2 : i % 2 === 0 ? 1 : 0;
      days.push(level);
    }
    return days;
  };

  const getHeatmapColor = (lvl) => {
    switch (lvl) {
      case 3: return "bg-emerald-600 dark:bg-emerald-500";
      case 2: return "bg-emerald-400 dark:bg-emerald-600";
      case 1: return "bg-emerald-200 dark:bg-emerald-800";
      default: return "bg-slate-100 dark:bg-[#1E293B]";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Profile & Tier Progress Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-white to-violet-50/60 dark:from-[#0F172A] dark:via-[#111827] dark:to-[#1E293B] border border-slate-200 dark:border-[#273449] shadow-xs relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-[2px] shadow-sm">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0F172A] flex items-center justify-center text-lg font-bold text-blue-600 dark:text-[#60A5FA]">
                  {profileInitials}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0F172A] flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  {profileName}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60">
                  {profileTier}
                </span>
                {!currentUser && (
                  <button
                    onClick={onOpenAuthModal}
                    className="btn-animated text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:slate-700 cursor-pointer"
                  >
                    Switch Account
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white inline-block"></span>
                  GitHub: <code className="text-blue-600 dark:text-[#60A5FA]">{ghHandle}</code>
                </span>
                <span className="text-xs text-slate-400 dark:text-[#64748B]">•</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                  Hugging Face: <code className="text-amber-600 dark:text-amber-400">{hfHandle}</code>
                </span>
                <span className="text-xs text-slate-400 dark:text-[#64748B]">•</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
                  Kaggle: <span className="text-cyan-600 dark:text-cyan-400">{kaggleHandle}</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                {profileBio}
              </p>
            </div>
          </div>

          {/* Kaggle Style Tier Progress & Activity Streak */}
          <div className="flex flex-wrap items-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-[#273449] pt-4 lg:pt-0 lg:pl-6">
            
            {/* Kaggle Progress Circular Badge */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center transition-transform hover:scale-110 duration-200">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-[#273449]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-500 dark:text-cyan-400"
                    strokeDasharray="15, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-slate-900 dark:text-[#F8FAFC]">0%</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">0% to Expert</p>
                <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Kaggle Tier Progress</p>
              </div>
            </div>

            {/* Kaggle Streak Tracker */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#273449] shadow-2xs hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">1-Day Streak</p>
                <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Longest: 2 days</p>
              </div>
            </div>

          </div>

        </div>

        {/* Public Activity MTWTFSS + Heatmap */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-[#273449] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-[#CBD5E1]">Public Activity:</span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-[#94A3B8]">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => (
                <div key={dIdx} className="flex flex-col items-center gap-1">
                  <span>{day}</span>
                  <div className={`w-2.5 h-2.5 rounded-full transition-transform hover:scale-125 ${dIdx === 4 || dIdx === 5 ? 'bg-cyan-500 ring-2 ring-cyan-300 dark:ring-cyan-900' : 'bg-slate-200 dark:bg-slate-700'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#94A3B8]">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-[#60A5FA]" />
            <span>GitHub Contribution Heatmap:</span>
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {generateStreakDays().slice(0, 14).map((lvl, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-[2px] transition-transform duration-150 hover:scale-150 cursor-pointer ${getHeatmapColor(lvl)}`}
                  title={`Day ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-interactive p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">5</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">GitHub</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">ChiruAIHub Top Repos</p>
        </div>
        <div className="card-interactive p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">6</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400">Kaggle</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">Notebooks (5 Created)</p>
        </div>
        <div className="card-interactive p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold text-amber-500 dark:text-amber-400">3</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400">Hugging Face</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">Followed AI Creators</p>
        </div>
        <div className="card-interactive p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold text-blue-600 dark:text-[#60A5FA]">{userSkills.length}</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-[#60A5FA]">Active</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">Configured Skills</p>
        </div>
      </div>

      {/* Interactive Skills Matrix Section */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
              <span>Your Active Skill Matrix (Auto-Matches Repos & Issues)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Click any skill to toggle it. Repositories dynamically recalculate their match score.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {allSkills.map((skill) => {
            const isSelected = userSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => onToggleSkill(skill)}
                className={`btn-animated filter-badge-animated px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60 shadow-2xs"
                    : "bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-[#273449] hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-[#F8FAFC]"
                }`}
              >
                {isSelected ? `✓ ${skill}` : `+ ${skill}`}
              </button>
            );
          })}
        </div>
      </section>

      {/* Connected Accounts & Ecosystem Showcase */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#273449] pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
              <Boxes className="w-4 h-4 text-violet-600 dark:text-[#A78BFA]" />
              <span>Personal Ecosystem Feed (GitHub • Hugging Face • Kaggle)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Live sync from your authentic accounts: ChiruAIHub (GitHub), ChiruAI (Hugging Face), and Chiru Hasini Lakshmi Pallampati (Kaggle).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* GitHub: ChiruAIHub */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-[#F8FAFC] text-xs flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                  <span>GitHub: ChiruAIHub</span>
                </span>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-[#60A5FA]">5 Repositories</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mb-3">
                Top pinned repositories curated for open-source contributions:
              </p>
              <div className="space-y-2">
                {[
                  { name: "ChiruAIHub/king", lang: "Python", desc: "Autonomous multi-agent orchestration engine & task planner" },
                  { name: "ChiruAIHub/-Nexus-AI", lang: "TypeScript", desc: "Multimodal reasoning workspace with vision & speech" },
                  { name: "ChiruAIHub/hindsight", lang: "Python", desc: "Long-term episodic memory & reflection system" },
                  { name: "ChiruAIHub/rocketride-server", lang: "Go", desc: "Ultra high-throughput real-time streaming backend" },
                  { name: "ChiruAIHub/hydradb", lang: "Rust", desc: "High-concurrency embedded vector & graph database" },
                ].map((r, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#273449] text-xs flex items-center justify-between">
                    <div>
                      <a href={`https://github.com/${r.name}`} target="_blank" rel="noreferrer" className="font-bold text-blue-600 dark:text-[#60A5FA] hover:underline flex items-center gap-1">
                        <span>{r.name.split('/')[1]}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] line-clamp-1">{r.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {r.lang}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <a
              href="https://github.com/ChiruAIHub"
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-center text-xs font-semibold text-blue-600 dark:text-[#60A5FA] hover:underline flex items-center justify-center gap-1"
            >
              <span>View GitHub Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Hugging Face: ChiruAI */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-[#F8FAFC] text-xs flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">🤗</span>
                  <span>Hugging Face: ChiruAI</span>
                </span>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Following (3)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mb-3">
                Followed creators & active trending models in your feed:
              </p>

              <div className="space-y-2 mb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Followed Creators:</p>
                {[
                  { name: "unsloth", bio: "Making AI and training more accessible" },
                  { name: "alibaba-pai", bio: "Masters of controllable image and video magic" },
                  { name: "Qwen", bio: "Developing advanced large language and vision models" },
                ].map((c, i) => (
                  <div key={i} className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#273449] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">@{c.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">{c.bio}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Following
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Trending in Your Feed:</p>
                {[
                  { name: "DeepSeek-V4.1 Flash 1017", task: "Image-Text-to-Text • 763B" },
                  { name: "Nanbeige/Nanbeige4.3-33B", task: "Text Generation • 33B" },
                  { name: "LiquidAI/LFM3-1.7B", task: "Text Generation • 2B" },
                  { name: "nvidia/simready-assets", task: "3D Synthetic Simulation" },
                ].map((m, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1E293B] border border-slate-200/60 dark:border-[#273449] text-[11px] flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-[#CBD5E1] truncate">{m.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{m.task}</span>
                  </div>
                ))}
              </div>
            </div>
            <a
              href="https://huggingface.co"
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-center text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1"
            >
              <span>Explore Hugging Face Feed</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Kaggle: Chiru Hasini Lakshmi Pallampati */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-[#F8FAFC] text-xs flex items-center gap-1.5">
                  <span className="font-black text-cyan-500">k</span>
                  <span>Kaggle: Chiru Hasini</span>
                </span>
                <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">6 Notebooks</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mb-3">
                Kaggle profile activity, streak, and notebook progress:
              </p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#273449] text-center">
                  <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">6</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Total Notebooks</p>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">5 created</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#273449] text-center">
                  <p className="text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">0</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Datasets Created</p>
                  <span className="text-[9px] text-blue-600 dark:text-[#60A5FA] font-semibold">Ready to publish</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#273449] text-center">
                  <p className="text-xl font-bold text-amber-500">1</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Login Streak</p>
                  <span className="text-[9px] text-slate-400">Longest: 2 days</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#273449] text-center">
                  <p className="text-xl font-bold text-violet-600 dark:text-[#A78BFA]">0%</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Tier Progress</p>
                  <span className="text-[9px] text-violet-500 font-semibold">To Expert</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#273449] space-y-1 text-xs">
                <p className="font-bold text-slate-800 dark:text-[#F8FAFC] text-[11px]">Recommended Kaggle Next Step:</p>
                <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">
                  Export GoSource curated issues dataset to Kaggle Datasets to reach Contributor Tier 1!
                </p>
              </div>
            </div>
            <a
              href="https://www.kaggle.com"
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-center text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center justify-center gap-1"
            >
              <span>Open Kaggle Hub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </section>

      {/* Bookmarked Repositories & Issues Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#273449] pb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveBookmarkTab("projects")}
              className={`text-sm font-bold pb-3 border-b-2 transition-all ${
                activeBookmarkTab === "projects"
                  ? "border-blue-600 dark:border-[#60A5FA] text-blue-600 dark:text-[#60A5FA]"
                  : "border-transparent text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Saved Repositories ({savedRepos.length})
            </button>

            <button
              onClick={() => setActiveBookmarkTab("issues")}
              className={`text-sm font-bold pb-3 border-b-2 transition-all ${
                activeBookmarkTab === "issues"
                  ? "border-blue-600 dark:border-[#60A5FA] text-blue-600 dark:text-[#60A5FA]"
                  : "border-transparent text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Saved Good First Issues ({savedIssuesList.length})
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeBookmarkTab === "projects" && (
          <div>
            {savedRepos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedRepos.map((repo) => (
                  <ProjectCard
                    key={repo.id}
                    project={repo}
                    onSelectProject={onSelectProject}
                    isBookmarked={true}
                    onToggleBookmark={onToggleBookmark}
                    userSkills={userSkills}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-slate-500 dark:text-[#94A3B8] text-xs shadow-2xs">
                No saved repositories yet. Bookmark repositories from the All Repositories tab to view them here!
              </div>
            )}
          </div>
        )}

        {activeBookmarkTab === "issues" && (
          <div>
            {savedIssuesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedIssuesList.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isBookmarked={true}
                    onToggleBookmark={onToggleBookmark}
                    onStartContribution={onStartContribution}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-slate-500 dark:text-[#94A3B8] text-xs shadow-2xs">
                No saved issues yet. Bookmark issues from the Good First Issues tab to track them here!
              </div>
            )}
          </div>
        )}

      </section>

    </div>
  );
}
