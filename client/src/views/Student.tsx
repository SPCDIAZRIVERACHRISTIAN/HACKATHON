import { useEffect, useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import AppLayout from "../components/AppLayout";
import Sidebar from "../components/Sidebar";
import StudentSection from "../components/StudentSection";
import StatCard from "../components/StatCard";
import {
  Trophy,
  Users,
  ClipboardList,
  Loader2,
  Gauge,
  BookOpen,
  TimerReset,
  ChevronRight,
  CheckCircle2,
  CircleDashed,
  GitBranch,
  Search,
  ExternalLink,
  Terminal,
  Copy,
  Check,
  Clock,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

type TimelineEvent = {
  id: number;
  label: string;
  start_time: string;
  end_time: string | null;
  order: number;
};

type Team = {
  id: number;
  name: string;
  project_name: string;
  mentor_name: string;
  score: string;
};

const instructions = [
  "Choose a challenge track and define the problem clearly.",
  "Build a polished demo-first interface that can be shown live.",
  "Coordinate with your team using Git branches and pull requests.",
  "Present a simple story: problem, solution, impact, and user experience.",
];

const gitSetupSteps = [
  {
    title: "1. Clone the repository",
    command: "git clone <repo-url>",
    description: "Download the project to your computer. Your team lead or mentor will share the repo URL.",
  },
  {
    title: "2. Enter the project folder",
    command: "cd <project-folder>",
    description: "Navigate into the cloned directory before running any commands.",
  },
  {
    title: "3. Create your team branch",
    command: "git checkout -b your-team-branch",
    description: "Never work directly on main. Create a branch named after your team (e.g., team-nova).",
  },
  {
    title: "4. Install dependencies & start coding",
    command: "npm install  (or pip install -r requirements.txt)",
    description: "Install whatever your chosen tech stack needs, then start building your project.",
  },
  {
    title: "5. Stage and commit your work",
    command: 'git add .  &&  git commit -m "your message"',
    description: "Save your progress frequently with clear commit messages describing what you did.",
  },
  {
    title: "6. Push your branch to GitHub",
    command: "git push origin your-team-branch",
    description: "Upload your changes so your teammates can pull them and judges can see progress.",
  },
  {
    title: "7. Pull teammates' changes",
    command: "git pull origin your-team-branch",
    description: "Before starting new work, always pull to get the latest changes from your team.",
  },
  {
    title: "8. Open a Pull Request",
    command: "Go to GitHub -> Pull Requests -> New",
    description: "When ready, create a PR to merge your branch into main for final review.",
  },
];

const gitCommands = [
  { command: "git clone <url>", category: "setup", description: "Copy a remote repository to your computer" },
  { command: "git init", category: "setup", description: "Initialize a new Git repository in the current folder" },
  { command: "git status", category: "basics", description: "Show which files have been changed, staged, or are untracked" },
  { command: "git add <file>", category: "basics", description: "Stage a specific file for the next commit" },
  { command: "git add .", category: "basics", description: "Stage all changed files at once" },
  { command: 'git commit -m "message"', category: "basics", description: "Save staged changes with a description" },
  { command: "git log --oneline", category: "basics", description: "View a compact list of recent commits" },
  { command: "git diff", category: "basics", description: "Show what changed in your files since the last commit" },
  { command: "git branch", category: "branching", description: "List all local branches (current one has a *)" },
  { command: "git branch <name>", category: "branching", description: "Create a new branch" },
  { command: "git checkout <branch>", category: "branching", description: "Switch to an existing branch" },
  { command: "git checkout -b <branch>", category: "branching", description: "Create and switch to a new branch in one step" },
  { command: "git merge <branch>", category: "branching", description: "Merge another branch into your current branch" },
  { command: "git push origin <branch>", category: "remote", description: "Upload your branch to GitHub" },
  { command: "git pull origin <branch>", category: "remote", description: "Download and merge the latest changes from GitHub" },
  { command: "git fetch", category: "remote", description: "Download changes from GitHub without merging" },
  { command: "git remote -v", category: "remote", description: "Show the remote URLs linked to your repo" },
  { command: "git stash", category: "extras", description: "Temporarily save uncommitted changes to switch branches" },
  { command: "git stash pop", category: "extras", description: "Restore your stashed changes" },
  { command: "git reset HEAD <file>", category: "extras", description: "Unstage a file (undo git add)" },
  { command: "git checkout -- <file>", category: "extras", description: "Discard changes in a file (revert to last commit)" },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function isEventDone(event: TimelineEvent, now: Date) {
  if (event.end_time) return now >= new Date(event.end_time);
  return false;
}

function isEventActive(event: TimelineEvent, now: Date) {
  const start = new Date(event.start_time);
  const end = event.end_time ? new Date(event.end_time) : null;
  return now >= start && (!end || now < end);
}

function getTimeRemaining(event: TimelineEvent, now: Date) {
  const end = event.end_time ? new Date(event.end_time) : null;
  if (!end) return null;
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m remaining`;
  if (m > 0) return `${m}m ${s}s remaining`;
  return `${s}s remaining`;
}

function CopyCmd({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
      title="Copy command"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function StudentView() {
  const role =
    (localStorage.getItem("role") as "admin" | "judge" | "student") || "student";

  const [studentTaskFilter, setStudentTaskFilter] = useState<"all" | "done" | "pending">("all");
  const [activeStudentTab, setActiveStudentTab] = useState<"overview" | "instructions" | "timeline" | "git-guide" | "git-commands">("overview");
  const [gitSearch, setGitSearch] = useState("");
  const [gitCategoryFilter, setGitCategoryFilter] = useState<string>("all");
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [now, setNow] = useState(new Date());
  
  // Student Context
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  // Admin Context
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedAdminTeam, setSelectedAdminTeam] = useState<Team | null>(null);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  const fetchTasks = (teamId: number) => {
    fetch(`/api/team/teams/${teamId}/tasks/`)
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => {});
  };

  useEffect(() => {
    fetch("/api/team/events/")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});

    if (role === "admin") {
      setLoadingAdminData(true);
      Promise.all([
        fetch("/api/team/teams/").then(r => r.json()),
        fetch("/api/users/").then(r => r.json())
      ]).then(([teams, users]) => {
        setAllTeams(teams);
        setAllUsers(users);
        setLoadingAdminData(false);
      }).catch(() => setLoadingAdminData(false));
    }

    // Get current user profile - handle both old and new localStorage formats
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const storedFullName = localStorage.getItem("fullName");
    const storedTeamName = localStorage.getItem("teamName");

    let currentUser: any = null;
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    } else {
      currentUser = {
        role: storedRole,
        username: storedUsername,
        full_name: storedFullName,
        team_name: storedTeamName
      };
    }
    setUserProfile(currentUser);

    // If student, find their specific team
    if (role === "student") {
      fetch("/api/team/teams/")
        .then((r) => r.json())
        .then((teams: Team[]) => {
          let found: Team | undefined;
          if (currentUser.team_id) {
            found = teams.find((t) => t.id === Number(currentUser.team_id));
          } else if (currentUser.team_name) {
            found = teams.find((t) => t.name === currentUser.team_name);
          }

          if (found) {
            setMyTeam(found);
            fetchTasks(found.id);
            
            // Fetch all users to find team members
            fetch("/api/users/")
              .then((r) => r.json())
              .then((users: any[]) => {
                const members = users.filter((u) => u.team_id === found?.id);
                setTeamMembers(members);
              });
          }
        });
    }
  }, [role]);

  useEffect(() => {
    if (selectedAdminTeam) {
      fetchTasks(selectedAdminTeam.id);
      const members = allUsers.filter(u => u.team_id === selectedAdminTeam.id);
      setTeamMembers(members);
    }
  }, [selectedAdminTeam, allUsers]);

  const handleToggleTask = async (taskId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/team/tasks/${taskId}/toggle/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_done: !currentStatus }),
      });
      if (res.ok) {
        if (userProfile?.team_id) {
          fetchTasks(userProfile.team_id);
        }
      }
    } catch {
      console.error("Failed to toggle task");
    }
  };

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const activeEvent = events.find((e) => isEventActive(e, now));

  const studentTasks = tasks.filter((task) => {
    if (studentTaskFilter === "done") return task.is_done;
    if (studentTaskFilter === "pending") return !task.is_done;
    return true;
  });

  const filteredCommands = useMemo(() => {
    return gitCommands.filter((cmd) => {
      const matchesSearch =
        !gitSearch ||
        cmd.command.toLowerCase().includes(gitSearch.toLowerCase()) ||
        cmd.description.toLowerCase().includes(gitSearch.toLowerCase());
      const matchesCategory = gitCategoryFilter === "all" || cmd.category === gitCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [gitSearch, gitCategoryFilter]);

  const displayedTeam = role === "admin" ? selectedAdminTeam : myTeam;

  return (
    <AppLayout>
      <Sidebar active="student" role={role} />

      <main className="flex-1 space-y-6">
        <PageHero title={role === "admin" ? "Admin: Student View Controller" : "University Hackathon Student Portal"} active="student" role={role} />
        
        {role === "admin" && selectedAdminTeam && (
          <div className="flex justify-start">
            <button
              onClick={() => setSelectedAdminTeam(null)}
              className="flex items-center gap-2 rounded-xl bg-[#FF2D6F]/10 border border-[#FF2D6F]/30 px-5 py-2.5 text-sm font-bold text-[#FF4D85] hover:bg-[#FF2D6F]/20 transition-all shadow-lg shadow-[#FF2D6F]/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Teams
            </button>
          </div>
        )}

        {role === "admin" && !selectedAdminTeam ? (
          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-2xl bg-[#FF2D6F]/10 p-3">
                  <Users className="h-6 w-6 text-[#FF2D6F]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Select a Team to View</h3>
                  <p className="text-zinc-400">Viewing as Admin: Inspect any team's real-time progress and workspace.</p>
                </div>
              </div>

              {loadingAdminData ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-[#FF2D6F]" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {allTeams.map((team) => {
                    const members = allUsers.filter(u => u.team_id === team.id);
                    return (
                      <button
                        key={team.id}
                        onClick={() => setSelectedAdminTeam(team)}
                        className="group relative flex flex-col items-start rounded-[24px] border border-white/5 bg-white/[0.02] p-6 text-left transition-all hover:bg-white/[0.05] hover:border-[#FF2D6F]/30 active:scale-[0.98]"
                      >
                        <div className="mb-4 flex w-full items-center justify-between">
                          <span className="rounded-lg bg-[#FF2D6F]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter text-[#FF2D6F]">
                            Team ID: {team.id}
                          </span>
                          <ChevronRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1" />
                        </div>
                        
                        <h4 className="mb-1 text-lg font-bold text-white group-hover:text-[#FF4D85] transition-colors">
                          {team.name}
                        </h4>
                        
                        <div className="mb-4 flex items-center gap-1.5 text-xs text-zinc-500">
                          <UserCheck className="h-3 w-3" />
                          Mentor: {team.mentor_name || "Not assigned"}
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5 w-full">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-3 w-3 text-sky-400" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Members</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {members.length > 0 ? members.map(m => (
                              <div key={m.id} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
                                {m.full_name || m.username}
                              </div>
                            )) : (
                              <span className="text-[10px] italic text-zinc-600">No members assigned</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Stat Cards */}
            <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={<Clock className="h-5 w-5" />}
                  label="Current Phase"
                  value={activeEvent?.label || "Waiting"}
                  detail={activeEvent ? getTimeRemaining(activeEvent, now) || "In progress" : "No active phase"}
                />
                <StatCard
                  icon={<UserCheck className="h-5 w-5" />}
                  label="Team Mentor"
                  value={displayedTeam?.mentor_name || "Not assigned"}
                  detail={displayedTeam ? `Team: ${displayedTeam.name}` : "Team not found"}
                />
                <StatCard
                  icon={<Trophy className="h-5 w-5" />}
                  label="Timeline Progress"
                  value={`${events.filter((e) => isEventDone(e, now)).length}/${events.length}`}
                  detail="Phases completed"
                />
                <StatCard
                  icon={<Gauge className="h-5 w-5" />}
                  label="Current Time"
                  value={now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}
                  detail={now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                />
              </div>
            </section>

            {/* Tab Switcher */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "overview" as const, label: "Progress & Coaching", icon: <ClipboardList className="h-4 w-4" /> },
                { id: "instructions" as const, label: "Instructions", icon: <BookOpen className="h-4 w-4" /> },
                { id: "timeline" as const, label: "Schedule", icon: <TimerReset className="h-4 w-4" /> },
                { id: "git-guide" as const, label: "Git Setup", icon: <GitBranch className="h-4 w-4" /> },
                { id: "git-commands" as const, label: "Commands", icon: <Terminal className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStudentTab(tab.id)}
                  className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
                    activeStudentTab === tab.id
                      ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
                      : "bg-[#1A1A1A] text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">{tab.icon}{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeStudentTab === "overview" && (
              <StudentSection
                studentTaskFilter={studentTaskFilter}
                setStudentTaskFilter={setStudentTaskFilter}
                studentTasks={studentTasks}
                userProfile={role === "admin" ? null : userProfile}
                myTeam={displayedTeam}
                teamMembers={teamMembers}
                onToggleTask={handleToggleTask}
              />
            )}

            {/* Tab: Instructions */}
            {activeStudentTab === "instructions" && (
              <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-[#FF2D6F]/10 p-3">
                    <BookOpen className="h-6 w-6 text-[#FF2D6F]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Project Instructions</h3>
                    <p className="text-sm text-zinc-400">What judges are looking for in your project.</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {instructions.map((item) => (
                    <div key={item} className="flex gap-4 rounded-[24px] border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04]">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FF2D6F] shadow-[0_0_8px_rgba(255,45,111,0.5)]" />
                      <p className="text-lg font-medium text-zinc-200 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tab: Timeline */}
            {activeStudentTab === "timeline" && (
              <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-xl">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#FF2D6F]/10 p-3">
                      <TimerReset className="h-6 w-6 text-[#FF2D6F]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Event Timeline</h3>
                      <p className="text-sm text-zinc-400">Today's schedule — updates live.</p>
                    </div>
                  </div>
                </div>
                {events.length === 0 ? (
                  <div className="py-20 text-center">
                    <Clock className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
                    <p className="text-zinc-500 font-medium">No events scheduled yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {events.map((event) => {
                      const done = isEventDone(event, now);
                      const active = isEventActive(event, now);
                      const remaining = active ? getTimeRemaining(event, now) : null;
                      return (
                        <div
                          key={event.id}
                          className={`flex items-start gap-4 rounded-[24px] border p-6 transition-all ${
                            active
                              ? "border-[#FF2D6F]/40 bg-[#FF2D6F]/5 shadow-lg shadow-[#FF2D6F]/5"
                              : "border-white/5 bg-white/[0.02]"
                          }`}
                        >
                          <div className="mt-1">
                            {done ? (
                              <div className="rounded-full bg-emerald-500/10 p-1">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              </div>
                            ) : active ? (
                              <div className="h-6 w-6 animate-pulse rounded-full border-2 border-[#FF2D6F] bg-[#FF2D6F]/20 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-[#FF2D6F]" />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className={`text-lg font-bold ${active ? "text-[#FF2D6F]" : "text-zinc-200"}`}>
                                {event.label}
                              </div>
                              {active && (
                                <span className="rounded-md bg-[#FF2D6F] px-2 py-0.5 text-[10px] font-black text-white">
                                  LIVE
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-500 font-bold uppercase tracking-widest">
                              <Clock className="h-3 w-3" />
                              {formatTime(event.start_time)}
                              {event.end_time ? ` - ${formatTime(event.end_time)}` : " onward"}
                            </div>
                            {remaining && (
                              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FF2D6F]/10 px-3 py-1.5 text-xs font-bold text-[#FF4D85]">
                                <TimerReset className="h-3 w-3" />
                                {remaining}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Tab: Git & GitHub Setup Guide */}
            {activeStudentTab === "git-guide" && (
              <section className="space-y-6">
                <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                  <div className="mb-5 flex items-center gap-3">
                    <GitBranch className="h-5 w-5 text-[#FF2D6F]" />
                    <div>
                      <h3 className="text-2xl font-semibold">Git & GitHub Setup Guide</h3>
                      <p className="text-sm text-zinc-300">
                        Follow these steps to get your team's project set up with Git and GitHub for collaboration.
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 rounded-2xl border border-[#FF2D6F]/20 bg-[#FF2D6F]/5 p-5">
                    <h4 className="mb-3 font-semibold text-[#FF4D85]">Team Collaboration Tips</h4>
                    <ul className="space-y-2 text-sm text-zinc-200">
                      <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2D6F]" />Each team member should work on their own branch — never commit directly to main.</li>
                      <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2D6F]" />Pull from your team branch frequently to avoid merge conflicts.</li>
                      <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2D6F]" />Write clear commit messages so your teammates know what changed.</li>
                      <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2D6F]" />If you hit a merge conflict, don't panic — read both versions and pick what's correct.</li>
                      <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2D6F]" />Use Pull Requests to review each other's code before merging.</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    {gitSetupSteps.map((step) => (
                      <div key={step.title} className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-5">
                        <h4 className="mb-2 font-semibold text-white">{step.title}</h4>
                        <p className="mb-3 text-sm text-zinc-300">{step.description}</p>
                        <div className="flex items-center justify-between rounded-xl bg-black/40 px-4 py-2.5 font-mono text-sm text-[#ff7aa7]">
                          <span>{step.command}</span>
                          <CopyCmd text={step.command} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                  <div className="mb-5 flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-[#FF2D6F]" />
                    <div>
                      <h3 className="text-2xl font-semibold">Official Documentation</h3>
                      <p className="text-sm text-zinc-300">Need more detail? These are the best resources.</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a href="https://docs.github.com/en/get-started" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:border-[#FF2D6F]/30 hover:bg-[#1A1A1A]/80">
                      <div className="rounded-xl bg-[#FF2D6F]/15 p-2.5 text-[#FF2D6F]"><GitBranch className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <p className="font-medium text-white">GitHub Docs — Get Started</p>
                        <p className="text-xs text-zinc-400">Account setup, repos, and collaboration basics</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-500" />
                    </a>
                    <a href="https://git-scm.com/doc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:border-[#FF2D6F]/30 hover:bg-[#1A1A1A]/80">
                      <div className="rounded-xl bg-[#FF2D6F]/15 p-2.5 text-[#FF2D6F]"><Terminal className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <p className="font-medium text-white">Git Official Documentation</p>
                        <p className="text-xs text-zinc-400">Full reference for all Git commands</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-500" />
                    </a>
                    <a href="https://education.github.com/git-cheat-sheet-education.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:border-[#FF2D6F]/30 hover:bg-[#1A1A1A]/80">
                      <div className="rounded-xl bg-[#FF2D6F]/15 p-2.5 text-[#FF2D6F]"><ClipboardList className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <p className="font-medium text-white">Git Cheat Sheet (PDF)</p>
                        <p className="text-xs text-zinc-400">Printable quick reference from GitHub Education</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-500" />
                    </a>
                    <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:border-[#FF2D6F]/30 hover:bg-[#1A1A1A]/80">
                      <div className="rounded-xl bg-[#FF2D6F]/15 p-2.5 text-[#FF2D6F]"><Users className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <p className="font-medium text-white">Pull Requests Guide</p>
                        <p className="text-xs text-zinc-400">How to collaborate using PRs on GitHub</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-500" />
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Command Reference */}
            {activeStudentTab === "git-commands" && (
              <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                <div className="mb-5 flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-[#FF2D6F]" />
                  <div>
                    <h3 className="text-2xl font-semibold">Git Command Reference</h3>
                    <p className="text-sm text-zinc-300">Search and browse the commands you'll need during the hackathon.</p>
                  </div>
                </div>

                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-2.5">
                    <Search className="h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search commands... (e.g. branch, push, commit)"
                      value={gitSearch}
                      onChange={(e) => setGitSearch(e.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: "all", label: "All" },
                      { id: "setup", label: "Setup" },
                      { id: "basics", label: "Basics" },
                      { id: "branching", label: "Branching" },
                      { id: "remote", label: "Remote" },
                      { id: "extras", label: "Extras" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setGitCategoryFilter(cat.id)}
                        className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                          gitCategoryFilter === cat.id
                            ? "bg-[#FF2D6F] text-white"
                            : "bg-[#1A1A1A] text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredCommands.length === 0 ? (
                  <p className="py-8 text-center text-zinc-500">No commands match your search.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredCommands.map((cmd) => (
                      <div
                        key={cmd.command}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:bg-white/5"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <code className="rounded-lg bg-black/40 px-3 py-1.5 font-mono text-sm text-[#ff7aa7]">
                              {cmd.command}
                            </code>
                            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                              {cmd.category}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-zinc-300">{cmd.description}</p>
                        </div>
                        <CopyCmd text={cmd.command} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </AppLayout>
  );
}
