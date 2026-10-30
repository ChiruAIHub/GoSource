# GitLaunch: Unified Open-Source AI Repository & Contribution Hub

> **Hacktoberfest Hack Day 2026 @ Newton School of Technology (SMRU × MLH)**  
> **Track 1:** Best Open-Source / Open-Weight AI Product  
> **Problem Statement #20:** Open-Source Contribution Finder  
> **Core AI Engine:** OpenCode Nemotron 3.5 Super VL 120B (Open-Weight, Zero Cloud Quota Burn)

---

## 🌟 The Core Vision
GitLaunch brings together repositories and beginner-friendly contribution opportunities from across the entire open-source AI ecosystem (**GitHub, Hugging Face Hub, Ollama Library, ModelScope, Kaggle, etc.**) into one unified dashboard.

Every repository and issue card prominently displays:
1. **Source Platform Badge**: (`[GitHub]`, `[Hugging Face]`, `[Ollama Library]`, etc.)
2. **Fetch Link**: The exact URL / API source from which the project was retrieved.
3. **One-Click Direct Redirect**: Instantly takes the developer directly to the original website/repository where they can star, fork, or submit their PR.
4. **AI-Powered Triage & Roadmap**: Powered by open-weight **Nemotron 3.5 Super VL 120B**, providing plain-English issue summaries, file pointers, difficulty ratings, and copy-paste git command roadmaps.

---

## 🔌 API Endpoints for Frontend Teammates

Backend is running live at: `http://localhost:8000`  
Interactive Swagger Docs: `http://localhost:8000/docs`

### 1. `GET /api/repos` (All Aggregated Repositories in One Place)
Returns all open-source repositories brought together from the different websites with their fetch link and direct redirect link.
- **Query Params (Optional)**: `?platform=github`, `?category=AI Agents`, `?language=python`, `?search=litellm`
- **Response**:
```json
{
  "count": 12,
  "platforms_aggregated": ["GitHub", "Hugging Face Hub", "Ollama Library", "ModelScope"],
  "repositories": [
    {
      "name": "LiteLLM",
      "owner_repo": "BerriAI/litellm",
      "source_platform": "GitHub",
      "category": "Inference / LLM Proxy",
      "fetch_link": "https://api.github.com/repos/BerriAI/litellm",
      "redirect_url": "https://github.com/BerriAI/litellm",
      "stars": 24500,
      "language": "python"
    }
  ]
}
```

### 2. `GET /api/redirect/{item_id}` (Direct Browser Redirection)
Directly issues an `HTTP 307 Redirect` to take the user from GitLaunch straight to the original open-source site.
- **Example**: `http://localhost:8000/api/redirect/iss-101` redirects directly to `https://github.com/BerriAI/litellm/issues/4512`.

### 3. `POST /api/issues/match` (Smart Contributor Matching)
- **Request Body**:
```json
{
  "languages": ["python", "javascript"],
  "experience": "beginner",
  "time": "1 hour"
}
```
- **Returns**: Issues ranked by match score (e.g. 98%), stars, repo metadata, `source_platform`, `fetch_url`, and `direct_redirect_url`.

### 4. `POST /api/issues/analyze` (AI Issue Explainer)
- **Request Body**: `{"issue_id": "123"}` or `{"issue_id": "iss-101"}`
- **Returns**: 3-bullet plain-English summary, files to modify, difficulty score, estimated time to fix, and `direct_redirect_url`.

### 5. `POST /api/issues/pr-roadmap` (Ready-to-Copy Contribution Checklist)
- **Request Body**: `{"issue_id": "123"}`
- **Returns**: `git clone` command, `git checkout -b` command, 5-step checklist, and pre-filled PR title and markdown description.

### 6. `GET /api/ecosystem` (Curated Open-Source Directory from PDF)
Returns complete category directory (Model Hubs, Inference APIs, Frameworks, Creative Media).

---

## 💾 Hard Drive D: Sync System
- All project files and snapshots are backed up to: `D:\Hacktoberfest2026_GitLaunch\`
- To pull the latest code on any laptop: run `PULL_LATEST_PROJECT_TO_MY_LAPTOP.bat` directly from Drive D:.

---

## ⚖️ Open-Source Licensing & Hackathon Compliance Declaration

> Built for **Hacktoberfest Hack Day 2026 @ Newton School of Technology (SMRU × MLH)**  
> **Track 1:** Best Open-Source / Open-Weight AI Product  
> **Problem Statement #20:** Open-Source Contribution Finder  

This project implements a verified **Two-Layer Open-Source Architecture** in full compliance with the official Hack Day evaluation rules:

### 1. Software & Platform Layer
* **Project Codebase:** [GitLaunch / GoSource Platform](https://github.com/ChiruAIHub/GoSource)
* **Software License:** [MIT License](LICENSE) (OSI-Approved, Permissive Open-Source)
* **Scope:** Covers all frontend React/Vite interfaces, FastAPI backend endpoints, crawler adapters, and caching services.

### 2. Artificial Intelligence Model Layer
* **Primary AI Engine:** OpenCode Nemotron 3.5 Super VL 120B / DeepSeek-V3
* **Model Type:** Open-Weights Foundational LLM (Zero Cloud Quota Burn, Local / Open Inference)
* **Model License:** [Apache 2.0 / DeepSeek Open Model License](https://huggingface.co/deepseek-ai) (Permissive Commercial & Research Use)
* **Source & Provenance:** [Hugging Face Hub Model Repository](https://huggingface.co/models) / [Ollama Library](https://ollama.com/library)

### 3. Upstream Provider Attribution
All aggregated repository, issue, and dataset metadata displayed in GitLaunch originates from official open APIs:
* **GitHub REST API v3:** [https://docs.github.com/en/rest](https://docs.github.com/en/rest) (MIT / Open API Guidelines)
* **Hugging Face Hub API:** [https://huggingface.co/docs/hub/api](https://huggingface.co/docs/hub/api) (Apache-2.0 Client)
* **Kaggle Public API:** [https://www.kaggle.com/docs/api](https://www.kaggle.com/docs/api) (Open Data Commons)
