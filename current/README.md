# GoSource: AI Open-Source Contribution Finder

> **Track 1:** Best Open-Source / Open-Weight AI Product  
> **Live Website:** https://right-midnight-ate-defense.trycloudflare.com
> **License:** MIT License  
> **Core AI Models:** OpenCode Nemotron 3.5 Super VL 120B / DeepSeek

---

## 🚀 The Mission
Beginners want to contribute to open source but manual issue discovery is slow, confusing, and intimidating. Most "good first issue" tags are stale, already claimed, or too complex.

**GoSource** connects first-time contributors with live, verified-open issues that match their exact programming stack and available time, and provides an AI-generated step-by-step roadmap to make their first PR.

---

## 👥 4-Member Team Architecture

```
gosource-contribution-finder/
├── backend/
│   ├── ai_engine/          # Member 1: AI Triage, Skill Matching, PR Roadmap
│   ├── github_crawler/     # Member 2: Live GitHub Issue Fetcher & Local Cache
│   └── api/                # Member 4: FastAPI Router & Demo Integrator
├── frontend/               # Member 3: Modern Contributor Explorer Dashboard
├── data/                   # Curated Verified Issues for Zero-Failure Demo
└── scripts/                # Team Sync & Drive D: Backup Automation
```
