import { useMemo, useState, useEffect } from "react";
import PageHero from "../components/PageHero";
import AppLayout from "../components/AppLayout";
import Sidebar from "../components/Sidebar";
import JudgeSection from "../components/JudgeSection";
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

const weights = {
  technical: 0.3,
  creativity: 0.25,
  impact: 0.2,
  presentation: 0.15,
  ux: 0.1,
};

const instructions = [
  "Technical Execution (30%): Code quality, complexity, and stability.",
  "Creativity & Innovation (25%): Originality and uniqueness of the solution.",
  "Impact & Relevance (20%): How well it solves the chosen problem.",
  "Presentation (15%): Clarity, storytelling, and demo quality.",
  "User Experience (10%): UI design, intuitiveness, and polish.",
];

export default function JudgeView() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState({
    technical: 3,
    creativity: 3,
    impact: 3,
    presentation: 3,
    ux: 3,
  });
  const [judgeNotes, setJudgeNotes] = useState("");
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    fetchTeams();
    fetchEvents();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/team/teams/");
      const data = await res.json();
      setTeams(data);
      if (data.length > 0 && !selectedTeamId) {
        setSelectedTeam(data[0].name);
        setSelectedTeamId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch teams", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/team/events/");
      const data = await res.json();
      setTimeline(data.map((e: any) => ({
        label: e.label,
        time: `${new Date(e.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
        done: new Date(e.start_time) < new Date()
      })));
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTeamId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/team/teams/${selectedTeamId}/submit-score/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...scores, notes: judgeNotes }),
      });
      if (res.ok) {
        await fetchTeams();
        alert("Score submitted successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to submit score");
      }
    } catch (err) {
      alert("Error submitting score");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await apiFetch("/api/teams/");
        if (!response.ok) throw new Error("Failed to load teams");

        const data = await response.json();
        const normalized = Array.isArray(data) ? data.map(mapTeamToUi) : [];
        setTeams(normalized);

        if (normalized.length > 0) {
          setSelectedTeam(normalized[0].name);
        }
      } catch (error) {
        console.error("Error loading teams:", error);
        setTeams([]);
      }
    };

    loadTeams();
  }, []);

  const rankedTeams = useMemo(() => {
    return [...teams].sort((a, b) => Number(b.score) - Number(a.score));
  }, [teams]);

  const judgePreviewScore = useMemo(() => {
    const raw =
      scores.technical * weights.technical +
      scores.creativity * weights.creativity +
      scores.impact * weights.impact +
      scores.presentation * weights.presentation +
      scores.ux * weights.ux;
    return raw.toFixed(2);
  }, [scores]);

  const role = (localStorage.getItem("role") as any) || "judge";

  return (
    <AppLayout>
      <Sidebar active="judge" role={role} />

      <main className="flex-1 space-y-6">
        <PageHero title="University Hackathon Judge Portal" active="judge" role={role} />

        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Trophy className="h-5 w-5" />}
              label="Leading Team"
              value={rankedTeams[0]?.name || "N/A"}
              detail={rankedTeams[0] ? `${Number(rankedTeams[0].score).toFixed(0)}% Average` : "No scores yet"}
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Active Teams"
              value={teams.length.toString()}
              detail="Participating teams"
            />
            <StatCard
              icon={<ClipboardList className="h-5 w-5" />}
              label="Judge Accounts"
              value="Live"
              detail="Synced in real time"
            />
            <StatCard
              icon={<Gauge className="h-5 w-5" />}
              label="Scoring Scale"
              value="1 - 5"
              detail="Weighted results"
            />
          </div>
        </section>

        <JudgeSection
          selectedTeam={selectedTeam}
          selectedTeamId={selectedTeamId}
          setSelectedTeam={(name, id) => {
            setSelectedTeam(name);
            setSelectedTeamId(id);
          }}
          teamsSeed={teams}
          scores={scores}
          setScores={setScores}
          judgePreviewScore={judgePreviewScore}
          judgeNotes={judgeNotes}
          setJudgeNotes={setJudgeNotes}
          rankedTeams={rankedTeams}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#FF2D6F]" />
              <div>
                <h3 className="text-2xl font-semibold">Judging Criteria</h3>
                <p className="text-sm text-zinc-300">
                  Weighted breakdown for awarding points (1-5).
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
                  Today's schedule and milestones.
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
