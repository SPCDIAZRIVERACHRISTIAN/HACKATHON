import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import Sidebar from "../components/Sidebar";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import {
  Users,
  Trophy,
  GraduationCap,
  UserRoundCog,
  ShieldCheck,
  Plus,
  Trash2,
  RefreshCw,
  X,
  ClipboardList,
  Loader2,
  KeyRound,
  Copy,
  Check,
  Wand2,
} from "lucide-react";

type User = {
  id: number;
  username: string;
  full_name: string;
  role: string;
  team_id: number | null;
  team_name: string | null;
  is_active: boolean;
  must_change_password: boolean;
};

type Team = {
  id: number;
  name: string;
  project_name: string;
  score: string;
  created_at: string;
  updated_at: string;
};

const roleIcon = (role: string) => {
  if (role === "admin") return <ShieldCheck className="h-4 w-4 text-purple-400" />;
  if (role === "judge") return <UserRoundCog className="h-4 w-4 text-amber-400" />;
  return <GraduationCap className="h-4 w-4 text-sky-400" />;
};

const roleBadgeClass = (role: string) => {
  if (role === "admin") return "bg-purple-500/20 text-purple-300";
  if (role === "judge") return "bg-amber-500/20 text-amber-300";
  return "bg-sky-500/20 text-sky-300";
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function AdminView() {
  const role =
    (localStorage.getItem("role") as "admin" | "judge" | "student") || "admin";

  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    full_name: "",
    role: "student" as "admin" | "judge" | "student",
    team_id: "",
    auto_generate: true,
  });

  const [newTeam, setNewTeam] = useState({
    name: "",
    project_name: "",
  });

  const [activeTab, setActiveTab] = useState<"users" | "teams">("users");

  // Password reset state
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetAutoGenerate, setResetAutoGenerate] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetGeneratedPassword, setResetGeneratedPassword] = useState("");

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/users/");
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    }
    setLoadingUsers(false);
  };

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const res = await fetch("/api/team/teams/");
      const data = await res.json();
      setTeams(data);
    } catch {
      setTeams([]);
    }
    setLoadingTeams(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const handleCreateUser = async () => {
    setCreateError("");
    setGeneratedPassword("");

    if (!newUser.username || !newUser.role) {
      setCreateError("Username and role are required.");
      return;
    }
    if (!newUser.auto_generate && !newUser.password) {
      setCreateError("Enter a password or enable auto-generate.");
      return;
    }
    if (newUser.role === "student" && !newUser.team_id) {
      setCreateError("Students must be assigned to a team.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/users/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.auto_generate ? undefined : newUser.password,
          auto_generate_password: newUser.auto_generate,
          full_name: newUser.full_name,
          role: newUser.role,
          team_id: newUser.team_id ? Number(newUser.team_id) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create user.");
        setCreating(false);
        return;
      }

      if (data.generated_password) {
        setGeneratedPassword(data.generated_password);
      } else {
        setShowCreateUser(false);
        setNewUser({ username: "", password: "", full_name: "", role: "student", team_id: "", auto_generate: true });
      }
      fetchUsers();
    } catch {
      setCreateError("Unable to connect to the server.");
    }
    setCreating(false);
  };

  const handleCreateTeam = async () => {
    setCreateError("");
    if (!newTeam.name) {
      setCreateError("Team name is required.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/team/teams/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create team.");
        setCreating(false);
        return;
      }
      setShowCreateTeam(false);
      setNewTeam({ name: "", project_name: "" });
      fetchTeams();
    } catch {
      setCreateError("Unable to connect to the server.");
    }
    setCreating(false);
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/users/${userId}/`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete user.");
        return;
      }
      fetchUsers();
    } catch {
      alert("Unable to connect to the server.");
    }
  };

  const handleDeleteTeam = async (teamId: number, teamName: string) => {
    if (!confirm(`Delete team "${teamName}"? This will also affect assigned students.`)) return;
    try {
      const res = await fetch(`/api/team/teams/${teamId}/`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete team.");
        return;
      }
      fetchTeams();
      fetchUsers();
    } catch {
      alert("Unable to connect to the server.");
    }
  };

  const handleResetPassword = async () => {
    if (!resetUserId) return;
    setResetError("");
    setResetGeneratedPassword("");

    if (!resetAutoGenerate && (!resetPassword || resetPassword.length < 8)) {
      setResetError("Password must be at least 8 characters.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`/api/users/${resetUserId}/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auto_generate: resetAutoGenerate,
          new_password: resetAutoGenerate ? undefined : resetPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Failed to reset password.");
        setResetLoading(false);
        return;
      }
      if (data.generated_password) {
        setResetGeneratedPassword(data.generated_password);
      } else {
        closeResetModal();
      }
      fetchUsers();
    } catch {
      setResetError("Unable to connect to the server.");
    }
    setResetLoading(false);
  };

  const openResetModal = (userId: number) => {
    setResetUserId(userId);
    setResetPassword("");
    setResetAutoGenerate(true);
    setResetError("");
    setResetGeneratedPassword("");
  };

  const closeResetModal = () => {
    setResetUserId(null);
    setResetPassword("");
    setResetAutoGenerate(true);
    setResetError("");
    setResetGeneratedPassword("");
  };

  const stats = useMemo(() => {
    const studentCount = users.filter((u) => u.role === "student").length;
    const judgeCount = users.filter((u) => u.role === "judge").length;
    const adminCount = users.filter((u) => u.role === "admin").length;
    return { studentCount, judgeCount, adminCount, teamCount: teams.length, totalUsers: users.length };
  }, [users, teams]);

  const resetUser = users.find((u) => u.id === resetUserId);

  return (
    <AppLayout>
      <Sidebar active="admin" role={role} />

      <main className="flex-1 space-y-6">
        <PageHero
          title="Admin Control Panel"
          subtitle="Manage users, teams, and oversee the hackathon platform. Full access to all administrative functions."
          active="admin"
          role={role}
        />

        {/* Stats */}
        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Total Users"
              value={String(stats.totalUsers)}
              detail={`${stats.adminCount} admin, ${stats.judgeCount} judges, ${stats.studentCount} students`}
            />
            <StatCard
              icon={<Trophy className="h-5 w-5" />}
              label="Teams"
              value={String(stats.teamCount)}
              detail="Registered teams"
            />
            <StatCard
              icon={<UserRoundCog className="h-5 w-5" />}
              label="Judges"
              value={String(stats.judgeCount)}
              detail="Active judge accounts"
            />
            <StatCard
              icon={<GraduationCap className="h-5 w-5" />}
              label="Students"
              value={String(stats.studentCount)}
              detail="Registered participants"
            />
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
              activeTab === "users"
                ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
                : "bg-[#1A1A1A] text-zinc-200 hover:bg-white/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </span>
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
              activeTab === "teams"
                ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
                : "bg-[#1A1A1A] text-zinc-200 hover:bg-white/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Team Management
            </span>
          </button>
        </div>

        {/* User Management */}
        {activeTab === "users" && (
          <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#FF2D6F]" />
                <h3 className="text-2xl font-semibold">User Management</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchUsers}
                  className="rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setShowCreateUser(true);
                    setCreateError("");
                    setGeneratedPassword("");
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02]"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
              </div>
            </div>

            {/* Create User Form */}
            {showCreateUser && (
              <div className="mb-5 rounded-2xl border border-[#FF2D6F]/30 bg-[#1A1A1A] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Create New User</h4>
                  <button
                    onClick={() => {
                      setShowCreateUser(false);
                      setGeneratedPassword("");
                      setCreateError("");
                    }}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {generatedPassword ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <p className="mb-1 text-sm font-medium text-emerald-300">
                        User created! Here is the generated password:
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="rounded-lg bg-black/40 px-3 py-2 text-lg font-mono text-white">
                          {generatedPassword}
                        </code>
                        <CopyButton text={generatedPassword} />
                      </div>
                      <p className="mt-3 text-xs text-zinc-400">
                        Share this password with the user. They will be asked to change it on first login.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowCreateUser(false);
                        setGeneratedPassword("");
                        setNewUser({ username: "", password: "", full_name: "", role: "student", team_id: "", auto_generate: true });
                      }}
                      className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-sm text-zinc-400">Username</label>
                        <input
                          type="text"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-zinc-400">Full Name</label>
                        <input
                          type="text"
                          value={newUser.full_name}
                          onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-zinc-400">Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "judge" | "student" })}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]"
                        >
                          <option value="student">Student</option>
                          <option value="judge">Judge</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      {newUser.role === "student" && (
                        <div>
                          <label className="mb-1 block text-sm text-zinc-400">Team</label>
                          <select
                            value={newUser.team_id}
                            onChange={(e) => setNewUser({ ...newUser, team_id: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]"
                          >
                            <option value="">Select a team</option>
                            {teams.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Password Section */}
                    <div className="mt-4 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                          <input
                            type="checkbox"
                            checked={newUser.auto_generate}
                            onChange={(e) => setNewUser({ ...newUser, auto_generate: e.target.checked })}
                            className="accent-[#FF2D6F]"
                          />
                          <Wand2 className="h-3.5 w-3.5" />
                          Auto-generate
                        </label>
                      </div>
                      {!newUser.auto_generate && (
                        <input
                          type="text"
                          placeholder="Enter a password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]"
                        />
                      )}
                      {newUser.auto_generate && (
                        <p className="mt-2 text-xs text-zinc-500">
                          A secure password will be generated and shown after creation.
                        </p>
                      )}
                    </div>

                    {createError && (
                      <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                        {createError}
                      </div>
                    )}
                    <button
                      onClick={handleCreateUser}
                      disabled={creating}
                      className="mt-4 flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02] disabled:opacity-60"
                    >
                      {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      {creating ? "Creating..." : "Create User"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Users Table */}
            {loadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#FF2D6F]" />
              </div>
            ) : users.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Team</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 transition hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{u.full_name || u.username}</div>
                          {u.full_name && <div className="text-xs text-zinc-500">@{u.username}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${roleBadgeClass(u.role)}`}>
                            {roleIcon(u.role)}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">
                          {u.team_name || <span className="text-zinc-600">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {u.must_change_password ? (
                            <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300">
                              Pending password change
                            </span>
                          ) : (
                            <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openResetModal(u.id)}
                              className="rounded-lg p-2 text-zinc-500 transition hover:bg-amber-500/10 hover:text-amber-400"
                              title="Reset password"
                            >
                              <KeyRound className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.username)}
                              className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Password Reset Modal */}
        {resetUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0A0A0A] p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-[#FF2D6F]" />
                  <h3 className="text-xl font-semibold text-white">Reset Password</h3>
                </div>
                <button onClick={closeResetModal} className="text-zinc-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-5 text-sm text-zinc-300">
                Reset password for <span className="font-medium text-white">{resetUser?.full_name || resetUser?.username}</span>
                {resetUser?.full_name && <span className="text-zinc-500"> (@{resetUser.username})</span>}
              </p>

              {resetGeneratedPassword ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="mb-1 text-sm font-medium text-emerald-300">
                      Password has been reset. New password:
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="rounded-lg bg-black/40 px-3 py-2 text-lg font-mono text-white">
                        {resetGeneratedPassword}
                      </code>
                      <CopyButton text={resetGeneratedPassword} />
                    </div>
                    <p className="mt-3 text-xs text-zinc-400">
                      The user will be asked to change this password on their next login.
                    </p>
                  </div>
                  <button
                    onClick={closeResetModal}
                    className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3">
                    <label className="text-sm text-zinc-300">Auto-generate password</label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={resetAutoGenerate}
                        onChange={(e) => setResetAutoGenerate(e.target.checked)}
                        className="accent-[#FF2D6F]"
                      />
                      <Wand2 className="h-3.5 w-3.5" />
                    </label>
                  </div>

                  {!resetAutoGenerate && (
                    <div className="mb-4">
                      <label className="mb-1 block text-sm text-zinc-400">New Password</label>
                      <input
                        type="text"
                        placeholder="At least 8 characters"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]"
                      />
                    </div>
                  )}

                  {resetError && (
                    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                      {resetError}
                    </div>
                  )}

                  <button
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF2D6F] px-5 py-2.5 text-sm font-medium text-white transition hover:scale-[1.02] disabled:opacity-60"
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Team Management */}
        {activeTab === "teams" && (
          <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-[#FF2D6F]" />
                <h3 className="text-2xl font-semibold">Team Management</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchTeams}
                  className="rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setShowCreateTeam(true); setCreateError(""); }}
                  className="flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02]"
                >
                  <Plus className="h-4 w-4" />
                  Add Team
                </button>
              </div>
            </div>

            {/* Create Team Form */}
            {showCreateTeam && (
              <div className="mb-5 rounded-2xl border border-[#FF2D6F]/30 bg-[#1A1A1A] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Create New Team</h4>
                  <button onClick={() => setShowCreateTeam(false)} className="text-zinc-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-zinc-400">Team Name</label>
                    <input
                      type="text"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-zinc-400">Project Name</label>
                    <input
                      type="text"
                      value={newTeam.project_name}
                      onChange={(e) => setNewTeam({ ...newTeam, project_name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]"
                    />
                  </div>
                </div>
                {createError && (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    {createError}
                  </div>
                )}
                <button
                  onClick={handleCreateTeam}
                  disabled={creating}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {creating ? "Creating..." : "Create Team"}
                </button>
              </div>
            )}

            {/* Teams Table */}
            {loadingTeams ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#FF2D6F]" />
              </div>
            ) : teams.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No teams found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="px-4 py-3 font-medium">Team Name</th>
                      <th className="px-4 py-3 font-medium">Project</th>
                      <th className="px-4 py-3 font-medium">Score</th>
                      <th className="px-4 py-3 font-medium">Members</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((t) => {
                      const members = users.filter((u) => u.team_id === t.id);
                      return (
                        <tr key={t.id} className="border-b border-white/5 transition hover:bg-white/5">
                          <td className="px-4 py-3 font-medium text-white">{t.name}</td>
                          <td className="px-4 py-3 text-zinc-300">
                            {t.project_name || <span className="text-zinc-600">Not set</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-lg bg-[#FF2D6F]/15 px-2.5 py-1 text-sm font-medium text-[#FF2D6F]">
                              {t.score}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {members.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {members.map((m) => (
                                  <span key={m.id} className="rounded-md bg-sky-500/15 px-2 py-0.5 text-xs text-sky-300">
                                    {m.full_name || m.username}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-600">No members</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteTeam(t.id, t.name)}
                              className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                              title="Delete team"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Judging Criteria Reference */}
        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
          <div className="mb-5 flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-[#FF2D6F]" />
            <div>
              <h3 className="text-2xl font-semibold">Judging Criteria</h3>
              <p className="text-sm text-zinc-300">Weighted scoring categories used by judges.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "Technical Execution", weight: "30%", desc: "API integration and data processing" },
              { name: "Creativity & Innovation", weight: "25%", desc: "Originality of idea and approach" },
              { name: "Impact & Relevance", weight: "20%", desc: "Meaningfulness to target audience" },
              { name: "Presentation", weight: "15%", desc: "Clarity and professionalism of demo" },
              { name: "User Experience", weight: "10%", desc: "Intuitive and responsive interface" },
            ].map((c) => (
              <div key={c.name} className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
                <div className="mb-2 text-2xl font-bold text-[#FF2D6F]">{c.weight}</div>
                <div className="font-medium text-white">{c.name}</div>
                <div className="mt-1 text-xs text-zinc-400">{c.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
