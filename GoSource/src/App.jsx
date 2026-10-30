import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ProjectsView from "./views/ProjectsView";
import IssuesView from "./views/IssuesView";
import AiHubView from "./views/AiHubView";
import DatasetsView from "./views/DatasetsView";
import LearningHubView from "./views/LearningHubView";
import DashboardView from "./views/DashboardView";

import ProjectDetailModal from "./components/ProjectDetailModal";
import ContributionRoadmapModal from "./components/ContributionRoadmapModal";
import BackendConnectorModal from "./components/BackendConnectorModal";
import AuthModal from "./components/AuthModal";

import { apiService } from "./services/apiClient";
import { INITIAL_SKILLS } from "./data/mockData";
import { 
  Menu, 
  Bookmark, 
  GitBranch, 
  Sun,
  Moon,
  LogIn,
  LogOut,
  User as UserIcon
} from "lucide-react";

export default function App() {
  // Theme state with LocalStorage persistence and system preference fallback
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("gosource_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("gosource_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  // Default to "projects" (All Repositories)
  const [activeTab, setActiveTab] = useState("projects");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core Data
  const [repositories, setRepositories] = useState([]);
  const [issues, setIssues] = useState([]);
  const [aiModels, setAiModels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  // Modals state
  const [selectedProject, setSelectedProject] = useState(null);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Authenticated Contributor User State
  const [currentUser, setCurrentUser] = useState(null);

  // User Profile & Bookmarks State (with LocalStorage persistence)
  const [userSkills, setUserSkills] = useState(() => {
    const saved = localStorage.getItem("gosource_user_skills");
    return saved ? JSON.parse(saved) : ["Python", "React", "TypeScript", "FastAPI"];
  });

  const [bookmarkedProjects, setBookmarkedProjects] = useState(() => {
    const saved = localStorage.getItem("gosource_bookmarked_repos");
    return saved ? JSON.parse(saved) : ["repo-1", "repo-5"];
  });

  const [bookmarkedIssues, setBookmarkedIssues] = useState(() => {
    const saved = localStorage.getItem("gosource_bookmarked_issues");
    return saved ? JSON.parse(saved) : ["issue-1"];
  });

  // Load authenticated user profile from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiService.getCurrentUser();
        if (res && res.authenticated && res.user) {
          setCurrentUser(res.user);
          if (res.user.skills && res.user.skills.length > 0) {
            setUserSkills(res.user.skills);
          }
          if (res.user.bookmarked_repos && res.user.bookmarked_repos.length > 0) {
            setBookmarkedProjects(res.user.bookmarked_repos);
          }
          if (res.user.bookmarked_issues && res.user.bookmarked_issues.length > 0) {
            setBookmarkedIssues(res.user.bookmarked_issues);
          }
        }
      } catch (err) {
        console.warn("Could not retrieve user session:", err);
      }
    };
    fetchUser();
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.skills && user.skills.length > 0) {
      setUserSkills(user.skills);
    }
    if (user.bookmarked_repos && user.bookmarked_repos.length > 0) {
      setBookmarkedProjects(user.bookmarked_repos);
    }
    if (user.bookmarked_issues && user.bookmarked_issues.length > 0) {
      setBookmarkedIssues(user.bookmarked_issues);
    }
  };

  const handleSignOut = () => {
    apiService.clearToken();
    setCurrentUser(null);
  };

  // Fetch initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [repoRes, issueRes, modelRes, datasetRes] = await Promise.all([
        apiService.getRepositories(),
        apiService.getIssues(),
        apiService.getAiModels(),
        apiService.getDatasets()
      ]);
      setRepositories(repoRes.data);
      setIssues(issueRes.data);
      setAiModels(modelRes.data);
      setDatasets(datasetRes.data);
    } catch (err) {
      console.error("Data load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync state to local storage & backend
  useEffect(() => {
    localStorage.setItem("gosource_user_skills", JSON.stringify(userSkills));
    localStorage.setItem("gosource_bookmarked_repos", JSON.stringify(bookmarkedProjects));
    localStorage.setItem("gosource_bookmarked_issues", JSON.stringify(bookmarkedIssues));
    
    // Auto-sync preferences with backend for authenticated user
    if (currentUser) {
      apiService.syncPreferences({
        skills: userSkills,
        bookmarked_repos: bookmarkedProjects,
        bookmarked_issues: bookmarkedIssues
      });
    }
  }, [userSkills, bookmarkedProjects, bookmarkedIssues, currentUser]);

  // Skill toggle handler
  const handleToggleSkill = (skill) => {
    setUserSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Bookmark toggle handler
  const handleToggleBookmark = (id, type) => {
    if (type === "project") {
      setBookmarkedProjects(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    } else {
      setBookmarkedIssues(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    }
  };

  // Start issue contribution action
  const handleStartContribution = (_issue) => {
    setIsRoadmapOpen(true);
  };

  const totalBookmarks = bookmarkedProjects.length + bookmarkedIssues.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-800 dark:text-[#CBD5E1] font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-200">
      
      {/* 1. Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkedCount={totalBookmarks}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* 2. Main Content Wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all">
        
        {/* Mobile Top Header */}
        <header className="lg:hidden sticky top-0 z-30 h-14 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#273449] px-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-[#F8FAFC]"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5 text-blue-600 dark:text-[#60A5FA]" />
            </button>
            <span className="font-bold text-slate-900 dark:text-[#F8FAFC] text-base tracking-tight">
              Go<span className="text-blue-600 dark:text-[#60A5FA]">Source</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-[#F8FAFC] border border-slate-200 dark:border-[#273449]"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className="relative p-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-[#F8FAFC]"
              title="Saved Items"
            >
              <Bookmark className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
              {totalBookmarks > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center">
                  {totalBookmarks}
                </span>
              )}
            </button>

            {currentUser ? (
              <div 
                onClick={() => setActiveTab("dashboard")}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-violet-600 p-[1.5px] cursor-pointer"
                title={`${currentUser.username} (${currentUser.tier || 'Contributor'})`}
              >
                <div className="w-full h-full rounded-full bg-blue-50 dark:bg-[#0F172A] flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-[#60A5FA]">
                  {currentUser.avatar_initials || (currentUser.username ? currentUser.username.slice(0, 2).toUpperCase() : "US")}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-9 h-9 border-3 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium">Loading open-source ecosystem...</p>
            </div>
          ) : (
            <div key={activeTab} className="animate-slide-up">
              {activeTab === "projects" && (
                <ProjectsView
                  repositories={repositories}
                  onSelectProject={(project) => setSelectedProject(project)}
                  bookmarkedProjects={bookmarkedProjects}
                  onToggleBookmark={handleToggleBookmark}
                  userSkills={userSkills}
                />
              )}

              {activeTab === "issues" && (
                <IssuesView
                  issues={issues}
                  bookmarkedIssues={bookmarkedIssues}
                  onToggleBookmark={handleToggleBookmark}
                  onStartContribution={handleStartContribution}
                />
              )}

              {activeTab === "ai" && (
                <AiHubView aiModels={aiModels} />
              )}

              {activeTab === "datasets" && (
                <DatasetsView datasets={datasets} />
              )}

              {activeTab === "learning" && (
                <LearningHubView onOpenRoadmap={() => setIsRoadmapOpen(true)} />
              )}

              {activeTab === "dashboard" && (
                <DashboardView
                  userSkills={userSkills}
                  allSkills={INITIAL_SKILLS}
                  onToggleSkill={handleToggleSkill}
                  repositories={repositories}
                  issues={issues}
                  bookmarkedProjects={bookmarkedProjects}
                  bookmarkedIssues={bookmarkedIssues}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectProject={(project) => setSelectedProject(project)}
                  onStartContribution={handleStartContribution}
                  onOpenRoadmap={() => setIsRoadmapOpen(true)}
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              )}
            </div>
          )}
        </main>

        {/* Clean Developer Platform Footer */}
        <footer className="mt-auto border-t border-slate-200 dark:border-[#273449] bg-white dark:bg-[#0F172A] py-8 text-xs text-slate-500 dark:text-[#94A3B8] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-[11px] shadow-2xs">
                  GS
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-[#F8FAFC] text-xs">
                    Go<span className="text-blue-600 dark:text-[#60A5FA]">Source</span> — Open Source Discovery Platform
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">
                    Curated Repositories, Good First Issues, AI Models & Datasets
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 dark:text-[#CBD5E1] text-xs">
                <button onClick={() => setActiveTab("projects")} className="hover:text-blue-600 dark:hover:text-[#60A5FA] transition-colors">Repositories</button>
                <button onClick={() => setActiveTab("issues")} className="hover:text-blue-600 dark:hover:text-[#60A5FA] transition-colors">Good First Issues</button>
                <button onClick={() => setActiveTab("ai")} className="hover:text-blue-600 dark:hover:text-[#60A5FA] transition-colors">AI Models</button>
                <button onClick={() => setActiveTab("datasets")} className="hover:text-blue-600 dark:hover:text-[#60A5FA] transition-colors">Datasets</button>
                <button onClick={() => setIsRoadmapOpen(true)} className="hover:text-blue-600 dark:hover:text-[#60A5FA] transition-colors">Contribution Roadmap</button>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/ChiruAIHub/GoSource"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#273449] hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white transition-all text-xs font-medium"
                >
                  <GitBranch className="w-3.5 h-3.5 text-blue-600 dark:text-[#60A5FA]" />
                  <span>GitHub Repository</span>
                </a>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#273449]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <span>© 2026 GoSource. All rights reserved.</span>
              <span>Modern developer platform</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStartIssue={handleStartContribution}
      />

      <ContributionRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      <BackendConnectorModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
