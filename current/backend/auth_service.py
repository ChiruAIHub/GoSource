"""
GitLaunch Unified Authentication & Contributor Profile Service
Handles secure registration, PBKDF2 password hashing, JWT/Bearer token issuance,
platform linking (GitHub, Hugging Face, Kaggle), and preference persistence.
"""

import os
import json
import time
import base64
import hmac
import hashlib
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any, List

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Auto-load .env configuration
def _load_env_file():
    for candidate in [os.path.join(BASE_DIR, ".env"), os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")]:
        if os.path.exists(candidate):
            try:
                with open(candidate, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            os.environ[k.strip()] = v.strip().strip('"').strip("'")
            except Exception:
                pass

_load_env_file()

DATA_DIR = os.path.join(BASE_DIR, "data")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
SECRET_KEY = os.environ.get("GOSOURCE_JWT_SECRET", "gosource_auth_2026_super_secret_key")

OTP_CODES: Dict[str, Dict[str, Any]] = {}

def _init_users_file():
    """Seeds default contributor profile if DB does not exist."""
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(USERS_FILE):
        default_user = {
            "id": "usr_default_contributor",
            "username": "Contributor",
            "display_name": "Open-Source Contributor",
            "email": "contributor@gosource.dev",
            "password_hash": hash_password("GoSource2026!"),
            "avatar_initials": "OS",
            "tier": "Tier 1 Contributor",
            "bio": "Open-Source Contributor & AI Explorer across GitHub, Hugging Face, and Kaggle",
            "platforms": {
                "github": {
                    "username": "contributor",
                    "profile_url": "https://github.com",
                    "top_repos": ["king", "-Nexus-AI", "hindsight", "rocketride-server"],
                    "verified": True
                },
                "huggingface": {
                    "username": "contributor",
                    "profile_url": "https://huggingface.co",
                    "verified": True
                },
                "kaggle": {
                    "username": "contributor",
                    "profile_url": "https://www.kaggle.com",
                    "verified": True,
                    "notebooks_count": 3
                }
            },
            "skills": ["Python", "React", "TypeScript", "FastAPI", "PyTorch"],
            "bookmarked_repos": ["repo-1", "repo-5"],
            "bookmarked_issues": ["iss-101"],
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump({"users": [default_user]}, f, indent=2)

def hash_password(password: str) -> str:
    """NIST standard salted PBKDF2-SHA256 password hashing."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"{salt}:{key}"

def verify_password(password: str, hashed: str) -> bool:
    """Verifies plaintext password against salted PBKDF2 hash."""
    try:
        if not hashed or ":" not in hashed:
            return False
        salt, key_hex = hashed.split(":", 1)
        computed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
        return hmac.compare_digest(key_hex, computed)
    except Exception:
        return False

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('ascii')

def _base64url_decode(s: str) -> bytes:
    padding = 4 - (len(s) % 4)
    if padding and padding < 4:
        s += '=' * padding
    return base64.urlsafe_b64decode(s.encode('ascii'))

def create_access_token(user_id: str, email: str, username: str, expires_delta_hours: int = 72) -> str:
    """Generates standard HMAC-SHA256 Bearer JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user_id,
        "email": email,
        "username": username,
        "iat": int(time.time()),
        "exp": int(time.time()) + (expires_delta_hours * 3600)
    }
    encoded_header = _base64url_encode(json.dumps(header).encode('utf-8'))
    encoded_payload = _base64url_encode(json.dumps(payload).encode('utf-8'))
    message = f"{encoded_header}.{encoded_payload}".encode('utf-8')
    signature = hmac.new(SECRET_KEY.encode('utf-8'), message, hashlib.sha256).digest()
    encoded_sig = _base64url_encode(signature)
    return f"{encoded_header}.{encoded_payload}.{encoded_sig}"

def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Validates token signature and checks expiry."""
    try:
        parts = token.strip().split(".")
        if len(parts) != 3:
            return None
        encoded_header, encoded_payload, encoded_sig = parts
        message = f"{encoded_header}.{encoded_payload}".encode('utf-8')
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), message, hashlib.sha256).digest()
        provided_sig = _base64url_decode(encoded_sig)
        if not hmac.compare_digest(expected_sig, provided_sig):
            return None
        payload = json.loads(_base64url_decode(encoded_payload).decode('utf-8'))
        if payload.get("exp", 0) < int(time.time()):
            return None
        return payload
    except Exception:
        return None

def load_users() -> List[Dict[str, Any]]:
    _init_users_file()
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("users", [])
    except Exception:
        return []

def save_users(users: List[Dict[str, Any]]):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump({"users": users}, f, indent=2)

def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    clean = email.strip().lower()
    for u in load_users():
        if u.get("email", "").strip().lower() == clean:
            return u
    return None

def find_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    clean = username.strip().lower()
    for u in load_users():
        if u.get("username", "").strip().lower() == clean:
            return u
    return None

def find_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    for u in load_users():
        if u.get("id") == user_id:
            return u
    return None

def register_user(username: str, email: str, password: str, skills: Optional[List[str]] = None, github_username: Optional[str] = None) -> Dict[str, Any]:
    users = load_users()
    clean_email = email.strip().lower()
    clean_username = username.strip()

    if find_user_by_email(clean_email):
        raise ValueError(f"An account with email '{clean_email}' already exists. Please sign in.")
    if find_user_by_username(clean_username):
        raise ValueError(f"Username '{clean_username}' is already taken.")

    initials = clean_username[:2].upper()
    user_id = f"usr_{int(time.time())}_{secrets.token_hex(4)}"

    platforms = {}
    if github_username:
        clean_gh = github_username.strip().lstrip("@")
        platforms["github"] = {
            "username": clean_gh,
            "profile_url": f"https://github.com/{clean_gh}",
            "verified": True
        }

    new_user = {
        "id": user_id,
        "username": clean_username,
        "display_name": clean_username,
        "email": clean_email,
        "password_hash": hash_password(password),
        "avatar_initials": initials,
        "tier": "Tier 1 Contributor",
        "bio": "Open-Source AI Enthusiast & Contributor",
        "platforms": platforms,
        "skills": skills or ["Python", "Git", "Markdown"],
        "bookmarked_repos": [],
        "bookmarked_issues": [],
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    users.append(new_user)
    save_users(users)
    token = create_access_token(user_id, clean_email, clean_username)
    return {"token": token, "user": sanitize_user(new_user)}

def authenticate_user(email: str, password: str) -> Dict[str, Any]:
    clean_email = email.strip().lower()
    user = find_user_by_email(clean_email)
    if not user:
        # Also allow logging in with username
        user = find_user_by_username(email.strip())

    if not user or not verify_password(password, user.get("password_hash", "")):
        raise ValueError("Invalid email or password.")

    token = create_access_token(user["id"], user.get("email", ""), user.get("username", ""))
    return {"token": token, "user": sanitize_user(user)}

def link_platform(user_id: str, platform: str, username: str) -> Dict[str, Any]:
    users = load_users()
    clean_plat = platform.strip().lower()
    clean_user = username.strip().lstrip("@")

    target_user = None
    for u in users:
        if u["id"] == user_id:
            target_user = u
            break

    if not target_user:
        raise ValueError("User not found.")

    target_user.setdefault("platforms", {})
    if clean_plat == "github":
        target_user["platforms"]["github"] = {
            "username": clean_user,
            "profile_url": f"https://github.com/{clean_user}",
            "verified": True
        }
    elif clean_plat in ("huggingface", "hf"):
        target_user["platforms"]["huggingface"] = {
            "username": clean_user,
            "profile_url": f"https://huggingface.co/{clean_user}",
            "verified": True
        }
    elif clean_plat == "kaggle":
        target_user["platforms"]["kaggle"] = {
            "username": clean_user,
            "profile_url": f"https://www.kaggle.com/{clean_user}",
            "verified": True
        }
    else:
        target_user["platforms"][clean_plat] = {
            "username": clean_user,
            "verified": True
        }

    save_users(users)
    return sanitize_user(target_user)

def sync_preferences(user_id: str, skills: Optional[List[str]] = None, bookmarked_repos: Optional[List[str]] = None, bookmarked_issues: Optional[List[str]] = None) -> Dict[str, Any]:
    users = load_users()
    target_user = None
    for u in users:
        if u["id"] == user_id:
            target_user = u
            break

    if not target_user:
        raise ValueError("User not found.")

    if skills is not None:
        target_user["skills"] = list(dict.fromkeys(skills))
    if bookmarked_repos is not None:
        target_user["bookmarked_repos"] = list(dict.fromkeys(bookmarked_repos))
    if bookmarked_issues is not None:
        target_user["bookmarked_issues"] = list(dict.fromkeys(bookmarked_issues))

    save_users(users)
    return sanitize_user(target_user)

def sanitize_user(user: Dict[str, Any]) -> Dict[str, Any]:
    """Strips password hash and returns safe user dictionary."""
    safe = dict(user)
    safe.pop("password_hash", None)
    return safe

def dispatch_email_otp(to_email: str, code: str) -> Dict[str, Any]:
    """
    Dispatches a real email containing the 6-digit verification code
    using configured SMTP credentials (e.g. Gmail SMTP or Brevo/SendGrid).
    """
    _load_env_file()
    smtp_email = os.environ.get("SMTP_EMAIL", "").strip()
    smtp_password = os.environ.get("SMTP_PASSWORD", "").strip()
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com").strip()
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))

    if not smtp_email or not smtp_password:
        return {
            "delivered": False,
            "reason": "SMTP email credentials not set in .env (SMTP_EMAIL & SMTP_PASSWORD required for direct inbox delivery)."
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Your GoSource Login Verification Code: {code}"
        msg["From"] = f"GoSource Platform <{smtp_email}>"
        msg["To"] = to_email

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #0b1120; color: #ffffff; padding: 24px;">
          <div style="max-width: 480px; margin: 0 auto; background: #0f172a; border: 1px solid #273449; border-radius: 16px; padding: 32px;">
            <h2 style="color: #38bdf8; margin-top: 0;">GoSource Verification</h2>
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.5;">
              Use the 6-digit verification code below to complete your login:
            </p>
            <div style="background: #1e293b; padding: 16px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; margin: 20px 0; font-family: monospace;">
              {code}
            </div>
            <p style="color: #94a3b8; font-size: 13px;">
              This code expires in 10 minutes. If you did not request this, please ignore this email.
            </p>
          </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(smtp_host, smtp_port, timeout=12) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, [to_email], msg.as_string())

        print(f"[GOSOURCE AUTH] Real email dispatched successfully to {to_email} via {smtp_host}!", flush=True)
        return {"delivered": True, "reason": f"Dispatched via {smtp_host}"}
    except Exception as e:
        print(f"[GOSOURCE AUTH] SMTP dispatch warning for {to_email}: {str(e)}", flush=True)
        return {"delivered": False, "reason": str(e)}

def send_login_code(email: str) -> Dict[str, Any]:
    """
    Generates a 6-digit numeric login verification code for the email/Gmail.
    Stores the code with a 10-minute validity, attempts real SMTP inbox dispatch,
    and returns delivery status.
    """
    clean_email = email.strip().lower()
    if not clean_email or "@" not in clean_email:
        raise ValueError("Please enter a valid email address.")
    
    code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = time.time() + 600
    OTP_CODES[clean_email] = {
        "code": code,
        "expires_at": expires_at,
        "created_at": time.time()
    }
    
    # Save to disk for inspection and persistence
    try:
        code_file = os.path.join(DATA_DIR, "last_sent_code.json")
        with open(code_file, "w", encoding="utf-8") as f:
            json.dump({
                "email": clean_email,
                "code": code,
                "expires_at": expires_at,
                "sent_time": time.strftime("%Y-%m-%d %H:%M:%S")
            }, f, indent=2)
    except Exception:
        pass
        
    print(f"\n[GOSOURCE AUTH] LOGIN CODE GENERATED FOR {clean_email}: {code} (Valid for 10 minutes)\n", flush=True)
    
    # Attempt real SMTP email transmission to inbox
    dispatch_result = dispatch_email_otp(clean_email, code)
    
    if dispatch_result["delivered"]:
        message = f"Verification code sent to {clean_email}! Please check your inbox and spam folder."
    else:
        message = f"Verification code generated for {clean_email}. ({dispatch_result['reason']})"

    return {
        "success": True,
        "email": clean_email,
        "delivered_to_inbox": dispatch_result["delivered"],
        "message": message,
        "code": code
    }

def verify_login_code(email: str, code: str) -> Dict[str, Any]:
    """
    Validates the 6-digit verification code sent to Gmail/email and logs in or creates the account.
    """
    clean_email = email.strip().lower()
    clean_code = str(code).strip()
    
    entry = OTP_CODES.get(clean_email)
    if not entry:
        try:
            code_file = os.path.join(DATA_DIR, "last_sent_code.json")
            if os.path.exists(code_file):
                with open(code_file, "r", encoding="utf-8") as f:
                    saved = json.load(f)
                    if saved.get("email") == clean_email and saved.get("expires_at", 0) > time.time():
                        entry = saved
        except Exception:
            pass

    if not entry:
        raise ValueError(f"No active verification code found for {clean_email}. Please click 'Send Login Code' first.")
        
    if time.time() > entry.get("expires_at", 0):
        OTP_CODES.pop(clean_email, None)
        raise ValueError("Verification code has expired. Please request a new code.")
        
    if str(entry.get("code")).strip() != clean_code:
        raise ValueError("Incorrect verification code. Please check your email or enter the 6-digit code.")

    OTP_CODES.pop(clean_email, None)
    
    # Retrieve user or auto-provision
    user = find_user_by_email(clean_email)
    if not user:
        uname = clean_email.split("@")[0].replace(".", "_")
        users = load_users()
        user_id = f"usr_{int(time.time())}_{secrets.token_hex(4)}"
        new_user = {
            "id": user_id,
            "username": uname,
            "display_name": uname,
            "email": clean_email,
            "password_hash": hash_password(secrets.token_hex(16)),
            "avatar_initials": uname[:2].upper(),
            "tier": "Tier 1 Contributor",
            "bio": f"Open-Source Contributor ({clean_email})",
            "platforms": {
                "github": {
                    "username": uname,
                    "profile_url": f"https://github.com/{uname}",
                    "verified": True
                }
            },
            "skills": ["Python", "FastAPI", "React"],
            "bookmarked_repos": [],
            "bookmarked_issues": [],
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        users.append(new_user)
        save_users(users)
        token = create_access_token(user_id, clean_email, uname)
        return {
            "token": token,
            "user": sanitize_user(new_user)
        }
    else:
        token = create_access_token(user["id"], user["email"], user["username"])
        return {
            "token": token,
            "user": sanitize_user(user)
        }

