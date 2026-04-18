import { useEffect, useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import AppLayout from "../components/AppLayout";
import Sidebar from "../components/Sidebar";
import StudentSection from "../components/StudentSection";
import StatCard from "../components/StatCard";
import { apiFetch } from "../utils/api";
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
} from "lucide-react";

type BackendTeam = {
  id: number;
  name: string;
  project_name?: string;
  score?: string | number;
};

type UiTeam = {
  id: number;
  name: string;
  technical: number;
  creativity: number;
  impact: number;
  presentation: number;
  ux: number;
  progress: number;
  helpRequests: number;
  status: string;
};

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

function weightedScore(team: UiTeam) {
  return (
    team.technical * weights.technical +
    team.creativity * weights.creativity +
    team.impact * weights.impact +
    team.presentation * weights.presentation +
    team.ux * weights.ux -
    team.helpRequests * 0.15
  );
}

function mapTeamToUi(team: BackendTeam): UiTeam {
  const rawScore = Number(team.score ?? 0);

  return {
    id: team.id,
    name: team.name,
    technical: Math.max(Math.min(Math.round(rawScore) || 7, 10), 1),
    creativity: 8,
    impact: 8,
    presentation: 8,
    ux: 8,
    progress: rawScore > 0 ? Math.min(rawScore * 10, 100) : 65,
    helpRequests: 0,
    status: team.project_name?.trim() ? "Project assigned" : "Awaiting project",
  };
}

export default function StudentView() {
  const [teams, setTeams] = useState<UiTeam[]>([]);
  const [tipCount, setTipCount] = useState(1);
  const [studentTaskFilter, setStudentTaskFilter] = useState<
    "all" | "done" | "pending"
  >("all");

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await apiFetch("/api/teams/");
        if (!response.ok) throw new Error("Failed to load teams");

        const data = await response.json();
        const normalized = Array.isArray(data) ? data.map(mapTeamToUi) : [];
        setTeams(normalized);
      } catch (error) {
        console.error("Error loading teams:", error);
        setTeams([]);
      }
    };

    loadTeams();
  }, []);

  const rankedTeams = useMemo(() => {
    return [...teams]
      .map((team) => ({
        ...team,
        finalScore: Number(weightedScore(team).toFixed(2)),
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  }, [teams]);

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

  const role =
    (localStorage.getItem("role") as "admin" | "judge" | "student") ||
    "student";

  return (
    <AppLayout>
      <Sidebar active="student" role={role} />

      <main className="flex-1 space-y-6">
        <PageHero title="University Hackathon Student Portal" active="student" role={role} />

        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Trophy className="h-5 w-5" />}
              label="Leading Team"
              value={rankedTeams[0]?.name || "No teams yet"}
              detail={rankedTeams[0] ? `${rankedTeams[0].finalScore} pts` : "Waiting for data"}
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Active Teams"
              value={String(teams.length)}
              detail="Live from database"
            />
            <StatCard
              icon={<ClipboardList className="h-5 w-5" />}
              label="Judge Accounts"
              value="5"
              detail="Static for now"
            />
            <StatCard
              icon={<Gauge className="h-5 w-5" />}
              label="Live Submissions"
              value={String(teams.filter((team) => team.progress > 0).length)}
              detail="Derived from team records"
            />
          </div>
        </section>

        <StudentSection
          teams={teams}
          studentTaskFilter={studentTaskFilter}
          setStudentTaskFilter={setStudentTaskFilter}
          studentTasks={studentTasks}
          tipCount={tipCount}
          setTipCount={setTipCount}
          studentPenalty={studentPenalty}
          adjustedStudentScore={adjustedStudentScore}
        />

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#FF2D6F]" />
              <div>
                <h3 className="text-2xl font-semibold">Clear Instructions</h3>
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
    </AppLayout>
  );
}
