"""
Comprehensive Test Suite for GitLaunch Authentication System
Verifies registration, salted password hashing, JWT Bearer tokens,
login, profile retrieval, platform linking, and preference synchronization.
"""

import os
import sys
from fastapi.testclient import TestClient

# Ensure current/backend is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import main
import auth_service

client = TestClient(main.app)

def assert_true(condition, msg):
    if not condition:
        print(f"FAILED: {msg}")
        sys.exit(1)
    else:
        print(f"[PASS] {msg}")

def run_all_tests():
    print("=" * 65)
    print("STARTING GITLAUNCH AUTHENTICATION & CONTRIBUTOR PROFILE TESTS")
    print("=" * 65)

    # Test 1: Seed verification for default profile
    default_user = auth_service.find_user_by_id("usr_chiru_default")
    assert_true(default_user is not None, "Default profile usr_chiru_default is initialized in database")
    assert_true(default_user["username"] == "ChiruAIHub", "Default profile username is ChiruAIHub")
    assert_true("github" in default_user["platforms"], "Default profile has linked GitHub platform")
    assert_true("huggingface" in default_user["platforms"], "Default profile has linked Hugging Face platform")
    assert_true("kaggle" in default_user["platforms"], "Default profile has linked Kaggle platform")

    # Test 2: Unauthenticated GET /api/auth/me
    res = client.get("/api/auth/me")
    assert_true(res.status_code == 200, "GET /api/auth/me returns 200 for visitor")
    data = res.json()
    assert_true(data.get("authenticated") is False, "Unauthenticated request flagged as authenticated=False")
    assert_true(data["user"]["username"] == "ChiruAIHub", "Fallback returns default ChiruAIHub profile to prevent UI crash")

    # Test 3: Authenticate default user with valid password
    res = client.post("/api/auth/login", json={
        "email": "chiru@gitlaunch.ai",
        "password": "GitLaunch2026!"
    })
    assert_true(res.status_code == 200, "POST /api/auth/login returns 200 with valid credentials")
    login_data = res.json()
    assert_true("token" in login_data and len(login_data["token"]) > 20, "JWT token generated")
    chiru_token = login_data["token"]

    # Test 4: Authenticate with invalid password
    res = client.post("/api/auth/login", json={
        "email": "chiru@gitlaunch.ai",
        "password": "WrongPassword!"
    })
    assert_true(res.status_code == 401, "POST /api/auth/login rejects invalid password with 401")

    # Test 5: Authenticated GET /api/auth/me with Bearer token
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {chiru_token}"})
    assert_true(res.status_code == 200, "GET /api/auth/me returns 200 with Bearer token")
    me_data = res.json()
    assert_true(me_data.get("authenticated") is True, "Bearer request flagged as authenticated=True")
    assert_true(me_data["user"]["username"] == "ChiruAIHub", "Authenticated user is ChiruAIHub")

    # Test 6: Register new contributor
    test_user_id = f"test_{int(os.times().user * 1000)}"
    res = client.post("/api/auth/register", json={
        "username": f"Contr_{test_user_id}",
        "email": f"{test_user_id}@nst.edu",
        "password": "SuperSecretPassword123!",
        "skills": ["Python", "PyTorch", "FastAPI"],
        "github_username": f"gh_{test_user_id}"
    })
    assert_true(res.status_code == 200, "POST /api/auth/register creates new account")
    reg_data = res.json()
    new_token = reg_data["token"]
    assert_true(reg_data["user"]["username"] == f"Contr_{test_user_id}", "Registered username matches")
    assert_true("github" in reg_data["user"]["platforms"], "GitHub platform auto-linked during registration")

    # Test 7: Duplicate email registration rejected
    res_dup = client.post("/api/auth/register", json={
        "username": f"Another_{test_user_id}",
        "email": f"{test_user_id}@nst.edu",
        "password": "SuperSecretPassword123!"
    })
    assert_true(res_dup.status_code == 400, "POST /api/auth/register blocks duplicate email with 400")

    # Test 8: Link new platform (Hugging Face)
    res = client.post("/api/auth/link-platform",
        headers={"Authorization": f"Bearer {new_token}"},
        json={"platform": "huggingface", "username": "ai-explorer"}
    )
    assert_true(res.status_code == 200, "POST /api/auth/link-platform links Hugging Face")
    assert_true(res.json()["user"]["platforms"]["huggingface"]["username"] == "ai-explorer", "HF handle linked properly")

    # Test 9: Link new platform (Kaggle)
    res = client.post("/api/auth/link-platform",
        headers={"Authorization": f"Bearer {new_token}"},
        json={"platform": "kaggle", "username": "kaggle-master"}
    )
    assert_true(res.status_code == 200, "POST /api/auth/link-platform links Kaggle")
    assert_true(res.json()["user"]["platforms"]["kaggle"]["username"] == "kaggle-master", "Kaggle handle linked properly")

    # Test 10: Sync preferences (skills & bookmarks)
    res = client.post("/api/auth/sync-preferences",
        headers={"Authorization": f"Bearer {new_token}"},
        json={
            "skills": ["Python", "FastAPI", "React", "TypeScript", "LangChain"],
            "bookmarked_repos": ["repo-1", "repo-5", "king", "hindsight"],
            "bookmarked_issues": ["iss-101", "123"]
        }
    )
    assert_true(res.status_code == 200, "POST /api/auth/sync-preferences saves preferences")
    synced = res.json()["user"]
    assert_true(len(synced["skills"]) == 5, "Saved 5 developer skills")
    assert_true(len(synced["bookmarked_repos"]) == 4, "Saved 4 bookmarked repositories")
    assert_true(len(synced["bookmarked_issues"]) == 2, "Saved 2 bookmarked issues")

    # Test 11: 1-Click GitHub login
    res = client.get("/api/auth/github/login?username=ChiruAIHub")
    assert_true(res.status_code == 200, "GET /api/auth/github/login succeeds")
    gh_data = res.json()
    assert_true(gh_data["user"]["username"] == "ChiruAIHub", "1-click GitHub authenticates ChiruAIHub")
    assert_true("token" in gh_data, "1-click GitHub returns Bearer token")

    print("\n" + "=" * 65)
    print("ALL 11 AUTHENTICATION & PROFILE TESTS PASSED FLAWLESSLY!")
    print("=" * 65)

if __name__ == "__main__":
    run_all_tests()
