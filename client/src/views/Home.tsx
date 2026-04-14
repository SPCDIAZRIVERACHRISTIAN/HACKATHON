import React, { useMemo, useState } from "react";
import StudentSection from "../components/StudentSection";
import JudgeSection from "../components/JudgeSection";
import StatCard from "../components/StatCard";
import DashboardSection from "../components/DashboardSection";
import SidebarButton from "../components/SidebarButton";
import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";
import lightningBgUrl from "../assets/lightning-bg.png";
import disruptSideBannerUrl from "../assets/disrupt-side-banner.png";
import {
  BookOpen,
  Lightbulb,
  TimerReset,
  ChevronRight,
  CheckCircle2,
  CircleDashed,
  MessageSquareWarning,
  Home,
  BarChart3,
  UserRoundCog,
  GraduationCap,
  Bell,
  Search,
  Trophy,
  Users,
  ClipboardList,
  Gauge,
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
  <div className="relative z-10 mx-auto flex w-full max-w-[1500px] gap-6 px-4 py-6 lg:px-6 xl:pr-[100px]">
      
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
  <DashboardSection rankedTeams={rankedTeams} />
)}
         {role === "judge" && (
  <JudgeSection
    selectedTeam={selectedTeam}
    setSelectedTeam={setSelectedTeam}
    teamsSeed={teamsSeed}
    scores={scores}
    setScores={setScores}
    judgePreviewScore={judgePreviewScore}
    judgeNotes={judgeNotes}
    setJudgeNotes={setJudgeNotes}
    rankedTeams={rankedTeams}
  />
)}

        {role === "student" && (
  <StudentSection
    studentTaskFilter={studentTaskFilter}
    setStudentTaskFilter={setStudentTaskFilter}
    studentTasks={studentTasks}
    tipCount={tipCount}
    setTipCount={setTipCount}
    studentPenalty={studentPenalty}
    adjustedStudentScore={adjustedStudentScore}
  />
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


