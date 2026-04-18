import AppLayout from "../components/AppLayout";
import Sidebar from "../components/Sidebar";
import PageHero from "../components/PageHero";
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
  Rocket,
  Lightbulb,
  MessageSquare,
  Zap,
} from "lucide-react";
import StatCard from "../components/StatCard";

const timeline = [
  { label: "Kickoff", time: "7:30 AM - 8:00 AM", done: true },
  { label: "Ideation + Development", time: "8:00 AM - 11:30 AM", done: true },
  { label: "Lunch Break", time: "11:30 AM - 12:30 PM", done: true },
  { label: "Development Phase 2", time: "12:30 PM - 2:45 PM", done: false },
  { label: "Wrap-Up + Submissions", time: "2:45 PM - 3:00 PM", done: false },
  { label: "Judging + Awards", time: "3:00 PM onward", done: false },
];

const announcements = [
  {
    title: "Submission Deadline Extended",
    detail: "Final submissions now due at 3:15 PM. Use the extra time wisely!",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Judging Criteria Published",
    detail:
      "Technical (30%), Creativity (25%), Impact (20%), Presentation (15%), UX (10%).",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Mentors Available",
    detail:
      "Industry mentors are available in the breakout rooms for quick feedback sessions.",
    icon: <MessageSquare className="h-5 w-5" />,
  },
];

const quickTips = [
  "Focus on a working demo over feature completeness.",
  "Practice your pitch — judges score presentation too.",
  "Commit early and often to avoid last-minute surprises.",
  "Use the hint system if you're stuck — small deductions beat wasted time.",
];

export default function DashboardView() {
  const role =
    (localStorage.getItem("role") as "admin" | "judge" | "student") ||
    "student";

  return (
    <AppLayout>
      <Sidebar active="dashboard" role={role} />

      <main className="flex-1 space-y-6">
        <PageHero
          title="Welcome to the Hackathon"
          subtitle="Your central hub for event updates, schedule, announcements, and quick links. Navigate to your role-specific view from the sidebar or tabs above."
          active="dashboard"
          role={role}
        />

        <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Trophy className="h-5 w-5" />}
              label="Event Status"
              value="In Progress"
              detail="Development Phase 2"
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

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <Rocket className="h-5 w-5 text-[#FF2D6F]" />
              <div>
                <h3 className="text-2xl font-semibold">Announcements</h3>
                <p className="text-sm text-zinc-300">
                  Latest updates from the organizers.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {announcements.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4"
                >
                  <div className="mt-0.5 text-[#FF2D6F]">{item.icon}</div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-300">{item.detail}</p>
                  </div>
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
                  Today's schedule at a glance.
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

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-[#FF2D6F]" />
              <div>
                <h3 className="text-2xl font-semibold">Quick Tips</h3>
                <p className="text-sm text-zinc-300">
                  Advice to make the most of the event.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {quickTips.map((tip) => (
                <div
                  key={tip}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4"
                >
                  <ChevronRight className="mt-0.5 h-4 w-4 text-[#FF2D6F]" />
                  <p className="text-zinc-200">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#FF2D6F]" />
              <div>
                <h3 className="text-2xl font-semibold">How It Works</h3>
                <p className="text-sm text-zinc-300">
                  Understanding the platform.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
                <p className="font-medium text-white">For Students</p>
                <p className="mt-1 text-sm text-zinc-300">
                  Track your milestones, request hints when stuck, and submit
                  your project from the Student View.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
                <p className="font-medium text-white">For Judges</p>
                <p className="mt-1 text-sm text-zinc-300">
                  Score teams across five categories, leave notes, and see the
                  live leaderboard from the Judge View.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
                <p className="font-medium text-white">For Admins</p>
                <p className="mt-1 text-sm text-zinc-300">
                  Full access to all views, team management, and platform
                  oversight from the Admin panel.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
