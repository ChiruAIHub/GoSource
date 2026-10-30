import React, { useState, useEffect } from "react";
import { 
  X, 
  Server, 
  CheckCircle2, 
  RefreshCw, 
  Code2, 
  Zap,
  Globe,
  Database
} from "lucide-react";
import { apiService } from "../services/apiClient";

export default function BackendConnectorModal({ isOpen, onClose }) {
  const [mode, setMode] = useState(apiService.getMode());
  const [backendStatus, setBackendStatus] = useState("checking");
  const [pingResult, setPingResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const checkHealth = async () => {
    setTesting(true);
    const isOnline = await apiService.checkBackendHealth();
    setBackendStatus(isOnline ? "connected" : "offline");
    setTesting(false);
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    apiService.setMode(newMode);
    window.dispatchEvent(new Event("storage"));
  };

  const testEndpoint = async () => {
    setTesting(true);
    const start = performance.now();
    try {
      const res = await apiService.getRepositories({ query: "fastapi" });
      const latency = Math.round(performance.now() - start);
      setPingResult({
        success: true,
        source: res.source,
        itemsCount: res.data.length,
        latency: `${latency}ms`
      });
    } catch (err) {
      setPingResult({
        success: false,
        error: err.message
      });
    }
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      
      <div className="animate-modal-pop relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-[#273449] bg-slate-50/70 dark:bg-[#0F172A] flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Backend & Live API Connector</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Configure data source pipelines: GitHub REST API, Hugging Face Hub, and local Python/Node server.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white dark:bg-[#1E293B] text-slate-400 dark:text-[#94A3B8] hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#273449] border border-slate-200 dark:border-[#273449] transition-all shrink-0 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 dark:text-[#CBD5E1]">
          
          {/* Status Row */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${backendStatus === "connected" ? "bg-emerald-500 shadow-md shadow-emerald-500/50 animate-pulse" : "bg-amber-500"}`} />
              <div>
                <p className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm flex items-center gap-2">
                  <span>FastAPI Local Endpoint ({apiService.getBaseUrl ? apiService.getBaseUrl() : "http://127.0.0.1:8000/api"})</span>
                  {backendStatus === "connected" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      LIVE
                    </span>
                  )}
                </p>
                <p className="text-slate-500 dark:text-[#94A3B8]">
                  {backendStatus === "connected" 
                    ? "✓ Connected to GitLaunch Multi-Provider Backend (Port 8000)" 
                    : "Standalone Frontend Mode (Using direct GitHub/HF APIs and local fallback)"}
                </p>
              </div>
            </div>

            <button
              onClick={checkHealth}
              disabled={testing}
              className="btn-animated p-2 rounded-xl bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#273449] text-slate-600 dark:text-[#CBD5E1] border border-slate-200 dark:border-[#273449] shadow-2xs"
              title="Ping server"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="space-y-3">
            <span className="font-bold text-slate-900 dark:text-[#F8FAFC]">Select Execution Data Pipeline:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Hybrid */}
              <div
                onClick={() => handleModeChange("hybrid")}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  mode === "hybrid"
                    ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 dark:border-[#60A5FA] shadow-md ring-1 ring-blue-500/20"
                    : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#273449] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-[#60A5FA]" />
                    <span>Hybrid (Best)</span>
                  </span>
                  {mode === "hybrid" && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] leading-relaxed">
                  Queries live GitHub & HF APIs; falls back gracefully to vetted cache if rate-limited.
                </p>
              </div>

              {/* Pure Live */}
              <div
                onClick={() => handleModeChange("live")}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  mode === "live"
                    ? "bg-violet-50/70 dark:bg-violet-950/40 border-violet-500 dark:border-[#A78BFA] shadow-md ring-1 ring-violet-500/20"
                    : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#273449] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-violet-600 dark:text-[#A78BFA]" />
                    <span>Live APIs Only</span>
                  </span>
                  {mode === "live" && <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-[#A78BFA]" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] leading-relaxed">
                  Strictly queries api.github.com and huggingface.co/api in real-time.
                </p>
              </div>

              {/* Demo Mock */}
              <div
                onClick={() => handleModeChange("mock")}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  mode === "mock"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-400 shadow-md ring-1 ring-emerald-500/20"
                    : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#273449] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Curated Demo</span>
                  </span>
                  {mode === "mock" && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] leading-relaxed">
                  Instant offline demo data with rich tags, perfect for stage presentations without wifi.
                </p>
              </div>

            </div>
          </div>

          {/* Test Pipeline Action */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-[#F8FAFC]">Live Pipeline Test Runner</p>
                <p className="text-slate-500 dark:text-[#94A3B8] text-[11px]">Execute a test query to verify latency and schema validation.</p>
              </div>
              <button
                onClick={testEndpoint}
                disabled={testing}
                className="btn-animated btn-shimmer px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
              >
                {testing ? "Testing..." : "Run Test Query"}
              </button>
            </div>

            {pingResult && (
              <div className="animate-slide-down p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#273449] font-mono text-[11px] text-slate-800 dark:text-[#CBD5E1] shadow-2xs">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Status: {pingResult.success ? "✓ OK" : "✗ Error"}</p>
                <p>Source Provider: <span className="font-semibold text-blue-600 dark:text-[#60A5FA]">{pingResult.source}</span></p>
                <p>Records Returned: {pingResult.itemsCount}</p>
                <p>Roundtrip Latency: {pingResult.latency}</p>
              </div>
            )}
          </div>

          {/* Backend Spec Code for Developers */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-[#CBD5E1] font-bold">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
              <span>FastAPI / Node Backend Integration Contract:</span>
            </div>
            <pre className="p-3 rounded-2xl bg-slate-900 dark:bg-[#030712] border border-slate-800 dark:border-[#1F2937] font-mono text-[10px] text-slate-200 overflow-x-auto leading-relaxed shadow-inner">
{`# Sample Python FastAPI Endpoint (server.py)
from fastapi import FastAPI

app = FastAPI(title="GoSource Engine")

@app.get("/api/discover")
async def discover_projects(skills: str = "Python,React"):
    # Filter GitHub & HuggingFace datasets based on user skill match
    return {"status": "ok", "recommended_repos": [...]}
`}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-[#273449] bg-slate-50/70 dark:bg-[#0F172A] flex justify-end">
          <button
            onClick={onClose}
            className="btn-animated px-5 py-2 rounded-xl bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#273449] text-slate-700 dark:text-[#CBD5E1] font-semibold text-xs border border-slate-200 dark:border-[#273449] shadow-xs"
          >
            Done
          </button>
        </div>

      </div>

    </div>
  );
}
