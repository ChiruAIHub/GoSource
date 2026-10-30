import React from "react";
import { 
  ArrowRight, 
  Cpu, 
  Database, 
  Compass,
  Flame
} from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import IssueCard from "../components/IssueCard";
import ModelCard from "../components/ModelCard";
import DatasetCard from "../components/DatasetCard";

export default function HomeView({
  repositories,
  issues,
  aiModels,
  datasets,
  onSelectProject,
  bookmarkedProjects,
  bookmarkedIssues,
  onToggleBookmark,
  setActiveTab,
  onStartContribution,
  userSkills
}) {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Featured Repositories Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                <Compass className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Recommended Repositories for Beginners
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Vetted open-source projects with welcoming maintainers and structured contributing guides.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("projects")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All Repositories ({repositories.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {repositories.slice(0, 6).map((project) => (
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
      </section>

      {/* Trending "Good First Issues" Banner & Grid */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1326] via-[#0b1020] to-[#090d18] border border-emerald-950/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                <Flame className="w-4 h-4 text-emerald-400" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Ready-to-Claim "Good First Issues"
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Pick an issue labeled for newcomers. Average completion time: 30 to 90 minutes.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("issues")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/70 text-xs font-semibold transition-all shadow-sm"
          >
            <span>Explore All Issues</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {issues.slice(0, 3).map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              isBookmarked={bookmarkedIssues.includes(issue.id)}
              onToggleBookmark={onToggleBookmark}
              onStartContribution={onStartContribution}
            />
          ))}
        </div>
      </section>

      {/* AI & ML Hub Highlight (Hugging Face Inspiration) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-violet-950 text-violet-400 border border-violet-800/60">
                <Cpu className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Trending Open-Weights AI Models
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Inspired by Hugging Face: Inspect model architectures, parameter sizes, and copy-paste inference code.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("ai")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            <span>View All AI Models ({aiModels.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiModels.slice(0, 3).map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Datasets Highlight (Kaggle & Hugging Face Inspiration) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                <Database className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Benchmark Open Datasets
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Curated code, speech, and multimodal benchmark datasets ready for research and hackathon training.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("datasets")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Explore Dataset Explorer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {datasets.slice(0, 2).map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </section>

    </div>
  );
}
