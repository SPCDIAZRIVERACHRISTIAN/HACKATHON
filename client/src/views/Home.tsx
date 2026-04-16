
import {
  ArrowRight,
  ShieldCheck,
  Trophy,
  Users,
  BarChart3,
  GraduationCap,
  UserRoundCog,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";

const features = [
  {
    title: "Live Dashboard",
    description:
      "Track teams, scores, progress, and submissions from one central view.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    title: "Judge Workflow",
    description:
      "Allow judges to review projects, score teams, and leave notes clearly.",
    icon: <UserRoundCog className="h-6 w-6" />,
  },
  {
    title: "Student Experience",
    description:
      "Give participants a clean way to follow tasks, milestones, and updates.",
    icon: <GraduationCap className="h-6 w-6" />,
  },
];

const roles = [
  {
    title: "Admin",
    description: "Access all views, manage the platform, and oversee activity.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Judge",
    description: "Access the dashboard and judging tools for project evaluation.",
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    title: "Student",
    description:
      "Access the dashboard and student workspace during the hackathon.",
    icon: <Users className="h-5 w-5" />,
  },
];

export default function Home() {
  return (
    <AppLayout>
      <main className="w-full space-y-8">
        <section className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <img
                  src={diLogoUrl}
                  alt="Disruptive Innovation"
                  className="h-16 w-auto object-contain"
                />
                <img
                  src={itapLogoUrl}
                  alt="ITAP"
                  className="h-12 w-auto rounded-md bg-white p-1 object-contain"
                />
              </div>

              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#FF2D6F]">
                ITAP Hackathon Platform
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                A centralized hackathon experience for admins, judges, and
                students
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
                This project provides a polished platform for running a
                university hackathon with role-based access, live dashboards,
                judge scoring flows, and student progress tracking. It is built
                to make the event easier to manage and more professional to
                present.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
               <a
  href="/login/"
  className="inline-flex items-center gap-2 rounded-2xl bg-[#FF2D6F] px-5 py-3 font-medium text-white transition hover:scale-[1.02]"
>
  Go to Login
  <ArrowRight className="h-4 w-4" />
</a>

<a
  href="/dashboard/"
  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
>
  Preview Dashboard
</a>
              </div>
            </div>

            <div className="grid min-w-[280px] gap-4 sm:grid-cols-3 xl:grid-cols-1 xl:min-w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">
                <p className="text-sm text-zinc-400">Users</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  3 Roles
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  Admin, Judge, and Student access levels
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">
                <p className="text-sm text-zinc-400">Purpose</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  One Platform
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  One place for event overview, judging, and student tracking
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">
                <p className="text-sm text-zinc-400">Focus</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  Live Demo
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  Designed to be visually clean and presentation-ready
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-[#FF2D6F]/15 p-3 text-[#FF2D6F]">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-white">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#FF2D6F]">
              Project Overview
            </p>
            <h2 className="text-2xl font-semibold text-white">
              What this hackathon platform is meant to do
            </h2>
            <p className="mt-4 leading-7 text-zinc-300">
              The goal of this system is to support the full hackathon flow with
              a modern interface. Instead of having disconnected tools, it brings
              together project visibility, scoring, participant guidance, and
              role-specific access into one experience.
            </p>
            <p className="mt-4 leading-7 text-zinc-300">
              As your backend teammate finishes the user and database setup, this
              frontend will be ready to connect real authentication and role
              permissions without changing the overall layout structure.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#FF2D6F]">
              Access Levels
            </p>

            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-2xl border border-white/10 bg-[#151515] p-4"
                >
                  <div className="flex items-center gap-3 text-white">
                    <div className="text-[#FF2D6F]">{role.icon}</div>
                    <h3 className="font-semibold">{role.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}