import { MessageSquareWarning, ChevronDown, ChevronUp, User, Star } from "lucide-react";
import { useState } from "react";

type Scores = {
  technical: number;
  creativity: number;
  impact: number;
  presentation: number;
  ux: number;
};

export default function JudgeSection({
  selectedTeam,
  selectedTeamId,
  setSelectedTeam,
  teamsSeed,
  scores,
  setScores,
  judgePreviewScore,
  judgeNotes,
  setJudgeNotes,
  rankedTeams,
  onSubmit,
  isSubmitting,
}: {
  selectedTeam: string;
  selectedTeamId?: number;
  setSelectedTeam: (team: string, id?: number) => void;
  teamsSeed: any[];
  scores: Scores;
  setScores: React.Dispatch<React.SetStateAction<Scores>>;
  judgePreviewScore: string;
  judgeNotes: string;
  setJudgeNotes: React.Dispatch<React.SetStateAction<string>>;
  rankedTeams: any[];
  onSubmit?: () => void;
  isSubmitting?: boolean;
}) {
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const previewPercentage = (Number(judgePreviewScore) * 20).toFixed(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Judge Scoring Panel</h3>
            <p className="mt-1 text-sm text-zinc-300">
              Review a team, score it live (1-5), and see the percentage result.
            </p>
          </div>
          <select
            value={selectedTeamId || ""}
            onChange={(e) => {
              const teamId = Number(e.target.value);
              const team = teamsSeed.find(t => t.id === teamId);
              if (team) {
                setSelectedTeam(team.name, team.id);
              }
            }}
            className="rounded-xl border border-white/10 bg-[#111111] px-4 py-2 text-sm outline-none focus:ring-2 ring-[#FF2D6F]/20"
          >
            <option value="" disabled>Select a team</option>
            {teamsSeed.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
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
                <span className="text-sm text-[#FF2D6F] font-bold">
                  {scores[key as keyof Scores]}/5
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={scores[key as keyof Scores]}
                onChange={(e) =>
                  setScores((prev) => ({
                    ...prev,
                    [key]: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#FF2D6F]"
              />
              <div className="mt-1 flex justify-between text-[10px] text-zinc-500 uppercase tracking-tighter">
                <span>Poor</span>
                <span>Weight: {weight}%</span>
                <span>Excellent</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl bg-[#FF2D6F]/10 p-4 text-pink-50 border border-[#FF2D6F]/20 flex flex-col justify-between">
            <div>
              <div className="text-sm font-medium opacity-80">Calculated Score for {selectedTeam || '...'}</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">{previewPercentage}</span>
                <span className="text-xl font-bold opacity-60">%</span>
              </div>
            </div>
            <button
              onClick={onSubmit}
              disabled={isSubmitting || !selectedTeamId}
              className="mt-4 w-full rounded-xl bg-[#FF2D6F] py-3 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(255,45,111,0.35)] hover:bg-[#FF4D85] disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? "Submitting..." : "Submit Final Score"}
            </button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
            <div className="mb-2 font-medium flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4 text-[#FF2D6F]" />
              Judge Private Notes
            </div>
            <textarea
              value={judgeNotes}
              onChange={(e) => setJudgeNotes(e.target.value)}
              placeholder="Add your internal feedback here..."
              className="min-h-[124px] w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none focus:border-[#FF2D6F]/50 transition-colors"
            />
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            Ranked Teams Detail
          </h3>
          <p className="mt-1 text-sm text-zinc-300">
            Click a team to see individual judge breakdown.
          </p>
          <div className="mt-4 space-y-3">
            {rankedTeams.map((team) => (
              <div
                key={team.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  expandedTeam === team.id ? 'border-[#FF2D6F]/50 bg-[#1A1A1A]' : 'border-white/10 bg-[#1A1A1A]'
                }`}
              >
                <div 
                  className="flex items-center justify-between gap-3 p-4 cursor-pointer hover:bg-white/5"
                  onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                >
                  <div className="flex-1">
                    <div className="font-bold flex items-center gap-2">
                      {team.name}
                      {team.id === selectedTeamId && <span className="text-[10px] bg-[#FF2D6F] text-white px-1.5 py-0.5 rounded uppercase">Current</span>}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {team.judges_count} {team.judges_count === 1 ? 'judge' : 'judges'} participated
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#FF2D6F]">{Number(team.score).toFixed(0)}%</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Average</div>
                  </div>
                  {expandedTeam === team.id ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
                </div>

                {expandedTeam === team.id && (
                  <div className="px-4 pb-4 border-t border-white/5 bg-black/20">
                    <div className="pt-4 space-y-4">
                      {team.judgings && team.judgings.length > 0 ? (
                        team.judgings.map((j: any, idx: number) => (
                          <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                                <User className="h-3 w-3 text-[#FF2D6F]" />
                                {j.judge_name}
                              </div>
                              <div className="text-xs font-black text-[#FF2D6F] bg-[#FF2D6F]/10 px-2 py-0.5 rounded">
                                {Number(j.weighted_score).toFixed(0)}%
                              </div>
                            </div>
                            <div className="grid grid-cols-5 gap-1 text-[9px] uppercase font-bold text-zinc-500 mb-2">
                              <div className="text-center">Tech: {j.technical}</div>
                              <div className="text-center">Cre: {j.creativity}</div>
                              <div className="text-center">Imp: {j.impact}</div>
                              <div className="text-center">Pre: {j.presentation}</div>
                              <div className="text-center">UX: {j.ux}</div>
                            </div>
                            {j.notes && (
                              <div className="text-xs italic text-zinc-400 border-t border-white/5 pt-2 mt-2">
                                "{j.notes}"
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-2 text-sm text-zinc-500 italic">
                          No judge submissions yet.
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeam(team.name, team.id);
                        }}
                        className="w-full mt-2 rounded-xl bg-white text-black py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                      >
                        Score this team
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#FF2D6F]/20 bg-[#FF2D6F]/10 p-6 shadow-xl">
          <div className="mb-3 flex items-center gap-3 text-[#FF4D85]">
            <MessageSquareWarning className="h-5 w-5" />
            <h3 className="text-xl font-semibold text-pink-50">Scoring Guidelines</h3>
          </div>
          <ul className="space-y-2 text-sm text-pink-100/90">
            <li>• Use the sliders (1-5) to rate each category.</li>
            <li>• Final percentage is automatically calculated based on weights.</li>
            <li>• Team average is the mean of all judge percentages.</li>
            <li>• Private notes are only visible to other judges and admins.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
