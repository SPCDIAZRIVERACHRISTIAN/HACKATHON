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
  TimerReset,
  Pencil,
  Settings,
  CheckCircle2,
  CircleDashed,
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
  mentor_name: string;
  score: string;
  created_at: string;
  updated_at: string;
};

type HackathonEvent = {
  id: number;
  label: string;
  start_time: string;
  end_time: string | null;
  order: number;
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

function toLocalDatetimeValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminView() {
  const role =
    (localStorage.getItem("role") as "admin" | "judge" | "student") || "admin";

  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
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
    mentor_name: "",
  });

  const [newEvent, setNewEvent] = useState({
    label: "",
    start_time: "",
    end_time: "",
    order: 0,
  });

  const [editingEvent, setEditingEvent] = useState<HackathonEvent | null>(null);
  const [editEventForm, setEditEventForm] = useState({
    label: "",
    start_time: "",
    end_time: "",
    order: 0,
  });

  const [activeTab, setActiveTab] = useState<"users" | "teams" | "timeline">("users");

  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetAutoGenerate, setResetAutoGenerate] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetGeneratedPassword, setResetGeneratedPassword] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [progressTeam, setProgressTeam] = useState<Team | null>(null);
  const [teamTasks, setTeamTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [adminTaskFilter, setAdminTaskFilter] = useState<"all" | "done" | "pending">("all");

  const filteredAdminTasks = useMemo(() => {
    return teamTasks.filter((task) => {
      if (adminTaskFilter === "done") return task.is_done;
      if (adminTaskFilter === "pending") return !task.is_done;
      return true;
    });
  }, [teamTasks, adminTaskFilter]);

  const fetchTeamTasks = async (teamId: number) => {
    setLoadingTasks(true);
    try {
      const res = await fetch(`/api/team/teams/${teamId}/tasks/`);
      const data = await res.json();
      setTeamTasks(data);
    } catch {
      setTeamTasks([]);
    }
    setLoadingTasks(false);
  };

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

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/team/events/");
      const data = await res.json();
      setEvents(data);
    } catch {
      setEvents([]);
    }
    setLoadingEvents(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
    fetchEvents();
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
      setNewTeam({ name: "", project_name: "", mentor_name: "" });
      fetchTeams();
    } catch {
      setCreateError("Unable to connect to the server.");
    }
    setCreating(false);
  };

  const handleCreateEvent = async () => {
    setCreateError("");
    if (!newEvent.label || !newEvent.start_time) {
      setCreateError("Label and start time are required.");
      return;
    }
    setCreating(true);

    let startTimeISO = "";
    let endTimeISO: string | null = null;

    try {
      startTimeISO = new Date(newEvent.start_time).toISOString();
      if (newEvent.end_time) {
        endTimeISO = new Date(newEvent.end_time).toISOString();
      }
    } catch (e) {
      setCreateError("Invalid date format provided.");
      setCreating(false);
      return;
    }

    try {
      const res = await fetch("/api/team/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: newEvent.label,
          start_time: startTimeISO,
          end_time: endTimeISO,
          order: newEvent.order,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setCreateError(data.error || "Failed to create event.");
        setCreating(false);
        return;
      }
      setShowCreateEvent(false);
      setNewEvent({ label: "", start_time: "", end_time: "", order: 0 });
      fetchEvents();
    } catch (err: any) {
      setCreateError(`Unable to connect to the server: ${err?.message || "Unknown error"}`);
    }
    setCreating(false);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    setCreateError("");
    if (!editEventForm.label || !editEventForm.start_time) {
      setCreateError("Label and start time are required.");
      return;
    }

    let startTimeISO = "";
    let endTimeISO: string | null = null;

    try {
      startTimeISO = new Date(editEventForm.start_time).toISOString();
      if (editEventForm.end_time) {
        endTimeISO = new Date(editEventForm.end_time).toISOString();
      }
    } catch (e) {
      setCreateError("Invalid date format provided.");
      return;
    }

    try {
      const res = await fetch(`/api/team/events/${editingEvent.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editEventForm.label,
          start_time: startTimeISO,
          end_time: endTimeISO,
          order: editEventForm.order,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setCreateError(data.error || "Failed to update event.");
        return;
      }
      setEditingEvent(null);
      fetchEvents();
    } catch (err: any) {
      setCreateError(`Unable to connect to the server: ${err?.message || "Unknown error"}`);
    }
  };

  const handleDeleteEvent = async (eventId: number, label: string) => {
    if (!confirm(`Delete event "${label}"?`)) return;
    try {
      const res = await fetch(`/api/team/events/${eventId}/`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete event.");
        return;
      }
      fetchEvents();
    } catch {
      alert("Unable to connect to the server.");
    }
  };

  const handleUpdateMentor = async (teamId: number, mentorName: string) => {
    try {
      await fetch(`/api/team/teams/${teamId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentor_name: mentorName }),
      });
      fetchTeams();
    } catch {
      alert("Unable to update mentor.");
    }
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

  const handleUpdateUser = async () => {
    if (!editUser) return;
    setUpdatingUser(true);
    setResetError("");
    try {
      const res = await fetch(`/api/users/${editUser.id}/update/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editUser.username,
          full_name: editUser.full_name,
          role: editUser.role,
          team_id: editUser.team_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Failed to update user.");
      } else {
        setEditUser(null);
        fetchUsers();
      }
    } catch {
      setResetError("Unable to connect to the server.");
    }
    setUpdatingUser(false);
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

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return (
    <AppLayout>
      <Sidebar active="admin" role={role} />

      <main className="flex-1 space-y-6">
        <PageHero
          title="Admin Control Panel"
          subtitle="Manage users, teams, event timeline, and oversee the hackathon platform."
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
          {[
            { id: "users" as const, label: "User Management", icon: <Users className="h-4 w-4" /> },
            { id: "teams" as const, label: "Team Management", icon: <ClipboardList className="h-4 w-4" /> },
            { id: "timeline" as const, label: "Event Timeline", icon: <TimerReset className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
                  : "bg-[#1A1A1A] text-zinc-200 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center gap-2">{tab.icon}{tab.label}</span>
            </button>
          ))}
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

            {showCreateUser && (
              <div className="mb-5 rounded-2xl border border-[#FF2D6F]/30 bg-[#1A1A1A] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Create New User</h4>
                  <button
                    onClick={() => { setShowCreateUser(false); setGeneratedPassword(""); setCreateError(""); }}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {generatedPassword ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <p className="mb-1 text-sm font-medium text-emerald-300">User created! Here is the generated password:</p>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="rounded-lg bg-black/40 px-3 py-2 text-lg font-mono text-white">{generatedPassword}</code>
                        <CopyButton text={generatedPassword} />
                      </div>
                      <p className="mt-3 text-xs text-zinc-400">Share this password with the user. They will be asked to change it on first login.</p>
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
                        <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-zinc-400">Full Name</label>
                        <input type="text" value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-zinc-400">Role</label>
                        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "judge" | "student" })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]">
                          <option value="student">Student</option>
                          <option value="judge">Judge</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      {newUser.role === "student" && (
                        <div>
                          <label className="mb-1 block text-sm text-zinc-400">Team</label>
                          <select value={newUser.team_id} onChange={(e) => setNewUser({ ...newUser, team_id: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]">
                            <option value="">Select a team</option>
                            {teams.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                          <input type="checkbox" checked={newUser.auto_generate} onChange={(e) => setNewUser({ ...newUser, auto_generate: e.target.checked })} className="accent-[#FF2D6F]" />
                          <Wand2 className="h-3.5 w-3.5" />
                          Auto-generate
                        </label>
                      </div>
                      {!newUser.auto_generate && (
                        <input type="text" placeholder="Enter a password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                      )}
                      {newUser.auto_generate && (
                        <p className="mt-2 text-xs text-zinc-500">A secure password will be generated and shown after creation.</p>
                      )}
                    </div>
                    {createError && (
                      <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{createError}</div>
                    )}
                    <button onClick={handleCreateUser} disabled={creating} className="mt-4 flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02] disabled:opacity-60">
                      {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      {creating ? "Creating..." : "Create User"}
                    </button>
                  </>
                )}
              </div>
            )}

            {loadingUsers ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#FF2D6F]" /></div>
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
                            {roleIcon(u.role)}{u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{u.team_name || <span className="text-zinc-600">—</span>}</td>
                        <td className="px-4 py-3">
                          {u.must_change_password ? (
                            <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300">Pending password change</span>
                          ) : (
                            <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">Active</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setEditUser(u)}
                            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                            title="Edit user"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Edit User Modal */}
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0A0A0A] p-8 shadow-2xl relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#FF2D6F]/10 p-2.5">
                    <Settings className="h-6 w-6 text-[#FF2D6F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit User</h3>
                    <p className="text-xs text-zinc-500">ID: {editUser.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditUser(null)}
                  className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Profile Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-400 ml-1">Full Name</label>
                      <input
                        type="text"
                        value={editUser.full_name || ""}
                        onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none focus:border-[#FF2D6F]/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-400 ml-1">Username</label>
                      <input
                        type="text"
                        value={editUser.username}
                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none focus:border-[#FF2D6F]/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-400 ml-1">Role</label>
                      <select
                        value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
                        className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none focus:border-[#FF2D6F]/50 transition-all appearance-none"
                      >
                        <option value="student">Student</option>
                        <option value="judge">Judge</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    {editUser.role === "student" && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Team</label>
                        <select
                          value={editUser.team_id || ""}
                          onChange={(e) => setEditUser({ ...editUser, team_id: e.target.value ? Number(e.target.value) : null })}
                          className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none focus:border-[#FF2D6F]/50 transition-all appearance-none"
                        >
                          <option value="">No Team</option>
                          {teams.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleUpdateUser}
                    disabled={updatingUser}
                    className="w-full rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    {updatingUser ? "Saving..." : "Save Profile Changes"}
                  </button>
                </div>

                <div className="h-px bg-white/5" />

                {/* Password Reset Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Password Management</h4>
                    <button
                      onClick={() => {
                        setResetUserId(editUser.id);
                        setResetError("");
                        setResetGeneratedPassword("");
                      }}
                      className="text-xs font-bold text-[#FF2D6F] hover:underline"
                    >
                      Reset Now
                    </button>
                  </div>

                  {resetUserId === editUser.id && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
                      {resetGeneratedPassword ? (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                          <p className="mb-1 text-xs font-medium text-emerald-300">New password generated:</p>
                          <div className="flex items-center gap-2">
                            <code className="rounded-lg bg-black/40 px-3 py-1.5 text-base font-mono text-white">{resetGeneratedPassword}</code>
                            <CopyButton text={resetGeneratedPassword} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Auto-generate password</span>
                            <input
                              type="checkbox"
                              checked={resetAutoGenerate}
                              onChange={(e) => setResetAutoGenerate(e.target.checked)}
                              className="accent-[#FF2D6F]"
                            />
                          </div>
                          {!resetAutoGenerate && (
                            <input
                              type="text"
                              placeholder="New password (min 8 chars)"
                              value={resetPassword}
                              onChange={(e) => setResetPassword(e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-[#FF2D6F]/50"
                            />
                          )}
                          <button
                            onClick={handleResetPassword}
                            disabled={resetLoading}
                            className="w-full rounded-lg bg-[#FF2D6F]/20 py-2 text-xs font-bold text-[#FF2D6F] hover:bg-[#FF2D6F]/30 transition-all"
                          >
                            {resetLoading ? "Resetting..." : "Confirm Password Reset"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/5" />

                {/* Danger Zone */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-red-500/50 uppercase tracking-widest">Danger Zone</h4>
                  <button
                    onClick={() => {
                      handleDeleteUser(editUser.id, editUser.username);
                      setEditUser(null);
                    }}
                    className="w-full rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
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
                <button onClick={fetchTeams} className="rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button onClick={() => { setShowCreateTeam(true); setCreateError(""); }} className="flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02]">
                  <Plus className="h-4 w-4" />Add Team
                </button>
              </div>
            </div>

            {showCreateTeam && (
              <div className="mb-5 rounded-2xl border border-[#FF2D6F]/30 bg-[#1A1A1A] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Create New Team</h4>
                  <button onClick={() => setShowCreateTeam(false)} className="text-zinc-400 hover:text-white"><X className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-zinc-400">Team Name</label>
                    <input type="text" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-zinc-400">Mentor Name</label>
                    <input type="text" value={newTeam.mentor_name} onChange={(e) => setNewTeam({ ...newTeam, mentor_name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" placeholder="e.g. Dr. Smith" />
                  </div>
                </div>
                {createError && (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{createError}</div>
                )}
                <button onClick={handleCreateTeam} disabled={creating} className="mt-4 flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02] disabled:opacity-60">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {creating ? "Creating..." : "Create Team"}
                </button>
              </div>
            )}

            {loadingTeams ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#FF2D6F]" /></div>
            ) : teams.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No teams found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="px-4 py-3 font-medium">Team Name</th>
                      <th className="px-4 py-3 font-medium">Mentor</th>
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
                          <td className="px-4 py-3">
                            <MentorCell teamId={t.id} mentorName={t.mentor_name} onSave={handleUpdateMentor} />
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-lg bg-[#FF2D6F]/15 px-2.5 py-1 text-sm font-medium text-[#FF2D6F]">{t.score}</span>
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {members.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {members.map((m) => (
                                  <span key={m.id} className="rounded-md bg-sky-500/15 px-2 py-0.5 text-xs text-sky-300">{m.full_name || m.username}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-600">No members</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setProgressTeam(t);
                                  fetchTeamTasks(t.id);
                                }}
                                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                                title="View tasks progress"
                              >
                                <ClipboardList className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteTeam(t.id, t.name)} className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400" title="Delete team">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
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

        {/* Event Timeline Management */}
        {activeTab === "timeline" && (
          <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TimerReset className="h-5 w-5 text-[#FF2D6F]" />
                <h3 className="text-2xl font-semibold">Event Timeline</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchEvents} className="rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button onClick={() => { setShowCreateEvent(true); setCreateError(""); }} className="flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02]">
                  <Plus className="h-4 w-4" />Add Event
                </button>
              </div>
            </div>

            {showCreateEvent && (
              <div className="mb-5 rounded-2xl border border-[#FF2D6F]/30 bg-[#1A1A1A] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Add Timeline Event</h4>
                  <button onClick={() => setShowCreateEvent(false)} className="text-zinc-400 hover:text-white"><X className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-sm text-zinc-400">Label</label>
                    <input type="text" value={newEvent.label} onChange={(e) => setNewEvent({ ...newEvent, label: e.target.value })} placeholder="e.g. Kickoff" className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-zinc-400">Start Time</label>
                    <input type="datetime-local" value={newEvent.start_time} onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-zinc-400">End Time (optional)</label>
                    <input type="datetime-local" value={newEvent.end_time} onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-zinc-400">Order</label>
                    <input type="number" value={newEvent.order} onChange={(e) => setNewEvent({ ...newEvent, order: Number(e.target.value) })} className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                  </div>
                </div>
                {createError && (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{createError}</div>
                )}
                <button onClick={handleCreateEvent} disabled={creating} className="mt-4 flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02] disabled:opacity-60">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {creating ? "Creating..." : "Add Event"}
                </button>
              </div>
            )}

            {/* Edit Event Modal */}
            {editingEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0A0A0A] p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Pencil className="h-5 w-5 text-[#FF2D6F]" />
                      <h3 className="text-xl font-semibold text-white">Edit Event</h3>
                    </div>
                    <button onClick={() => setEditingEvent(null)} className="text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-zinc-400">Label</label>
                      <input type="text" value={editEventForm.label} onChange={(e) => setEditEventForm({ ...editEventForm, label: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-zinc-400">Order</label>
                      <input type="number" value={editEventForm.order} onChange={(e) => setEditEventForm({ ...editEventForm, order: Number(e.target.value) })} className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-zinc-400">Start Time</label>
                      <input type="datetime-local" value={editEventForm.start_time} onChange={(e) => setEditEventForm({ ...editEventForm, start_time: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-zinc-400">End Time (optional)</label>
                      <input type="datetime-local" value={editEventForm.end_time} onChange={(e) => setEditEventForm({ ...editEventForm, end_time: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white outline-none focus:border-[#FF2D6F]" />
                    </div>
                  </div>
                  {createError && (
                    <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{createError}</div>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button onClick={handleUpdateEvent} className="flex items-center gap-2 rounded-xl bg-[#FF2D6F] px-5 py-2.5 text-sm font-medium text-white transition hover:scale-[1.02]">
                      Save Changes
                    </button>
                    <button onClick={() => setEditingEvent(null)} className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loadingEvents ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#FF2D6F]" /></div>
            ) : events.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No events yet. Add your first timeline event above.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF2D6F]/15 text-sm font-bold text-[#FF2D6F]">
                      {event.order}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{event.label}</div>
                      <div className="text-sm text-zinc-400">
                        {formatTime(event.start_time)}
                        {event.end_time ? ` - ${formatTime(event.end_time)}` : " onward"}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setEditEventForm({
                            label: event.label,
                            start_time: toLocalDatetimeValue(event.start_time),
                            end_time: event.end_time ? toLocalDatetimeValue(event.end_time) : "",
                            order: event.order,
                          });
                          setCreateError("");
                        }}
                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                        title="Edit event"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id, event.label)} className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400" title="Delete event">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
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

        {/* Team Progress Modal */}
        {progressTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg max-h-[90vh] rounded-[28px] border border-white/10 bg-[#0A0A0A] p-8 shadow-2xl relative flex flex-col">
              <div className="mb-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-500/10 p-2.5">
                    <ClipboardList className="h-6 w-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Team Progress</h3>
                    <p className="text-xs text-zinc-500 uppercase font-black">{progressTeam.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setProgressTeam(null)}
                  className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filters */}
              <div className="mb-6 flex gap-2 shrink-0 overflow-x-auto pb-1">
                {[
                  { id: "all", label: "All" },
                  { id: "done", label: "Completed" },
                  { id: "pending", label: "Pending" }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAdminTaskFilter(f.id as any)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      adminTaskFilter === f.id 
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
                        : "bg-white/5 text-zinc-400 hover:bg-white/10"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loadingTasks ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAdminTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                          task.is_done 
                            ? "border-emerald-500/20 bg-emerald-500/[0.04]" 
                            : "border-white/5 bg-white/[0.02]"
                        }`}
                      >
                        {task.is_done ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <CircleDashed className="h-5 w-5 text-zinc-600" />
                        )}
                        <div className="flex-1">
                          <div className={`font-semibold ${task.is_done ? "text-emerald-50" : "text-zinc-400"}`}>
                            {task.label}
                          </div>
                          <div className="text-[10px] uppercase font-black tracking-tighter text-zinc-600">
                            {task.is_done ? "Completed" : "Pending"}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredAdminTasks.length === 0 && (
                      <div className="text-center py-12 text-zinc-500 italic text-sm">
                        No tasks found for this filter.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 shrink-0">
                <button
                  onClick={() => setProgressTeam(null)}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-zinc-300 hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  Close Progress View
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}

function MentorCell({ teamId, mentorName, onSave }: { teamId: number; mentorName: string; onSave: (id: number, name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(mentorName);

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className={mentorName ? "text-zinc-300" : "text-zinc-600"}>{mentorName || "Not assigned"}</span>
        <button onClick={() => { setEditing(true); setValue(mentorName); }} className="rounded p-1 text-zinc-500 transition hover:text-white" title="Edit mentor">
          <Pencil className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { onSave(teamId, value); setEditing(false); }
          if (e.key === "Escape") setEditing(false);
        }}
        autoFocus
        className="w-28 rounded-lg border border-white/10 bg-[#0A0A0A] px-2 py-1 text-sm text-white outline-none focus:border-[#FF2D6F]"
        placeholder="Mentor name"
      />
      <button onClick={() => { onSave(teamId, value); setEditing(false); }} className="rounded p-1 text-emerald-400 hover:text-emerald-300">
        <Check className="h-3.5 w-3.5" />
      </button>
      <button onClick={() => setEditing(false)} className="rounded p-1 text-zinc-500 hover:text-white">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
