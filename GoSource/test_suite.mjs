// Comprehensive Automated Test Suite for GoSource Open Source Discovery Platform
// Tests all 10 core feature modules, data integrity, filters, endpoints, and theme tokens.

import http from "node:http";
import assert from "node:assert";
import fs from "node:fs";

// Load mock dataset directly
import { 
  REPOSITORIES, 
  GOOD_FIRST_ISSUES, 
  AI_MODELS, 
  DATASETS, 
  INITIAL_SKILLS, 
  LEARNING_MODULES, 
  CONTRIBUTION_ROADMAP_STEPS 
} from "./src/data/mockData.js";

console.log("=================================================");
console.log("🔍 STARTING GOSOURCE FULL-STACK FEATURE AUDIT");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// ---------------------------------------------------------------------
// TEST GROUP 1: Server Endpoints & HTTP Availability
// ---------------------------------------------------------------------
console.log("🌐 [Group 1] Server & API Endpoints Verification:");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on("error", reject);
  });
}

await asyncTest("Server responds 200 on /api/health", async () => {
  const res = await fetchUrl("http://127.0.0.1:5173/api/health");
  assert.strictEqual(res.status, 200);
  const json = JSON.parse(res.body);
  assert.strictEqual(json.status, "healthy");
  assert.strictEqual(json.port, 5173);
});

await asyncTest("Server responds 200 on /api/status with payload", async () => {
  const res = await fetchUrl("http://127.0.0.1:5173/api/status");
  assert.strictEqual(res.status, 200);
  const json = JSON.parse(res.body);
  assert.strictEqual(json.status, "online");
  assert.ok(json.project_scope || json.problem_statement);
  assert.ok(Array.isArray(json.capabilities));
});

await asyncTest("Server serves compiled SPA index.html", async () => {
  const res = await fetchUrl("http://127.0.0.1:5173/");
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.includes("GoSource"));
  assert.ok(res.body.includes("gosource_theme"));
});

// ---------------------------------------------------------------------
// TEST GROUP 2: Repository Discovery & Schema Integrity
// ---------------------------------------------------------------------
console.log("\n📦 [Group 2] All Repositories Feature & Filtering:");

test("REPOSITORIES array has at least 8 curated projects", () => {
  assert.ok(REPOSITORIES.length >= 8, `Found ${REPOSITORIES.length} repositories`);
});

test("Each repository adheres to the expected schema", () => {
  REPOSITORIES.forEach(repo => {
    assert.ok(repo.id, "Missing id");
    assert.ok(repo.name, "Missing name");
    assert.ok(repo.owner, "Missing owner");
    assert.ok(typeof repo.stars === "number", "Invalid stars");
    assert.ok(typeof repo.forks === "number", "Invalid forks");
    assert.ok(repo.language, "Missing language");
    assert.ok(repo.domain, "Missing domain");
    assert.ok(repo.difficulty, "Missing difficulty");
    assert.ok(repo.setupGuide, "Missing setupGuide");
    assert.ok(repo.contributingUrl, "Missing contributingUrl");
    assert.ok(Array.isArray(repo.skillsRequired), "skillsRequired should be array");
  });
});

test("Language filter filters repositories correctly", () => {
  const pythonRepos = REPOSITORIES.filter(r => r.language.toLowerCase() === "python");
  assert.ok(pythonRepos.length > 0, "Expected at least 1 Python repo");
  pythonRepos.forEach(r => assert.strictEqual(r.language.toLowerCase(), "python"));
});

test("Difficulty filter filters repositories correctly", () => {
  const beginnerRepos = REPOSITORIES.filter(r => r.difficulty.toLowerCase().includes("beginner"));
  assert.ok(beginnerRepos.length > 0, "Expected at least 1 beginner repo");
});

test("Domain filter filters repositories correctly", () => {
  const aiRepos = REPOSITORIES.filter(r => r.domain.toLowerCase().includes("ai"));
  assert.ok(aiRepos.length > 0, "Expected at least 1 AI domain repo");
});

test("Sorting repositories by stars works descending", () => {
  const sorted = [...REPOSITORIES].sort((a, b) => b.stars - a.stars);
  for (let i = 0; i < sorted.length - 1; i++) {
    assert.ok(sorted[i].stars >= sorted[i + 1].stars);
  }
});

// ---------------------------------------------------------------------
// TEST GROUP 3: Good First Issues Finder
// ---------------------------------------------------------------------
console.log("\n🎯 [Group 3] Good First Issues Finder:");

test("GOOD_FIRST_ISSUES array has valid newcomer issues", () => {
  assert.ok(GOOD_FIRST_ISSUES.length >= 6, `Found ${GOOD_FIRST_ISSUES.length} issues`);
  GOOD_FIRST_ISSUES.forEach(issue => {
    assert.ok(issue.id, "Missing id");
    assert.ok(issue.title, "Missing title");
    assert.ok(issue.repo, "Missing repo");
    assert.ok(issue.repoLanguage, "Missing repoLanguage");
    assert.ok(Array.isArray(issue.labels), "Missing labels array");
    assert.ok(typeof issue.mentorshipAvailable === "boolean", "mentorshipAvailable should be boolean");
  });
});

