import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  GitBranch, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  RotateCcw
} from "lucide-react";
import { apiService } from "../services/apiClient";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState("otp"); // "otp", "signin", or "register"
  const [otpStep, setOtpStep] = useState(1); // 1 = enter email, 2 = enter code
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewCode, setPreviewCode] = useState(null);

  // Form State
  const [email, setEmail] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [githubUsername, setGithubUsername] = useState("");

  if (!isOpen) return null;

  // 1. Send OTP Verification Code to Email/Gmail
  const handleSendCode = async (e) => {
    e?.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await apiService.sendLoginCode(email);
      setSuccess(`6-digit login code sent to ${data.email || email}! Check your inbox.`);
      if (data.code) {
        setPreviewCode(data.code);
      }
      setOtpStep(2);
    } catch (err) {
      setError(err.message || "Failed to send login code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Code & Complete Login
  const handleVerifyCode = async (e) => {
    e?.preventDefault();
    if (!loginCode || loginCode.trim().length < 6) {
      setError("Please enter the full 6-digit verification code.");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await apiService.verifyLoginCode({ email, code: loginCode });
      const userDisplay = data.user?.display_name || data.user?.username || email;
      setSuccess(`Verification successful! Welcome, ${userDisplay}.`);
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await apiService.login({ email, password });
      setSuccess("Welcome back, " + (data.user?.display_name || data.user?.username || "Contributor") + "!");
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.register({
        username,
        email,
        password,
        skills: ["Python", "FastAPI", "React"],
        github_username: githubUsername
      });
      setSuccess("Account created successfully! Welcome to GoSource.");
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message || "Registration failed. Username or email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Clean GitHub OAuth Login
  const handleGithubOAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const targetUser = githubUsername || "contributor";
      const data = await apiService.loginWithGitHub(targetUser);
      setSuccess(`Authenticated as @${data.user.username} via GitHub!`);
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 700);
    } catch (err) {
      setError("GitHub sign-in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#273449] rounded-3xl shadow-2xl overflow-hidden relative animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Background Gradient */}
        <div className="relative p-6 pb-4 border-b border-slate-100 dark:border-[#273449] bg-gradient-to-r from-blue-50/80 via-white to-violet-50/80 dark:from-[#111827] dark:via-[#0F172A] dark:to-[#1E293B]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:rotate-90 hover:scale-110 transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-sm animate-pulse-glow">
              <div className="w-full h-full bg-white dark:bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-[#60A5FA]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
                {tab === "register" ? "Create Contributor Account" : "Sign In to GoSource"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Track your bookmarks, skills, and open-source contributions
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 mt-4 rounded-xl bg-slate-100/90 dark:bg-[#1E293B] border border-slate-200 dark:border-[#273449]">
            <button
              type="button"
              onClick={() => { setTab("otp"); setError(null); setSuccess(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                tab === "otp"
                  ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-[#60A5FA] shadow-xs"
                  : "text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Email Code (OTP)
            </button>
            <button
              type="button"
              onClick={() => { setTab("signin"); setError(null); setSuccess(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                tab === "signin"
                  ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-[#60A5FA] shadow-xs"
                  : "text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => { setTab("register"); setError(null); setSuccess(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                tab === "register"
                  ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-[#60A5FA] shadow-xs"
                  : "text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Clean GitHub Continue Button (No proprietor name) */}
          <button
            type="button"
            onClick={handleGithubOAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-[#1E293B] dark:hover:bg-[#273449] border border-slate-700 text-white text-xs font-semibold shadow-xs btn-animated btn-shimmer transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-[#273449] w-full" />
            <span className="bg-white dark:bg-[#0F172A] px-3 text-[11px] font-medium text-slate-400 dark:text-[#64748B] uppercase tracking-wider shrink-0">
              or with email
            </span>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{success}</span>
              </div>
              {previewCode && (
                <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
                  <span>Demo Verification Code: <strong className="font-mono text-sm tracking-wider">{previewCode}</strong></span>
                  <button 
                    type="button" 
                    onClick={() => setLoginCode(previewCode)}
                    className="px-2 py-0.5 text-[11px] bg-blue-600 text-white rounded font-medium hover:bg-blue-500"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: EMAIL VERIFICATION CODE (OTP) */}
          {tab === "otp" && (
            <div className="space-y-3.5">
              {otpStep === 1 ? (
                <form onSubmit={handleSendCode} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                      Email Address or Gmail
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-900/20 btn-animated btn-shimmer transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Login Code</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                        Enter 6-Digit Login Code
                      </label>
                      <button
                        type="button"
                        onClick={() => { setOtpStep(1); setError(null); }}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Change Email
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        placeholder="123456"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-center font-mono text-base tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Sent to: <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || loginCode.length < 6}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/20 btn-animated btn-shimmer transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center pt-1">
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={loading}
                      className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Didn't receive code? Resend</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: PASSWORD SIGN IN */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-900/20 btn-animated btn-shimmer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                  Contributor Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. alexdev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                    GitHub Handle
                  </label>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </div>
                <div className="relative">
                  <GitBranch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. alexdev"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-900/20 btn-animated btn-shimmer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Contributor Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
