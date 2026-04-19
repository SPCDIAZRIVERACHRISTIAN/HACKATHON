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
  const [tipCount, setTipCount] = useState(1);
  const [studentTaskFilter, setStudentTaskFilter] = useState<"all" | "done" | "pending">("all");
  const [activeStudentTab, setActiveStudentTab] = useState<"overview" | "git-guide" | "git-commands">("overview");
  const [gitSearch, setGitSearch] = useState("");
  const [gitCategoryFilter, setGitCategoryFilter] = useState<string>("all");
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [now, setNow] = useState(new Date());
  const [myTeam, setMyTeam] = useState<Team | null>(null);

  useEffect(() => {
    fetch("/api/team/events/")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});

    const teamName = localStorage.getItem("teamName");
    fetch("/api/team/teams/")
      .then((r) => r.json())
      .then((teams: Team[]) => {
        if (teamName) {
          const found = teams.find((t) => t.name === teamName);
          if (found) setMyTeam(found);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const activeEvent = events.find((e) => isEventActive(e, now));

  const studentPenalty = tipCount * 2;
  const adjustedStudentScore = Math.max(88 - studentPenalty, 0);

  const studentTasks = [
    { label: "Problem defined", done: true },
    { label: "UI wireframe complete", done: true },
    { label: "Judge scoring flow drafted", done: true },
    { label: "Student account mockup", done: false },
    { label: "Final presentation polish", done: false },
  ].filter((task) => {
    if (studentTaskFilter === "done") return task.done;
    if (studentTaskFilter === "pending") return !task.done;
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

  const role =
    (localStorage.getItem("role") as "admin" | "judge" | "student") || "student";

  return (
    <AppLayout>
      <Sidebar active="student" role={role} />

      <main className="flex-1 space-y-6">
        <PageHero title="University Hackathon Student Portal" active="student" role={role} />

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
              label="Your Mentor"
              value={myTeam?.mentor_name || "Not assigned"}
              detail={myTeam ? `Team: ${myTeam.name}` : "Team not found"}
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
            { id: "git-guide" as const, label: "Git & GitHub Setup", icon: <GitBranch className="h-4 w-4" /> },
            { id: "git-commands" as const, label: "Command Reference", icon: <Terminal className="h-4 w-4" /> },
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
          <>
            <StudentSection
              studentTaskFilter={studentTaskFilter}
              setStudentTaskFilter={setStudentTaskFilter}
              studentTasks={studentTasks}
              tipCount={tipCount}
              setTipCount={setTipCount}
              studentPenalty={studentPenalty}
              adjustedStudentScore={adjustedStudentScore}
            />

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                <div className="mb-5 flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-[#FF2D6F]" />
                  <div>
                    <h3 className="text-2xl font-semibold">Instructions</h3>
                    <p className="text-sm text-zinc-300">What judges are looking for in your project.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {instructions.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
                      <ChevronRight className="mt-0.5 h-4 w-4 text-[#FF2D6F]" />
                      <p className="text-zinc-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                <div className="mb-5 flex items-center gap-3">
                  <TimerReset className="h-5 w-5 text-[#FF2D6F]" />
                  <div>
                    <h3 className="text-2xl font-semibold">Event Timeline</h3>
                    <p className="text-sm text-zinc-300">Today's schedule — updates live.</p>
                  </div>
                </div>
                {events.length === 0 ? (
                  <p className="py-8 text-center text-zinc-500">No events scheduled yet.</p>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => {
                      const done = isEventDone(event, now);
                      const active = isEventActive(event, now);
                      const remaining = active ? getTimeRemaining(event, now) : null;
                      return (
                        <div
                          key={event.id}
                          className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
                            active
                              ? "border-[#FF2D6F]/40 bg-[#FF2D6F]/5"
                              : "border-white/10 bg-[#1A1A1A]"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                          ) : active ? (
                            <div className="mt-0.5 h-5 w-5 animate-pulse rounded-full border-2 border-[#FF2D6F] bg-[#FF2D6F]/20" />
                          ) : (
                            <CircleDashed className="mt-0.5 h-5 w-5 text-zinc-400" />
                          )}
                          <div className="flex-1">
                            <div className={`font-medium ${active ? "text-[#FF2D6F]" : ""}`}>
                              {event.label}
                              {active && <span className="ml-2 text-xs text-[#FF2D6F]/70">NOW</span>}
                            </div>
                            <div className="text-sm text-zinc-400">
                              {formatTime(event.start_time)}
                              {event.end_time ? ` - ${formatTime(event.end_time)}` : " onward"}
                            </div>
                            {remaining && (
                              <div className="mt-1 text-xs font-medium text-[#FF2D6F]">{remaining}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
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
      </main>
    </AppLayout>
  );
}
