import { CheckCircle2, CircleDashed, User, ShieldCheck, Rocket, Users, UserRoundCog } from "lucide-react";

type StudentTask = {
  id: number;
  label: string;
  is_done: boolean;
};

export default function StudentSection({
  studentTaskFilter,
  setStudentTaskFilter,
  studentTasks,
  userProfile,
  myTeam,
  teamMembers,
  onToggleTask,
}: {
  studentTaskFilter: "all" | "done" | "pending";
  setStudentTaskFilter: (
    value: "all" | "done" | "pending"
  ) => void;
  studentTasks: StudentTask[];
  userProfile: any;
  myTeam: any;
  teamMembers: any[];
  onToggleTask: (taskId: number, currentStatus: boolean) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              Project Progress
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Track your team milestones. Click a task to toggle completion.
            </p>
          </div>
          {myTeam && (
            <span className="rounded-full bg-[#FF2D6F]/15 px-4 py-1.5 text-sm font-bold text-[#FF4D85] border border-[#FF2D6F]/20">
              {myTeam.name}
            </span>
          )}
        </div>

        <div className="mb-6 flex w-fit gap-2 rounded-2xl bg-[#1A1A1A] p-1.5">
          {[
            ["all", "All Tasks"],
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
              className={`rounded-xl px-5 py-2 text-sm font-medium transition-all ${
                studentTaskFilter === value
                  ? "bg-[#FF2D6F] text-white shadow-lg shadow-[#FF2D6F]/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {studentTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onToggleTask(task.id, task.is_done)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                task.is_done 
                  ? "border-emerald-500/20 bg-emerald-500/[0.04]" 
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              {task.is_done ? (
                <div className="rounded-full bg-emerald-500/20 p-1 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
              ) : (
                <div className="rounded-full bg-white/5 p-1">
                  <CircleDashed className="h-5 w-5 text-zinc-500" />
                </div>
              )}
              <div className="flex-1">
                <div className={`font-semibold ${task.is_done ? "text-emerald-50" : "text-zinc-200"}`}>
                  {task.label}
                </div>
                <div className="text-xs text-zinc-500">
                  {task.is_done ? "Requirement met" : "Click to complete"}
                </div>
              </div>
            </button>
          ))}
          {studentTasks.length === 0 && (
            <div className="py-8 text-center text-zinc-500 text-sm italic">
              No tasks found for this filter.
            </div>
          )}
        </div>
      </section>

      <div className="space-y-6">
        {/* Account Info */}
        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#FF2D6F]/10 p-3">
              <User className="h-5 w-5 text-[#FF2D6F]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Profile</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-black">Account Details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Full Name</div>
              <div className="text-white font-semibold flex items-center gap-2">
                {userProfile?.full_name || "Guest Student"}
                <ShieldCheck className="h-3 w-3 text-[#FF2D6F]" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Username</div>
              <div className="text-zinc-300 font-mono text-sm">@{userProfile?.username || "unknown"}</div>
            </div>
          </div>
        </section>

        {/* Team Info */}
        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-sky-500/10 p-3">
              <Rocket className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Team {myTeam?.name || "Unassigned"}</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-black">Workspace Info</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Users className="h-3 w-3 text-sky-400" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Team Members</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {teamMembers.length > 0 ? teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 rounded-xl bg-sky-500/5 border border-sky-500/10 px-3 py-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                    <span className="text-xs text-sky-100 font-medium">{member.full_name || member.username}</span>
                  </div>
                )) : (
                  <p className="text-xs text-zinc-500 italic px-1">No other members found.</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest mb-0.5">Assigned Mentor</div>
                  <div className="text-amber-100 text-sm font-bold">{myTeam?.mentor_name || "Awaiting Assignment"}</div>
                </div>
                <UserRoundCog className="h-5 w-5 text-amber-500/40" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}