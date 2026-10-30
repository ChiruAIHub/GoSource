import React, { useState, useEffect } from "react";
import { 
  Compass, 
  GitPullRequest, 
  Cpu, 
  Database, 
  GraduationCap, 
  LayoutDashboard, 
  Bookmark, 
  Server, 
  Sparkles, 
  Map, 
  X,
  ChevronRight,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User
} from "lucide-react";
import { apiService } from "../services/apiClient";

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  bookmarkedCount, 
  onOpenRoadmap, 
  onOpenBackendModal,
  mobileOpen,
  setMobileOpen,
  theme,
  toggleTheme,
  currentUser,
  onOpenAuthModal,
  onSignOut
}) {
  const [apiMode, setApiMode] = useState(apiService.getMode());

  useEffect(() => {
    const handleStorage = () => setApiMode(apiService.getMode());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const navItems = [
    { id: "projects", label: "All Repositories", icon: Compass },
    { id: "issues", label: "Good First Issues", icon: GitPullRequest, badge: "Beginner" },
    { id: "ai", label: "AI Models", icon: Cpu },
    { id: "datasets", label: "Datasets", icon: Database },
    { id: "learning", label: "Learning Hub", icon: GraduationCap },
    { id: "dashboard", label: "Dashboards", icon: LayoutDashboard }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Vertical Fixed Left Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-[#273449] flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xs ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top: Logo, Brand & Theme Toggle */}
        <div>
          <div className="h-16 px-4 border-b border-slate-100 dark:border-[#273449] flex items-center justify-between">
            <div 
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => handleNavClick("projects")}
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-[1px] shadow-xs">
                <div className="w-full h-full bg-white dark:bg-[#0F172A] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
                  Go<span className="text-blue-600 dark:text-[#60A5FA]">Source</span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-medium leading-none">Developer Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-[#F8FAFC] hover:text-blue-600 dark:hover:text-[#60A5FA] border border-slate-200 dark:border-[#273449] transition-all"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-90 duration-200" />
                )}
              </button>

              {/* Mobile close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items (Vertical List) */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
              Navigation
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? "text-blue-600 dark:text-[#60A5FA] bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/70 font-semibold shadow-xs translate-x-1" 
                      : "text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#111827] hover:translate-x-1 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-[#60A5FA]" : "text-slate-400 dark:text-[#94A3B8]"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section of Sidebar */}
        <div className="p-3 border-t border-slate-100 dark:border-[#273449] space-y-2 bg-slate-50/60 dark:bg-[#0B1120]">
          
          {/* Contribution Roadmap Trigger */}
          <button
            onClick={() => {
              onOpenRoadmap();
              setMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-violet-50 hover:bg-violet-100/80 dark:bg-violet-950/40 dark:hover:bg-violet-900/40 text-violet-700 dark:text-[#A78BFA] border border-violet-200/80 dark:border-violet-800/60 text-xs font-semibold shadow-2xs btn-animated btn-shimmer transition-all"
          >
            <div className="flex items-center gap-2">
              <Map className="w-3.5 h-3.5 text-violet-600 dark:text-[#A78BFA]" />
              <span>Contribution Roadmap</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
          </button>

          {/* Backend API Status Trigger */}
          <button
            onClick={() => {
              onOpenBackendModal();
              setMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] border border-slate-200 dark:border-[#273449] text-slate-700 dark:text-[#CBD5E1] text-xs shadow-2xs btn-animated transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-mono text-slate-600 dark:text-[#94A3B8]">API: {apiMode}</span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 font-medium">Ready</span>
          </button>

          {/* User Profile / Sign In Mini Card */}
          {currentUser ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] border border-slate-200 dark:border-[#273449] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div 
                onClick={() => handleNavClick("dashboard")}
                className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-600 p-[1.5px] shadow-2xs shrink-0">
                  <div className="w-full h-full rounded-full bg-blue-50 dark:bg-[#0F172A] flex items-center justify-center text-xs font-bold text-blue-700 dark:text-[#60A5FA]">
                    {currentUser.avatar_initials || (currentUser.username ? currentUser.username.slice(0, 2).toUpperCase() : "US")}
                  </div>
                </div>
                <div className="text-left truncate">
                  <p className="text-xs font-semibold text-slate-900 dark:text-[#F8FAFC] leading-tight truncate">
                    {currentUser.display_name || currentUser.username}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium leading-none">
                    {currentUser.tier || "Contributor"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {bookmarkedCount > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/60">
                    <Bookmark className="w-3 h-3 fill-current text-blue-600 dark:text-[#60A5FA]" />
                    <span>{bookmarkedCount}</span>
                  </span>
                )}
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuthModal();
                setMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs btn-animated btn-shimmer transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Join</span>
            </button>
          )}

        </div>

      </aside>
    </>
  );
}
