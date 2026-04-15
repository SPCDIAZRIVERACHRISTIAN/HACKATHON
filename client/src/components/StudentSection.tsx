import { Lightbulb, CheckCircle2, CircleDashed } from "lucide-react";

type StudentTask = {
  label: string;
  done: boolean;
};

export default function StudentSection({
  studentTaskFilter,
  setStudentTaskFilter,
  studentTasks,
  tipCount,
  setTipCount,
  studentPenalty,
  adjustedStudentScore,
}: {
  studentTaskFilter: "all" | "done" | "pending";
  setStudentTaskFilter: (
    value: "all" | "done" | "pending"
  ) => void;
  studentTasks: StudentTask[];
  tipCount: number;
  setTipCount: React.Dispatch<React.SetStateAction<number>>;
  studentPenalty: number;
  adjustedStudentScore: number;
}) {
  return (
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
  );
}