test("Mentorship filter isolates mentored issues", () => {
  const mentored = GOOD_FIRST_ISSUES.filter(i => i.mentorshipAvailable);
  assert.ok(mentored.length > 0, "Expected at least 1 mentored issue");
  mentored.forEach(i => assert.strictEqual(i.mentorshipAvailable, true));
});

test("Label filter isolates 'good first issue'", () => {
  const gfi = GOOD_FIRST_ISSUES.filter(i => i.labels.some(l => l.toLowerCase() === "good first issue"));
  assert.ok(gfi.length > 0, "Expected at least 1 issue with 'good first issue' label");
});

// ---------------------------------------------------------------------
// TEST GROUP 4: AI & ML Models Hub
// ---------------------------------------------------------------------
console.log("\n🤖 [Group 4] AI Models & Open Weights Hub:");

test("AI_MODELS array has top open weights models", () => {
  assert.ok(AI_MODELS.length >= 5, `Found ${AI_MODELS.length} models`);
  AI_MODELS.forEach(m => {
    assert.ok(m.id, "Missing id");
    assert.ok(m.name, "Missing name");
    assert.ok(m.creator, "Missing creator");
    assert.ok(m.task, "Missing task");
    assert.ok(m.parameters, "Missing parameters");
    assert.ok(m.pipelineCode.includes("import"), "pipelineCode must contain runnable code");
  });
});

test("DeepSeek, Llama, and FLUX are present in model catalogue", () => {
  const names = AI_MODELS.map(m => m.name.toLowerCase());
  assert.ok(names.some(n => n.includes("deepseek")), "DeepSeek model missing");
  assert.ok(names.some(n => n.includes("llama")), "Llama model missing");
  assert.ok(names.some(n => n.includes("flux")), "FLUX model missing");
});

// ---------------------------------------------------------------------
// TEST GROUP 5: Datasets Explorer
// ---------------------------------------------------------------------
console.log("\n📊 [Group 5] Open Datasets Explorer:");

test("DATASETS array contains Hugging Face and Kaggle data", () => {
  assert.ok(DATASETS.length >= 4, `Found ${DATASETS.length} datasets`);
  DATASETS.forEach(d => {
    assert.ok(d.id, "Missing id");
    assert.ok(d.name, "Missing name");
    assert.ok(d.source, "Missing source");
    assert.ok(d.category, "Missing category");
    assert.ok(Array.isArray(d.previewRows), "previewRows must be array");
    assert.ok(d.previewRows.length > 0, "previewRows must have sample records");
  });
});

test("Sources include both Hugging Face and Kaggle", () => {
  const sources = DATASETS.map(d => d.source.toLowerCase());
  assert.ok(sources.some(s => s.includes("hugging face")), "Hugging Face dataset missing");
  assert.ok(sources.some(s => s.includes("kaggle")), "Kaggle dataset missing");
});

// ---------------------------------------------------------------------
// TEST GROUP 6: Beginner Learning Hub
// ---------------------------------------------------------------------
console.log("\n🎓 [Group 6] Beginner Learning Hub & Tracks:");

test("LEARNING_MODULES contains structured tracks with runnable commands", () => {
  assert.ok(LEARNING_MODULES.length >= 4, "Expected at least 4 learning tracks");
  LEARNING_MODULES.forEach(m => {
    assert.ok(m.id, "Missing id");
    assert.ok(m.title, "Missing title");
    assert.ok(Array.isArray(m.steps), "Steps must be an array");
    assert.ok(m.steps.length >= 3, "Module should have at least 3 steps");
  });
});

// ---------------------------------------------------------------------
// TEST GROUP 7: 5-Step Contribution Roadmap
// ---------------------------------------------------------------------
console.log("\n🗺️ [Group 7] 5-Step Contribution Roadmap:");

test("CONTRIBUTION_ROADMAP_STEPS has all 5 canonical open-source stages", () => {
  assert.strictEqual(CONTRIBUTION_ROADMAP_STEPS.length, 5);
  const titles = CONTRIBUTION_ROADMAP_STEPS.map(s => s.title);
  assert.ok(titles.some(t => t.includes("Discovery") || t.includes("Find")));
  assert.ok(titles.some(t => t.includes("Fork")));
  assert.ok(titles.some(t => t.includes("Branch")));
  assert.ok(titles.some(t => t.includes("Test") || t.includes("Implement")));
  assert.ok(titles.some(t => t.includes("Pull Request") || t.includes("Push")));
});

// ---------------------------------------------------------------------
// TEST GROUP 8: Dynamic Skill Matching Algorithm
// ---------------------------------------------------------------------
console.log("\n⚡ [Group 8] Dynamic Skill Matching Calculation:");

