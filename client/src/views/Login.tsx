import { useState, useEffect } from "react";
import { LockKeyhole, UserRound, ShieldCheck, Loader2, KeyRound, X, UserRoundCog, CheckCircle2 } from "lucide-react";
import AppLayout from "../components/AppLayout";
import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign Up State
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [signUpData, setSignUpData] = useState({
    username: "",
    password: "",
    full_name: "",
    role: "student",
    team_id: "",
  });
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showSignUpModal) {
      fetch("/api/team/teams/")
        .then(r => r.json())
        .then(setTeams)
        .catch(() => {});
    }
  }, [showSignUpModal]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");
    setIsSubmitting(true);

    if (!signUpData.username || !signUpData.password || !signUpData.role) {
      setSignUpError("Username, password and role are required.");
      setIsSubmitting(false);
      return;
    }

    if (signUpData.role === "student" && !signUpData.team_id) {
      setSignUpError("Please select a team.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/users/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...signUpData,
          team_id: signUpData.team_id ? Number(signUpData.team_id) : undefined,
          auto_generate_password: false
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSignUpError(data.error || "Failed to create account.");
      } else {
        setSignUpSuccess(true);
      }
    } catch {
      setSignUpError("Unable to connect to the server.");
    }
    setIsSubmitting(false);
  };

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [pendingUser, setPendingUser] = useState<{
    id: number;
    role: string;
    username: string;
    full_name: string;
    team_id: number | null;
    team_name: string | null;
  } | null>(null);

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.user.must_change_password) {
        setPendingUser(data.user);
        setShowChangePassword(true);
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("fullName", data.user.full_name || "");
      localStorage.setItem("teamName", data.user.team_name || "");
      window.location.href = "/dashboard/";
    } catch {
      setError("Unable to connect to the server.");
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch("/api/users/change-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to change password.");
        setChangingPassword(false);
        return;
      }

      if (pendingUser) {
        localStorage.setItem("user", JSON.stringify(pendingUser));
        localStorage.setItem("role", pendingUser.role);
        localStorage.setItem("username", pendingUser.username);
        localStorage.setItem("fullName", pendingUser.full_name || "");
        localStorage.setItem("teamName", pendingUser.team_name || "");
      }
      window.location.href = "/dashboard/";
    } catch {
      setError("Unable to connect to the server.");
      setChangingPassword(false);
    }
  };

  if (showChangePassword) {
    return (
      <AppLayout>
        <main className="flex w-full items-center justify-center">
          <section className="w-full max-w-lg">
            <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center gap-3 text-[#FF2D6F]">
                <KeyRound className="h-6 w-6" />
                <p className="text-sm uppercase tracking-[0.25em]">
                  Password Change Required
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-white">
                Set your new password
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Welcome, {pendingUser?.full_name || pendingUser?.username}! For
                security, please create a new password before continuing.
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassword();
                }}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF2D6F] px-5 py-3 font-medium text-white transition hover:scale-[1.01] disabled:opacity-60"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Set Password & Continue"
                  )}
                </button>
              </form>
            </div>
          </section>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="flex w-full items-center justify-center">
        {/* Sign Up Modal */}
        {showSignUpModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#0A0A0A] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShowSignUpModal(false)}
                className="absolute -top-4 -right-4 rounded-full bg-[#FF2D6F] p-2 text-white shadow-lg hover:bg-[#FF4D85] transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-2xl bg-[#FF2D6F]/10 p-3">
                  <UserRoundCog className="h-6 w-6 text-[#FF2D6F]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Create Account</h3>
                  <p className="text-zinc-400 text-sm">Join the ITAP Hackathon platform</p>
                </div>
              </div>

              {signUpSuccess ? (
                <div className="text-center space-y-6 py-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Account Created!</h4>
                    <p className="text-zinc-400">Your account has been successfully created. You can now log in with your credentials.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSignUpSuccess(false);
                      setShowSignUpModal(false);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#FF2D6F] text-white font-bold hover:bg-[#FF4D85] transition-all"
                  >
                    Go to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  {signUpError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                      {signUpError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF2D6F]/50 transition-all"
                      value={signUpData.full_name}
                      onChange={e => setSignUpData({...signUpData, full_name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="Choose a username"
                      className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF2D6F]/50 transition-all"
                      value={signUpData.username}
                      onChange={e => setSignUpData({...signUpData, username: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF2D6F]/50 transition-all"
                      value={signUpData.password}
                      onChange={e => setSignUpData({...signUpData, password: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Role *</label>
                      <select
                        className="w-full rounded-2xl bg-[#151515] border border-white/10 p-4 text-white focus:outline-none focus:border-[#FF2D6F]/50 transition-all appearance-none"
                        value={signUpData.role}
                        onChange={e => setSignUpData({...signUpData, role: e.target.value as any})}
                      >
                        <option value="student">Student</option>
                        <option value="judge">Judge</option>
                      </select>
                    </div>

                    {signUpData.role === "student" && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Team *</label>
                        <select
                          className="w-full rounded-2xl bg-[#151515] border border-white/10 p-4 text-white focus:outline-none focus:border-[#FF2D6F]/50 transition-all appearance-none"
                          value={signUpData.team_id}
                          onChange={e => setSignUpData({...signUpData, team_id: e.target.value})}
                          required
                        >
                          <option value="">Select Team</option>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full py-4 rounded-2xl bg-[#FF2D6F] text-white font-bold hover:bg-[#FF4D85] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF2D6F]/20"
                  >
                    {isSubmitting ? "Creating Account..." : "Register Now"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
        <section className="grid w-full max-w-6xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <img
                src={diLogoUrl}
                alt="Disruptive Innovation"
                className="h-16 w-auto object-contain"
              />
              <img
                src={itapLogoUrl}
                alt="ITAP"
                className="h-12 w-auto object-contain"
              />
            </div>

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#FF2D6F]">
              Secure Access
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              Sign in to the Hackathon Platform
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
              Use your assigned credentials to access the platform. Your role
              will be determined by your account — admin, judge, or student.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#151515] p-4">
                <ShieldCheck className="mb-3 h-5 w-5 text-[#FF2D6F]" />
                <h2 className="font-semibold text-white">Admin</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Full access to all views and controls.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#151515] p-4">
                <LockKeyhole className="mb-3 h-5 w-5 text-[#FF2D6F]" />
                <h2 className="font-semibold text-white">Judge</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Access dashboard and judging workflow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#151515] p-4">
                <UserRound className="mb-3 h-5 w-5 text-[#FF2D6F]" />
                <h2 className="font-semibold text-white">Student</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Access dashboard and student workspace.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#FF2D6F]">
              Login
            </p>
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Use your assigned credentials to enter the platform.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF2D6F] px-5 py-3 font-medium text-white transition hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSignUpSuccess(false);
                  setSignUpError("");
                  setSignUpData({ username: "", password: "", full_name: "", role: "student", team_id: "" });
                  setShowSignUpModal(true);
                }}
                className="group w-full py-3 text-sm font-medium text-zinc-400 transition"
              >
                Don't have an account? <span className="text-[#FF2D6F] font-bold transition group-hover:text-[#FF4D85] group-hover:underline">Sign Up</span>
              </button>
            </form>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
