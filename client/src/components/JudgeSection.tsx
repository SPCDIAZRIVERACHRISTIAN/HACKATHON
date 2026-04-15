import { MessageSquareWarning } from "lucide-react";

type Team = {
  id: number;
  name: string;
  status: string;
};

type Scores = {
  technical: number;
  creativity: number;
  impact: number;
  presentation: number;
  ux: number;
};

export default function JudgeSection({
  selectedTeam,
  setSelectedTeam,
  teamsSeed,
  scores,
  setScores,
  judgePreviewScore,
  judgeNotes,
  setJudgeNotes,
  rankedTeams,
}: {
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  teamsSeed: Team[];
  scores: Scores;
  setScores: React.Dispatch<React.SetStateAction<Scores>>;
  judgePreviewScore: string;
  judgeNotes: string;
  setJudgeNotes: React.Dispatch<React.SetStateAction<string>>;
  rankedTeams: Team[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Judge Scoring Panel</h3>
            <p className="mt-1 text-sm text-zinc-300">
              Review a team, score it live, and preview the weighted result.
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
                  {scores[key as keyof Scores]}/10 · {weight}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={scores[key as keyof Scores]}
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
            <div className="text-sm">Weighted preview for {selectedTeam}</div>
            <div className="mt-1 text-4xl font-bold">{judgePreviewScore}</div>
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
            <h3 className="text-xl font-semibold">Judge Presentation Notes</h3>
          </div>
          <ul className="space-y-2 text-sm text-pink-100/90">
            <li>• Show weighted scoring clearly.</li>
            <li>• Emphasize fairness and consistent criteria.</li>
            <li>• Mention live notes and review queue.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}