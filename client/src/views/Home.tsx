import React, { useMemo, useState } from "react";
import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";
import lightningBgUrl from "../assets/lightning-bg.png";
import disruptSideBannerUrl from "../assets/disrupt-side-banner.png";
import {
  Trophy,
  Users,
  ClipboardList,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  TimerReset,
  Star,
  ChevronRight,
  CheckCircle2,
  CircleDashed,
  Gauge,
  MessageSquareWarning,
  Home,
  BarChart3,
  UserRoundCog,
  GraduationCap,
  Bell,
  Search,
} from "lucide-react";

const teamsSeed = [
  {
    id: 1,
    name: "Team Nova",
    technical: 9,
    creativity: 8,
    impact: 9,
    presentation: 7,
    ux: 8,
    progress: 92,
    helpRequests: 1,
    status: "Near submission",
  },
  {
    id: 2,
    name: "Team Orbit",
    technical: 8,
    creativity: 10,
    impact: 8,
    presentation: 8,
    ux: 7,
    progress: 87,
    helpRequests: 0,
    status: "Strong momentum",
  },
  {
    id: 3,
    name: "Team Pulse",
    technical: 7,
    creativity: 9,
    impact: 7,
    presentation: 9,
    ux: 9,
    progress: 79,
    helpRequests: 2,
    status: "Needs review",
  },
  {
    id: 4,
    name: "Team Cipher",
    technical: 8,
    creativity: 7,
    impact: 8,
    presentation: 7,
    ux: 8,
    progress: 73,
    helpRequests: 1,
    status: "On track",
  },
];

const weights = {
  technical: 0.3,
  creativity: 0.25,
  impact: 0.2,
  presentation: 0.15,
  ux: 0.1,
};

const instructions = [
  "Choose a challenge track and define the problem clearly.",
  "Build a polished demo-first interface that can be shown live.",
  "Upload progress checkpoints so judges can review live updates.",
  "Present a simple story: problem, solution, impact, and user experience.",
];

const timeline = [
  { label: "Kickoff", time: "7:30 AM - 8:00 AM", done: true },
  { label: "Ideation + Development", time: "8:00 AM - 11:30 AM", done: true },
  { label: "Lunch Break", time: "11:30 AM - 12:30 PM", done: true },
  { label: "Development Phase 2", time: "12:30 PM - 2:45 PM", done: false },
  { label: "Wrap-Up + Submissions", time: "2:45 PM - 3:00 PM", done: false },
  { label: "Judging + Awards", time: "3:00 PM onward", done: false },
];

function weightedScore(team: (typeof teamsSeed)[number]) {
  return (
    team.technical * weights.technical +
    team.creativity * weights.creativity +
    team.impact * weights.impact +
    team.presentation * weights.presentation +
    team.ux * weights.ux -
    team.helpRequests * 0.15
  );
}

