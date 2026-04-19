import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Sidebar from "../components/Sidebar";
import PageHero from "../components/PageHero";
import {
  Trophy,
  Zap,
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
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
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

export default function DashboardView() {
  const role =
    (localStorage.getItem("role") as "admin" | "judge" | "student") ||
    "student";
  const teamName = localStorage.getItem("teamName");

  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetch("/api/team/events/")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
    
    fetch("/api/team/teams/")
      .then((r) => r.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => Number(b.score) - Number(a.score));
        setTeams(sorted);
        if (teamName) {
          const found = sorted.find((t: any) => t.name === teamName);
          if (found) setMyTeam(found);
        }
      })
      .catch(() => {});
  }, [teamName]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const activeEvent = events.find((e) => isEventActive(e, now));
  const timeRemaining = activeEvent ? getTimeRemaining(activeEvent, now) : null;
  const leaderboard = teams.slice(0, 5);

  return (
    <AppLayout>
      <Sidebar active="dashboard" role={role} />

      <main className="flex-1 space-y-6">
        <PageHero
          title="Hackathon Hub"
          subtitle="Live standings and event control center."
          active="dashboard"
          role={role}
        />

        {/* Hero Banner Section - More Prominent Info */}
        <section className="grid gap-6 xl:grid-cols-[1fr_0.45fr]">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-[#FF2D6F] fill-[#FF2D6F]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF2D6F]">Live Event Control</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    {activeEvent?.label || "Hackathon Hub"}
                  </h2>
                  <p className="mt-2 text-zinc-400 font-medium">
                    {activeEvent ? "Current phase is active and live." : "No active phase at the moment."}
                  </p>
                </div>
                
                {timeRemaining && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:text-right min-w-[180px]">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Time Remaining</div>
                    <div className="text-3xl font-black tabular-nums text-[#FF2D6F] tracking-tight">{timeRemaining}</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Status</div>
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Teams</div>
                  <div className="font-bold text-white text-sm">{teams.length} Active</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Phases</div>
                  <div className="font-bold text-white text-sm">{events.filter(e => isEventDone(e, now)).length}/{events.length}</div>
                </div>
                {role === "student" && myTeam && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Mentor</div>
                    <div className="font-bold text-white text-sm truncate">{myTeam.mentor_name || 'TBD'}</div>
                  </div>
                )}
                {(role !== "student" || !myTeam) && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Role</div>
                    <div className="font-bold text-white text-sm capitalize">{role}</div>
                  </div>
                )}
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF2D6F]/10 blur-[100px]" />
          </div>

          {/* Clean Leaderboard */}
          <section className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl backdrop-blur flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-black uppercase tracking-tighter text-white">
                <Trophy className="h-5 w-5 text-amber-400" />
                Live Standings
              </h3>
              <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Real-time</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {leaderboard.length > 0 ? (
                leaderboard.map((team, i) => (
                  <div key={team.id} className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black ${
                        i === 0 ? "bg-amber-400/20 text-amber-400 border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : 
                        i === 1 ? "bg-zinc-400/20 text-zinc-300 border border-zinc-400/50" :
                        i === 2 ? "bg-orange-400/20 text-orange-400 border border-orange-400/50" : "bg-white/5 text-zinc-400"
                      }`}>
                        {i < 3 ? (
                          <div className="relative flex items-center justify-center">
                            <Trophy className={`h-5 w-5 ${
                              i === 0 ? "fill-amber-400" : i === 1 ? "fill-zinc-300" : "fill-orange-400"
                            }`} />
                            <span className="absolute pb-1.5 text-[10px] font-black text-black">
                              {i + 1}
                            </span>
                          </div>
                        ) : (i + 1)}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight">{team.name}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          {i === 0 ? "1st Place" : i === 1 ? "2nd Place" : i === 2 ? "3rd Place" : `Rank ${i+1}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg font-black text-[#FF2D6F]">{Number(team.score).toFixed(0)}</span>
                      <span className="text-[10px] font-bold text-[#FF2D6F]/60">%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="rounded-full bg-white/5 p-4 mb-3">
                    <Trophy className="h-8 w-8 text-zinc-700" />
                  </div>
                  <p className="text-sm text-zinc-500 italic">Leaderboard is empty.<br/>Judging hasn't started.</p>
                </div>
              )}
            </div>
            <button 
              className="mt-6 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 transition-all"
              onClick={() => window.location.href = role === 'judge' ? '/judge/' : '#'}
            >
              View Full Standings
            </button>
          </section>
        </section>
      </main>
    </AppLayout>
  );
}
