import WeightRow from "./WeightRow";
import RoleCard from "./RoleCard";
import { Star, ShieldCheck } from "lucide-react";

export default function DashboardSection({
  rankedTeams,
}: {
  rankedTeams: any[];
}) {
  return (
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
                      Tech {team.technical} · Creativity {team.creativity} ·
                      Impact {team.impact}
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
            <WeightRow label="Presentation + Storytelling" value="15%" />
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
  );
}