export default function HackathonHomeMockup() {
  const [role, setRole] = useState<"dashboard" | "judge" | "student">(
    "dashboard"
  );
  const [selectedTeam, setSelectedTeam] = useState("Team Nova");
  const [scores, setScores] = useState({
    technical: 8,
    creativity: 8,
    impact: 8,
    presentation: 7,
    ux: 8,
  });
  const [tipCount, setTipCount] = useState(1);
  const [judgeNotes, setJudgeNotes] = useState(
    "Strong concept, polished UI, clear presentation."
  );
  const [studentTaskFilter, setStudentTaskFilter] = useState<
    "all" | "done" | "pending"
  >("all");

  const rankedTeams = useMemo(() => {
    return [...teamsSeed]
      .map((team) => ({
        ...team,
        finalScore: Number(weightedScore(team).toFixed(2)),
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  }, []);

  const judgePreviewScore = useMemo(() => {
    const raw =
      scores.technical * weights.technical +
      scores.creativity * weights.creativity +
      scores.impact * weights.impact +
      scores.presentation * weights.presentation +
      scores.ux * weights.ux;
    return raw.toFixed(2);
  }, [scores]);

  const studentPenalty = tipCount * 2;
  const studentBase = 88;
  const adjustedStudentScore = Math.max(studentBase - studentPenalty, 0);

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

  return (
  <div className="relative min-h-screen overflow-hidden bg-black text-white">
  {/* big background mark */}
  <img
    src={lightningBgUrl}
    alt=""
    className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover opacity-[0.18]"
  />

  {/* lighter overlay for testing */}
  <div className="absolute inset-0 bg-black/40" />

 {/* Right-side repeating banner */}
<div className="pointer-events-none absolute inset-y-0 right-0 hidden xl:block w-[170px]">
  <div
    className="absolute inset-y-6 right-4 w-[145px] opacity-[0.55]"
    style={{
      backgroundImage: `url(${disruptSideBannerUrl})`,
      backgroundRepeat: "repeat-y",
      backgroundPosition: "top center",
      backgroundSize: "145px auto",
    }}
  />
</div>
  <div className="relative z-10 mx-auto flex w-full max-w-[1500px] gap-6 px-4 py-6 lg:px-6 xl:pr-[80px]">
      
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-5 shadow-2xl backdrop-blur lg:block">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF2D6F]">
              Disruptive Innovation
            </p>
            <h1 className="mt-3 text-2xl font-bold">
              ITAP Hackathon Control Center
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Demo-ready workspace for judges, students, and admins.
            </p>
          </div>

          <nav className="space-y-2">
            <SidebarButton
              active={role === "dashboard"}
              icon={<Home className="h-4 w-4" />}
              label="Dashboard"
              onClick={() => setRole("dashboard")}
            />
            <SidebarButton
              active={role === "judge"}
              icon={<UserRoundCog className="h-4 w-4" />}
              label="Judge View"
              onClick={() => setRole("judge")}
            />
            <SidebarButton
              active={role === "student"}
              icon={<GraduationCap className="h-4 w-4" />}
              label="Student View"
              onClick={() => setRole("student")}
            />
            <SidebarButton
              active={false}
              icon={<ClipboardList className="h-4 w-4" />}
              label="Submissions"
              onClick={() => {}}
            />
            <SidebarButton
              active={false}
              icon={<BarChart3 className="h-4 w-4" />}
              label="Analytics"
              onClick={() => {}}
            />
          </nav>

          <div className="mt-8 rounded-2xl border border-[#FF2D6F]/20 bg-[#FF2D6F]/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-[#FF2D6F]">
              <Bell className="h-4 w-4" />
              <span className="font-medium">Tomorrow’s Demo Flow</span>
            </div>
            <ul className="space-y-2 text-sm text-zinc-200">
              <li>1. Open leaderboard</li>
              <li>2. Switch to judge scoring</li>
              <li>3. Show student progress + hints</li>
              <li>4. End with instructions and timeline</li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-4">
                   <img
                    src={diLogoUrl}
                    alt="Disruptive Innovation"
                    className="h-16 w-auto object-contain"
                  /> 
                   <img
                    src={itapLogoUrl}
                    alt="ITAP"
                    className="h-12 w-auto rounded-md bg-white p-1 object-contain"
                  /> 
                </div>

                <div>
                  <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#FF2D6F]">
                    Hackathon Control Center
                  </p>
                  <h2 className="bg-gradient-to-r from-white via-white to-[#FF4D85] bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                    University Hackathon Dashboard
                  </h2>
                  <p className="mt-3 max-w-3xl text-zinc-300">
                    Clean, presentable front end for live judging, student
                    progress, clear instructions, and leaderboard tracking.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[430px]">
                <div className="flex items-center gap-3 rounded-2xl bg-[#111111] px-4 py-3">
                  <Search className="h-4 w-4 text-zinc-400" />
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
                    placeholder="Search teams, judges, or submissions"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#111111] p-2">
                  {[
                    ["dashboard", "Dashboard"],
                    ["judge", "Judge View"],
                    ["student", "Student View"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() =>
                        setRole(value as "dashboard" | "judge" | "student")
                      }
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                        role === value
                          ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
                          : "bg-transparent text-zinc-200 hover:bg-white/10"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Trophy className="h-5 w-5" />}
                label="Leading Team"
                value={rankedTeams[0].name}
                detail={`${rankedTeams[0].finalScore} pts`}
              />
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Active Teams"
                value="12"
                detail="4 currently featured"
              />
              <StatCard
                icon={<ClipboardList className="h-5 w-5" />}
                label="Judge Accounts"
                value="5"
                detail="3 faculty + 2 guests"
              />
              <StatCard
                icon={<Gauge className="h-5 w-5" />}
                label="Live Submissions"
                value="9"
                detail="Updates synced in real time"
              />
            </div>
          </section>

          {role === "dashboard" && (
            <div className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
              <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">Leaderboard</h3>
                    <p className="mt-1 text-sm text-zinc-300">
                      Weighted scores using technical, creativity, impact,
                      presentation, and UX.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#FF2D6F]/15 px-3 py-1 text-sm text-[#FF4D85]">
                    Live ranking
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#111111] text-zinc-300">
                      <tr>
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">Team</th>
                        <th className="px-4 py-3">Progress</th>
                        <th className="px-4 py-3">Help Used</th>
                        <th className="px-4 py-3">Final Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankedTeams.map((team, index) => (
                        <tr
                          key={team.id}
                          className="border-t border-white/10 bg-black/20"
                        >
                          <td className="px-4 py-4 font-semibold text-[#FF2D6F]">
                            #{index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium">{team.name}</div>
                            <div className="text-xs text-zinc-400">
                              Tech {team.technical} · Creativity{" "}
                              {team.creativity} · Impact {team.impact}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="mb-2 h-2 rounded-full bg-zinc-800">
                              <div
                                className="h-2 rounded-full bg-[#FF2D6F] shadow-[0_0_12px_rgba(255,45,111,0.4)]"
                                style={{ width: `${team.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-300">
                              {team.progress}% complete
                            </span>
                          </td>
                          <td className="px-4 py-4 text-zinc-300">
                            {team.helpRequests} tip request(s)
                          </td>
                          <td className="px-4 py-4 text-lg font-semibold text-white">
                            {team.finalScore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="space-y-6">
                <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <Star className="h-5 w-5 text-[#FF2D6F]" />
                    <h3 className="text-xl font-semibold">Judging Weights</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <WeightRow label="Technical Execution" value="30%" />
                    <WeightRow label="Creativity + Innovation" value="25%" />
                    <WeightRow label="Impact + Relevance" value="20%" />
                    <WeightRow
                      label="Presentation + Storytelling"
                      value="15%"
                    />
                    <WeightRow label="User Experience" value="10%" />
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#FF2D6F]" />
                    <h3 className="text-xl font-semibold">Account Types</h3>
                  </div>
                  <div className="space-y-3 text-sm text-zinc-300">
                    <RoleCard
                      title="Judge Account"
                      description="Review teams, score categories, leave feedback, and monitor rankings."
                    />
                    <RoleCard
                      title="Student Account"
                      description="Track milestones, upload progress, view instructions, and request hints."
                    />
                    <RoleCard
                      title="Mentor / Admin"
                      description="Watch submissions, announce updates, and keep the event organized."
                    />
                  </div>
                </section>
              </div>
            </div>
          )}

          {role === "judge" && (
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      Judge Scoring Panel
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300">
                      Review a team, score it live, and preview the weighted
                      result.
                    </p>
                  </div>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#111111] px-4 py-2 text-sm outline-none"
                  >
                    {teamsSeed.map((team) => (
                      <option key={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["technical", "Technical Execution", 30],
                    ["creativity", "Creativity + Innovation", 25],
                    ["impact", "Impact + Relevance", 20],
                    ["presentation", "Presentation + Storytelling", 15],
                    ["ux", "User Experience", 10],
                  ].map(([key, label, weight]) => (
                    <div
                      key={key as string}
                      className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-medium">{label}</span>
                        <span className="text-sm text-[#FF2D6F]">
                          {scores[key as keyof typeof scores]}/10 · {weight}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={scores[key as keyof typeof scores]}
                        onChange={(e) =>
                          setScores((prev) => ({
                            ...prev,
                            [key]: Number(e.target.value),
                          }))
                        }
                        className="w-full accent-[#FF2D6F]"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-2xl bg-[#FF2D6F]/10 p-4 text-pink-50">
                    <div className="text-sm">
                      Weighted preview for {selectedTeam}
                    </div>
                    <div className="mt-1 text-4xl font-bold">
                      {judgePreviewScore}
                    </div>
                    <div className="mt-2 text-sm text-pink-200">
                      Ready for live demo scoring
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
                    <div className="mb-2 font-medium">Judge notes</div>
                    <textarea
                      value={judgeNotes}
                      onChange={(e) => setJudgeNotes(e.target.value)}
                      className="min-h-[124px] w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none"
                    />
                  </div>
                </div>
              </section>

              <div className="space-y-6">
                <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                  <h3 className="text-xl font-semibold">Review Queue</h3>
                  <p className="mt-1 text-sm text-zinc-300">
                    Teams waiting for judge review.
                  </p>
                  <div className="mt-4 space-y-3">
                    {rankedTeams.map((team) => (
                      <div
                        key={team.id}
                        className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="mt-1 text-sm text-zinc-400">
                              {team.status}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedTeam(team.name)}
                            className="rounded-xl bg-[#FF2D6F] px-3 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[28px] border border-[#FF2D6F]/20 bg-[#FF2D6F]/10 p-6 shadow-xl">
                  <div className="mb-3 flex items-center gap-3 text-[#FF4D85]">
                    <MessageSquareWarning className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">
                      Judge Presentation Notes
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-pink-100/90">
                    <li>• Show weighted scoring clearly.</li>
                    <li>• Emphasize fairness and consistent criteria.</li>
                    <li>• Mention live notes and review queue.</li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {role === "student" && (
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      Student Progress + Coaching
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300">
                      Track milestones, show progress clearly, and demonstrate
                      smart hints with score deductions.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#FF2D6F]/15 px-3 py-1 text-sm text-[#FF4D85]">
                    Team Nova
                  </span>
                </div>

                <div className="mb-4 flex w-fit gap-2 rounded-2xl bg-[#1A1A1A] p-2">
                  {[
                    ["all", "All"],
                    ["done", "Completed"],
                    ["pending", "Pending"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() =>
                        setStudentTaskFilter(
                          value as "all" | "done" | "pending"
                        )
                      }
                      className={`rounded-xl px-4 py-2 text-sm ${
                        studentTaskFilter === value
                          ? "bg-[#FF2D6F] font-semibold text-white"
                          : "text-zinc-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {studentTasks.map((task) => (
                    <div
                      key={task.label}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4"
                    >
                      {task.done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      ) : (
                        <CircleDashed className="h-5 w-5 text-zinc-400" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{task.label}</div>
                        <div className="text-xs text-zinc-400">
                          {task.done ? "Completed" : "In progress"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="space-y-6">
                <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                  <div className="mb-2 flex items-center gap-2 text-[#FF4D85]">
                    <Lightbulb className="h-4 w-4" />
                    <span className="font-medium">Smart Hint System</span>
                  </div>
                  <p className="text-sm text-zinc-300">
                    Students can request guided hints when stuck, but each
                    request deducts points to encourage independent
                    problem-solving.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-[#1A1A1A] p-3">
                      <div className="text-zinc-400">Hints used</div>
                      <div className="mt-1 text-xl font-bold">{tipCount}</div>
                    </div>
                    <div className="rounded-xl bg-[#1A1A1A] p-3">
                      <div className="text-zinc-400">Point deduction</div>
                      <div className="mt-1 text-xl font-bold text-[#FF4D85]">
                        -{studentPenalty}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setTipCount((prev) => Math.min(prev + 1, 3))}
                    className="mt-4 w-full rounded-xl bg-[#FF2D6F] px-4 py-3 font-semibold text-white shadow-[0_0_20px_rgba(255,45,111,0.35)] transition hover:opacity-90"
                  >
                    Request AI Mentor Hint
                  </button>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
                  <div className="text-sm text-emerald-200">
                    Projected score after deductions
                  </div>
                  <div className="mt-1 text-4xl font-bold">
                    {adjustedStudentScore}
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Penalty system shown for demo only.
                  </div>
                </section>
              </div>
            </div>
          )}

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
              <div className="mb-5 flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-[#FF2D6F]" />
                <div>
                  <h3 className="text-2xl font-semibold">
                    Clear Instructions
                  </h3>
                  <p className="text-sm text-zinc-300">
                    Simple guidance everyone can scan quickly during the
                    presentation.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {instructions.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4"
                  >
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
                  <p className="text-sm text-zinc-300">
                    A polished timeline block for the presentation demo.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {timeline.map((step) => (
                  <div
                    key={step.label}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4"
                  >
                    {step.done ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                    ) : (
                      <CircleDashed className="mt-0.5 h-5 w-5 text-zinc-400" />
                    )}
                    <div>
                      <div className="font-medium">{step.label}</div>
                      <div className="text-sm text-zinc-400">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SidebarButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
        active
          ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
          : "bg-[#1A1A1A] text-zinc-200 hover:bg-white/10"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-4 shadow-[0_0_16px_rgba(255,45,111,0.06)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF2D6F]/15 text-[#FF2D6F]">
        {icon}
      </div>
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-zinc-300">{detail}</div>
    </div>
  );
}

function WeightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1A1A1A] px-4 py-3">
      <span>{label}</span>
      <span className="font-semibold text-[#FF2D6F]">{value}</span>
    </div>
  );
}

function RoleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
      <div className="font-medium text-white">{title}</div>
      <div className="mt-1 text-zinc-400">{description}</div>
    </div>
  );
}
