/**
 * GoSource Unified API Service Layer
 * Designed for plug-and-play connection to:
 * 1. Official GitHub REST API (v3)
 * 2. Official Hugging Face Model & Dataset Hub APIs
 * 3. Custom GoSource Backend Server (FastAPI / Express / Node.js)
 * 4. Resilient Offline Demo Data fallback with clear live/mock indicators
 */

import { REPOSITORIES, GOOD_FIRST_ISSUES, AI_MODELS, DATASETS } from "../data/mockData";

const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000/api";
const GITHUB_API_URL = "https://api.github.com";
const HF_API_URL = "https://huggingface.co/api";

class ApiService {
  constructor() {
    this.mode = localStorage.getItem("gosource_api_mode") || "hybrid"; // 'live', 'mock', or 'hybrid'
    this.backendStatus = "checking";
    this.activeBackendUrl = import.meta.env.VITE_BACKEND_API_URL || DEFAULT_BACKEND_URL;
    this.checkBackendHealth();
  }

  setMode(mode) {
    this.mode = mode;
    localStorage.setItem("gosource_api_mode", mode);
  }

  getMode() {
    return this.mode;
  }

  getBaseUrl() {
    return this.activeBackendUrl;
  }

  async checkBackendHealth() {
    const candidateUrls = [
      this.activeBackendUrl,
      "http://127.0.0.1:8000/api",
      "http://localhost:8000/api"
    ];

    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${url}/status`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          this.activeBackendUrl = url;
          this.backendStatus = "connected";
          return true;
        }
      } catch {
        // try next candidate
      }
    }
    this.backendStatus = "offline";
    return false;
  }

  /**
   * Search and fetch repositories
   * Queries local backend if available, or official GitHub API, with fallback to curated list
   */
  async getRepositories({ query = "", language = "", domain = "", difficulty = "" } = {}) {
    // 1. If live FastAPI backend is online, prioritize backend repository hub
    if (this.backendStatus === "connected" && this.mode !== "mock") {
      try {
        const params = new URLSearchParams();
        if (query) params.append("search", query);
        if (language && language !== "All") params.append("language", language);
        const res = await fetch(`${this.activeBackendUrl}/repos?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.repositories && data.repositories.length > 0) {
            return {
              source: "fastapi-backend",
              data: data.repositories.map(r => ({
                id: r.id || r.repo,
                name: r.name,
                owner: r.repo ? r.repo.split('/')[0] : r.source_platform,
                stars: r.stars || 1000,
                forks: r.forks || 200,
                language: r.language || 'Python',
                domain: r.category || 'AI & Machine Learning',
                difficulty: r.difficulty || 'Beginner Friendly',
                description: r.description,
                license: 'Open Source',
                url: r.direct_redirect_url || r.fetch_source_url,
                topics: r.tags || [],
                goodFirstIssuesCount: 6,
                skillsRequired: [r.language || 'Python', ...(r.tags || []).slice(0, 2)],
                matchScore: 92,
                setupGuide: r.quick_command || `git clone ${r.fetch_source_url}.git\ncd ${r.name}`,
                contributingUrl: r.direct_redirect_url
              }))
            };
          }
        }
      } catch (err) {
        console.warn("Backend fetch failed, falling back:", err);
      }
    }

    if (this.mode === "live") {
      try {
        const langFilter = language && language !== "All" ? `+language:${encodeURIComponent(language)}` : "";
        const q = `${query || "stars:>5000"}${langFilter}`;
        const res = await fetch(`${GITHUB_API_URL}/search/repositories?q=${q}&sort=stars&order=desc&per_page=15`);
        if (res.ok) {
          const data = await res.json();
          return {
            source: "github-live",
            data: data.items.map(item => ({
              id: `gh-${item.id}`,
              name: item.name,
              owner: item.owner?.login,
              stars: item.stargazers_count,
              forks: item.forks_count,
              openIssues: item.open_issues_count,
              language: item.language || "Unknown",
              domain: "Open Source",
              difficulty: item.open_issues_count > 20 ? "Beginner Friendly" : "Intermediate",
              description: item.description || "No description provided.",
              license: item.license?.spdx_id || "Open Source",
              url: item.html_url,
              topics: item.topics || [],
              goodFirstIssuesCount: Math.min(item.open_issues_count, 12),
              skillsRequired: [item.language].filter(Boolean),
              matchScore: 90,
              featured: item.stargazers_count > 50000,
              setupGuide: `git clone ${item.html_url}.git\ncd ${item.name}`,
              contributingUrl: `${item.html_url}/blob/main/CONTRIBUTING.md`
            }))
          };
        }
      } catch (err) {
        console.warn("Live GitHub fetch failed, falling back to curated cache:", err);
      }
    }

    // Filter local curated dataset
    let filtered = [...REPOSITORIES];
    if (language && language !== "All") {
      filtered = filtered.filter(r => r.language.toLowerCase() === language.toLowerCase());
    }
    if (domain && domain !== "All") {
      filtered = filtered.filter(r => r.domain.toLowerCase().includes(domain.toLowerCase()));
    }
    if (difficulty && difficulty !== "All") {
      filtered = filtered.filter(r => r.difficulty.toLowerCase().includes(difficulty.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.topics.some(t => t.toLowerCase().includes(q))
      );
    }

    return {
      source: "curated-prototype",
      data: filtered
    };
  }

  /**
   * Search beginner-friendly issues
   */
  async getIssues({ query = "", language = "", label = "good first issue" } = {}) {
    if (this.mode === "live") {
      try {
        const langFilter = language && language !== "All" ? `+language:${encodeURIComponent(language)}` : "";
        const labelFilter = label ? `+label:"${encodeURIComponent(label)}"` : "";
        const q = `is:issue is:open${labelFilter}${langFilter} ${query || ""}`;
        const res = await fetch(`${GITHUB_API_URL}/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=15`);
        if (res.ok) {
          const data = await res.json();
          return {
            source: "github-live",
            data: data.items.map(item => {
              const repoPath = item.repository_url.replace("https://api.github.com/repos/", "");
              return {
                id: `gh-issue-${item.id}`,
                title: item.title,
                repo: repoPath,
                repoLanguage: language || "Various",
                labels: item.labels.map(l => l.name),
                difficulty: "Beginner",
                estimatedTime: "1-2 hours",
                comments: item.comments,
                url: item.html_url,
                description: item.body?.slice(0, 200) || "Click issue link to view details on GitHub.",
                skillsRequired: [language || "Git"],
                mentorshipAvailable: true,
                created: "Recently"
              };
            })
          };
        }
      } catch (err) {
        console.warn("Live issues fetch error, falling back:", err);
      }
    }

    let filtered = [...GOOD_FIRST_ISSUES];
    if (language && language !== "All") {
      filtered = filtered.filter(i => i.repoLanguage.toLowerCase() === language.toLowerCase());
    }
    if (label && label !== "All") {
      filtered = filtered.filter(i => i.labels.some(l => l.toLowerCase().includes(label.toLowerCase())));
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.repo.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }

    return {
      source: "curated-prototype",
      data: filtered
    };
  }

  /**
   * Fetch trending AI models (Hugging Face)
   */
  async getAiModels({ query = "", task = "" } = {}) {
    if (this.mode === "live") {
      try {
        const filterParam = task && task !== "All" ? `&filter=${encodeURIComponent(task)}` : "";
        const searchParam = query ? `&search=${encodeURIComponent(query)}` : "";
        const res = await fetch(`${HF_API_URL}/models?limit=15&sort=likes7d&direction=-1${filterParam}${searchParam}`);
        if (res.ok) {
          const items = await res.json();
          return {
            source: "huggingface-live",
            data: items.map(m => ({
              id: m.id,
              name: m.id.split("/")[1] || m.id,
              creator: m.id.split("/")[0] || "Community",
              task: m.pipeline_tag || "General",
              parameters: m.safetensors?.parameters ? `${Math.round(m.safetensors.parameters / 1e9)}B` : "Open Weights",
              downloads: m.downloads ? (m.downloads > 1e6 ? `${(m.downloads/1e6).toFixed(1)}M` : `${Math.round(m.downloads/1e3)}k`) : "10k+",
              likes: m.likes ? `${m.likes}` : "500+",
              license: "Open Source",
              url: `https://huggingface.co/${m.id}`,
              description: `Pre-trained weights and checkpoints for ${m.pipeline_tag || "machine learning"} tasks.`,
              contextLength: "Standard",
              tags: m.tags?.slice(0, 4) || [],
              samplePrompt: "Run inference pipeline using transformers or diffusers library.",
              pipelineCode: `from transformers import pipeline\n\npipe = pipeline('${m.pipeline_tag || "text-generation"}', model='${m.id}')`
            }))
          };
        }
      } catch (err) {
        console.warn("Hugging Face API failed, falling back:", err);
      }
    }

    let filtered = [...AI_MODELS];
    if (task && task !== "All") {
      filtered = filtered.filter(m => m.task.toLowerCase().includes(task.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.creator.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }

    return {
      source: "curated-prototype",
      data: filtered
    };
  }

  /**
   * Fetch benchmark datasets (Hugging Face / Kaggle)
   */
  async getDatasets({ query = "", category = "" } = {}) {
    let filtered = [...DATASETS];
    if (category && category !== "All") {
      filtered = filtered.filter(d => d.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return {
      source: "curated-prototype",
      data: filtered
    };
  }

  // ==============================================================
  // Authentication & Contributor Profile Service Methods
  // ==============================================================

  getToken() {
    return localStorage.getItem("gosource_auth_token") || null;
  }

  setToken(token) {
    if (token) {
      localStorage.setItem("gosource_auth_token", token);
    } else {
      localStorage.removeItem("gosource_auth_token");
    }
  }

  clearToken() {
    localStorage.removeItem("gosource_auth_token");
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  }

  /**
   * Registers a new contributor account
   */
  async register({ username, email, password, skills = [], github_username = "" }) {
    try {
      const res = await fetch(`${this.activeBackendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, skills, github_username })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || "Registration failed");
      }
      if (data.token) this.setToken(data.token);
      return data;
    } catch (err) {
      console.error("Auth register error:", err);
      throw err;
    }
  }

  /**
   * Authenticates contributor by email or username
   */
  async login({ email, password }) {
    try {
      const res = await fetch(`${this.activeBackendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || "Invalid credentials");
      }
      if (data.token) this.setToken(data.token);
      return data;
    } catch (err) {
      console.error("Auth login error:", err);
      throw err;
    }
  }

  /**
   * Retrieves current authenticated contributor profile
   */
  async getCurrentUser() {
    try {
      const res = await fetch(`${this.activeBackendUrl}/auth/me`, {
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Backend auth/me unreachable:", err);
    }
    return {
      authenticated: false,
      user: null
    };
  }

  /**
   * Links a platform (GitHub, Hugging Face, Kaggle) to the current user
   */
  async linkPlatform({ platform, username }) {
    try {
      const res = await fetch(`${this.activeBackendUrl}/auth/link-platform`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ platform, username })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || "Platform link failed");
      }
      return data;
    } catch (err) {
      console.error("Platform link error:", err);
      throw err;
    }
  }

  /**
   * Synchronizes contributor skills and bookmarked repositories & issues
   */
  async syncPreferences({ skills, bookmarked_repos, bookmarked_issues }) {
    try {
      const res = await fetch(`${this.activeBackendUrl}/auth/sync-preferences`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ skills, bookmarked_repos, bookmarked_issues })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Sync preferences warning:", err);
    }
    return null;
  }

  /**
   * Sends 6-digit login verification code to Gmail/email
   */
  async sendLoginCode(email) {
    try {
      const res = await fetch(`${this.activeBackendUrl}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || "Failed to send verification code");
      }
      return data;
    } catch (err) {
      console.error("Send code error:", err);
      throw err;
    }
  }

  /**
   * Verifies 6-digit login code and logs in
   */
  async verifyLoginCode({ email, code }) {
    try {
      const res = await fetch(`${this.activeBackendUrl}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || "Invalid verification code");
      }
      if (data.token) this.setToken(data.token);
      return data;
    } catch (err) {
      console.error("Verify code error:", err);
      throw err;
    }
  }

  /**
   * 1-Click GitHub login
   */
  async loginWithGitHub(username = "contributor") {
    try {
      const res = await fetch(`${this.activeBackendUrl}/auth/github/login?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || "GitHub login failed");
      }
      if (data.token) this.setToken(data.token);
      return data;
    } catch (err) {
      console.error("GitHub login error:", err);
      throw err;
    }
  }
}

export const apiService = new ApiService();
