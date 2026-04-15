import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import AppLayout from "../components/AppLayout";
import Sidebar from "../components/Sidebar";
import JudgeSection from "../components/JudgeSection";
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

export default function JudgeView() {
  const [selectedTeam, setSelectedTeam] = useState("Team Nova");
  const [scores, setScores] = useState({
    technical: 8,
    creativity: 8,
    impact: 8,
    presentation: 7,
    ux: 8,
  });
  const [judgeNotes, setJudgeNotes] = useState(
    "Strong concept, polished UI, clear presentation."
  );

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

  return (
    <AppLayout>
      <Sidebar active="judge" />

      <main className="flex-1 space-y-6">
        <PageHero title="University Hackathon Judge Portal" active="judge"/>

        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
