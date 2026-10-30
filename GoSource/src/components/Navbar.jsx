import React, { useState, useEffect } from "react";
import { 
  Compass, 
  GitPullRequest, 
  Cpu, 
  Database, 
  GraduationCap, 
  Map, 
  LayoutDashboard, 
  Bookmark, 
  Search, 
  Server, 
  Sparkles, 
  Menu,
  X,
  LogIn,
  LogOut
} from "lucide-react";
import { apiService } from "../services/apiClient";

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  bookmarkedCount, 
  onOpenRoadmap, 
  onOpenBackendModal,
  onOpenSearch,
  currentUser,
  onOpenAuthModal,
  onSignOut
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiMode, setApiMode] = useState(apiService.getMode());

  useEffect(() => {
    const handleStorage = () => setApiMode(apiService.getMode());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const navItems = [
    { id: "home", label: "Discover", icon: Compass },
    { id: "projects", label: "Repositories", icon: Compass },
    { id: "issues", label: "Good First Issues", icon: GitPullRequest, badge: "Beginner" },
    { id: "ai", label: "AI Models", icon: Cpu },
    { id: "datasets", label: "Datasets", icon: Database },
    { id: "learning", label: "Learning Hub", icon: GraduationCap },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer shrink-0" 
            onClick={() => {
              setActiveTab("home");
              setMobileMenuOpen(false);
            }}
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0a0f1d] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Go<span className="text-cyan-400">Source</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-800/60 uppercase tracking-wider">
                  Launchpad
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Open Source Discovery</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? "text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 shadow-sm shadow-cyan-950" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Search Bar Trigger */}
            <button
              onClick={onOpenSearch}
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xl:inline">Quick search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
                Ctrl K
              </kbd>
            </button>

            {/* Mobile Search Icon Button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Contribution Roadmap Trigger */}
            <button
              onClick={onOpenRoadmap}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-900/30 transition-all"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Roadmap</span>
            </button>

            {/* Backend API Connector Pill */}
            <button
              onClick={onOpenBackendModal}
              title="Backend & Live API Connector"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Server className="w-3.5 h-3.5 text-emerald-400 -ml-1" />
              <span className="hidden xl:inline text-[11px] text-slate-300 font-mono">
                API: {apiMode}
              </span>
            </button>

            {/* Saved Bookmarks */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all"
              title="Saved Items"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign In Pill */}
            {currentUser ? (
              <div 
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2 pl-1 sm:pl-2 cursor-pointer border-l border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-cyan-300">
                    {currentUser.avatar_initials || (currentUser.username ? currentUser.username.slice(0, 2).toUpperCase() : "US")}
                  </div>
                </div>
                <div className="hidden 2xl:block text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentUser.display_name || currentUser.username}
                  </p>
                  <p className="text-[10px] text-emerald-400 leading-none">
                    {currentUser.tier || "Contributor"}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800/80 space-y-3 bg-[#090d16] animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? "text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 shadow-sm" 
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile action shortcuts */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 px-1">
              <button
                onClick={() => {
                  onOpenBackendModal();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300"
              >
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>API: {apiMode}</span>
              </button>

              <button
                onClick={() => {
                  onOpenRoadmap();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs text-white font-semibold"
              >
                <Map className="w-3.5 h-3.5" />
                <span>PR Roadmap</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