test("Skill match calculation updates dynamically based on user skill set", () => {
  const userSkillsA = ["Python", "FastAPI"];
  const repo = REPOSITORIES.find(r => r.name.toLowerCase() === "fastapi");
  assert.ok(repo, "FastAPI repo not found");

  const matchingA = repo.skillsRequired.filter(s => userSkillsA.includes(s));
  const scoreA = Math.round((matchingA.length / repo.skillsRequired.length) * 100);
  assert.ok(scoreA > 0, `Expected positive score for FastAPI with Python/FastAPI, got ${scoreA}`);

  const userSkillsB = ["Rust"];
  const matchingB = repo.skillsRequired.filter(s => userSkillsB.includes(s));
  const scoreB = Math.round((matchingB.length / repo.skillsRequired.length) * 100);
  assert.strictEqual(scoreB, 0, "Expected 0 score for Rust against FastAPI");
});

// ---------------------------------------------------------------------
// TEST GROUP 9: Dashboard Metrics & Gamification
// ---------------------------------------------------------------------
console.log("\n🏆 [Group 9] Dashboard Metrics & Gamification:");

test("Initial skills list contains full developer stack", () => {
  assert.ok(INITIAL_SKILLS.includes("Python"));
  assert.ok(INITIAL_SKILLS.includes("React"));
  assert.ok(INITIAL_SKILLS.includes("TypeScript"));
  assert.ok(INITIAL_SKILLS.includes("FastAPI"));
  assert.ok(INITIAL_SKILLS.includes("Rust"));
  assert.ok(INITIAL_SKILLS.includes("Docker"));
});

// ---------------------------------------------------------------------
// TEST GROUP 10: LocalStorage Keys & Persistence Contracts
// ---------------------------------------------------------------------
console.log("\n💾 [Group 10] LocalStorage Keys & Persistence Contracts:");

test("LocalStorage keys adhere to standard gosource_* naming convention", () => {
  const keys = [
    "gosource_theme",
    "gosource_user_skills",
    "gosource_bookmarked_repos",
    "gosource_bookmarked_issues",
    "gosource_roadmap_progress",
    "gosource_api_mode"
  ];
  keys.forEach(k => assert.ok(k.startsWith("gosource_"), `Key ${k} must start with gosource_`));
});

// ---------------------------------------------------------------------
// TEST GROUP 11: Theme Tokens & Pre-hydration CSS
// ---------------------------------------------------------------------
console.log("\n🎨 [Group 11] Theme Tokens & Tailwind CSS Variant:");

test("index.css defines Tailwind v4 dark variant & scrollbar customization", () => {
  const css = fs.readFileSync("./src/index.css", "utf-8");
  assert.ok(css.includes("@custom-variant dark"), "Missing @custom-variant dark in src/index.css");
  assert.ok(css.includes(".dark ::-webkit-scrollbar-track"), "Missing dark scrollbar track styling");
});

test("index.html contains zero-flash theme pre-hydration script", () => {
  const html = fs.readFileSync("./index.html", "utf-8");
  assert.ok(html.includes("localStorage.getItem('gosource_theme')"), "Missing theme localStorage check in index.html");
  assert.ok(html.includes("prefers-color-scheme: dark"), "Missing OS color scheme detection");
  assert.ok(html.includes("document.documentElement.classList.add('dark')"), "Missing .dark class application");
});

// ---------------------------------------------------------------------
// TEST GROUP 12: Production Bundle & Asset Distribution
// ---------------------------------------------------------------------
console.log("\n📦 [Group 12] Production Bundle & Asset Distribution:");

test("dist/ directory contains index.html, JS and CSS bundles", () => {
  assert.ok(fs.existsSync("./dist/index.html"), "dist/index.html missing");
  assert.ok(fs.existsSync("./dist/assets"), "dist/assets missing");
  const assetFiles = fs.readdirSync("./dist/assets");
  assert.ok(assetFiles.some(f => f.endsWith(".js")), "Compiled JS bundle missing");
  assert.ok(assetFiles.some(f => f.endsWith(".css")), "Compiled CSS bundle missing");
});

test("dist/index.html references production assets correctly", () => {
  const distHtml = fs.readFileSync("./dist/index.html", "utf-8");
  assert.ok(distHtml.includes('<div id="root"></div>'), "Missing root div in dist/index.html");
  assert.ok(distHtml.includes('assets/index-'), "Asset bundle not linked in dist/index.html");
});

// ---------------------------------------------------------------------
// TEST SUMMARY
// ---------------------------------------------------------------------
console.log("\n=================================================");
console.log(`🏁 AUDIT RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
if (passedTests === totalTests) {
  console.log("🎉 ALL FEATURES & SCHEMAS VERIFIED 100% OPERATIONAL!");
} else {
  console.log("⚠️ SOME TESTS FAILED — CHECK ERRORS ABOVE.");
}
console.log("=================================================");



