import { useState, useEffect } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Trophy,
  Users,
  BarChart3,
  GraduationCap,
  UserRoundCog,
  X,
  Rocket,
  Lightbulb,
  TimerReset,
  Clock,
  CheckCircle2,
  Presentation,
  Info,
  ChevronRight,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import Sidebar from "../components/Sidebar";
import PageHero from "../components/PageHero";
import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";
import Login from "./Login";

const features = [
  {
    title: "Live Dashboard",
    description: "Track teams, scores, progress, and submissions from one central view.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    title: "Judge Workflow",
    description: "Allow judges to review projects, score teams, and leave notes clearly.",
    icon: <UserRoundCog className="h-6 w-6" />,
  },
  {
    title: "Student Experience",
    description: "Give participants a clean way to follow tasks, milestones, and updates.",
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
    description: "Access the dashboard and student workspace during the hackathon.",
    icon: <Users className="h-5 w-5" />,
  },
];

type TimelineEvent = {
  id: number;
  label: string;
  start_time: string;
  end_time: string | null;
  order: number;
};

const criteriaDetails = [
  { 
    name: "Technical", 
    weight: "30%", 
    desc: "Code quality & execution",
    details: [
      "API Data Processing: Effectively processing data returned from the provided API.",
      "Relevance & Accuracy: Ensuring API responses are accurate and highly relevant to user prompts.",
      "Application Testing: Active testing to ensure backend integrations work correctly."
    ]
  },
  { 
    name: "Creativity", 
    weight: "25%", 
    desc: "Innovation & approach",
    details: [
      "Originality: Uniqueness of the project idea and the team's overall approach.",
      "Visual Appeal: Ensuring the application is visually polished and appealing to the eye."
    ]
  },
  { 
    name: "Impact", 
    weight: "20%", 
    desc: "Relevance & utility",
    details: [
      "Audience Value: How meaningful and useful the project is to its target audience.",
      "Overall Impact: Potential impact the proposed solution or application can have."
    ]
  },
  { 
    name: "Presentation", 
    weight: "15%", 
    desc: "Clarity & storytelling",
    details: [
      "Demo Quality: Clarity, professionalism, and audience engagement during live demonstration.",
      "Showcasing Functionality: Effectiveness in showcasing the app, visualizations, and chatbot in 5-10 mins."
    ]
  },
  { 
    name: "Experience", 
    weight: "10%", 
    desc: "UI design & polish",
    details: [
      "Intuitive Design: User-friendly and responsive interface and visualizations.",
      "Interactive Testing: Direct interaction to test chatbot responses, dynamic updates, and data visualization."
    ]
  },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function isEventDone(event: TimelineEvent, now: Date) {
  if (event.end_time) return now >= new Date(event.end_time);
  return false;
}

function isEventActive(event: TimelineEvent, now: Date) {
  const start = new Date(event.start_time);
  const end = event.end_time ? new Date(event.end_time) : null;
  return now >= start && (!end || now < end);
}

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [now, setNow] = useState(new Date());
  const [selectedCriteria, setSelectedCriteria] = useState<typeof criteriaDetails[0] | null>(null);
  
  const role = (localStorage.getItem("role") as any);
  const isLoggedIn = !!role;

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/team/events/")
        .then((r) => r.json())
        .then(setEvents)
        .catch(() => {});
      
      const id = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(id);
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return (
      <AppLayout>
        <Sidebar active="home" role={role} />
        <main className="flex-1 space-y-6">
          <PageHero
            title="Project Information"
            subtitle="The mission, schedule, and judging criteria for today's event."
            active="home"
            role={role}
          />

          {/* Criteria Detail Modal */}
          {selectedCriteria && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setSelectedCriteria(null)}>
              <div className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#0A0A0A] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedCriteria(null)}
                  className="absolute -top-4 -right-4 rounded-full bg-[#FF2D6F] p-2 text-white shadow-lg hover:bg-[#FF4D85] transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-2xl bg-[#FF2D6F]/10 p-3">
                    <Info className="h-6 w-6 text-[#FF2D6F]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedCriteria.name} Evaluation</h3>
                    <p className="text-[#FF2D6F] font-bold uppercase tracking-widest text-xs">{selectedCriteria.weight} Weight</p>
                  </div>
                </div>

                <p className="text-zinc-400 mb-6 font-medium italic">"{selectedCriteria.desc}"</p>

                <div className="space-y-4">
                  {selectedCriteria.details.map((detail, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.03]">
                      <ChevronRight className="h-5 w-5 text-[#FF2D6F] shrink-0 mt-0.5" />
                      <p className="text-sm text-zinc-200 leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setSelectedCriteria(null)}
                  className="mt-8 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-zinc-300 hover:bg-white/10 transition-all"
                >
                  Close Information
                </button>
              </div>
            </div>
          )}

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* About Section */}
            <div className="lg:col-span-2 rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-[#FF2D6F]/10 p-3">
                  <Rocket className="h-6 w-6 text-[#FF2D6F]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">The Mission</h3>
                  <p className="text-sm text-zinc-400">What we are building today.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 text-zinc-300 text-sm leading-relaxed">
                <div className="space-y-4">
                  <p>
                    Welcome to the <span className="text-white font-bold">ITAP Hackathon</span>. This is a fast-paced environment where teams design and build functional prototypes from scratch.
                  </p>
                  <p>
                    You're here to solve real problems using technology, teamwork, and raw creativity. Every commit brings you closer to the final demo.
                  </p>
                </div>
                <div className="space-y-4">
                  <p>
                    Focus on the <span className="text-[#FF2D6F] font-bold">Story</span>. A working demo is powerful, but explaining the impact and the "why" behind your solution is what wins.
                  </p>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3 items-start">
                    <Lightbulb className="h-5 w-5 text-amber-400 shrink-0" />
                    <p className="text-xs italic font-medium">"Focus on a working demo over feature completeness. Quality over quantity."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TimerReset className="h-5 w-5 text-[#FF2D6F]" />
                  <h3 className="text-xl font-bold">Schedule</h3>
                </div>
                <Clock className="h-4 w-4 text-zinc-500" />
              </div>
              <div className="space-y-3">
                {events.length > 0 ? events.slice(0, 5).map((event) => {
                  const done = isEventDone(event, now);
                  const active = isEventActive(event, now);
                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                        active
                          ? "border-[#FF2D6F]/40 bg-[#FF2D6F]/5"
                          : "border-white/5 bg-white/[0.02]"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : active ? (
                        <div className="h-2 w-2 rounded-full bg-[#FF2D6F] animate-ping" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-zinc-700" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold truncate ${active ? "text-[#FF2D6F]" : "text-zinc-300"}`}>
                          {event.label}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-medium">
                          {formatTime(event.start_time)}
                        </div>
                      </div>
                    </div>
                  );
                }) : <p className="text-center py-8 text-zinc-500 text-sm italic">No events scheduled.</p>}
              </div>
            </div>
          </section>

          {/* Judging Criteria */}
          <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-xl">
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Presentation className="h-6 w-6 text-[#FF2D6F]" />
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Judging Criteria</h3>
                  <p className="text-sm text-zinc-400">Click a card to see detailed evaluation rubric.</p>
                </div>
              </div>
              <div className="bg-[#FF2D6F]/10 border border-[#FF2D6F]/20 rounded-xl px-4 py-2">
                <span className="text-xs font-black text-[#FF2D6F] uppercase tracking-widest">1-5 Point Scale</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {criteriaDetails.map((c) => (
                <button 
                  key={c.name} 
                  onClick={() => setSelectedCriteria(c)}
                  className="group relative text-left rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:border-[#FF2D6F]/30 transition-all active:scale-[0.98]"
                >
                  <div className="mb-3 text-3xl font-black text-white group-hover:text-[#FF2D6F] transition-colors">{c.weight}</div>
                  <div className="font-bold text-sm text-zinc-200 flex items-center gap-1.5">
                    {c.name}
                    <Info className="h-3 w-3 text-zinc-500 group-hover:text-[#FF2D6F]" />
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-zinc-500 leading-normal">{c.desc}</div>
                  <div className="absolute bottom-4 right-4 h-1 w-8 bg-white/5 rounded-full group-hover:bg-[#FF2D6F]/40 transition-all" />
                </button>
              ))}
            </div>
          </section>
        </main>
      </AppLayout>
    );
  }

  // Public Landing Page
  return (
    <AppLayout>
      <main className="w-full space-y-8">
        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="relative w-full max-w-6xl">
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute -top-4 -right-4 z-[110] rounded-full bg-[#FF2D6F] p-2 text-white shadow-lg hover:bg-[#FF4D85] transition-all"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="max-h-[90vh] overflow-y-auto rounded-[32px]">
                <Login />
              </div>
            </div>
          </div>
        )}

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
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FF2D6F] px-5 py-3 font-medium text-white transition hover:scale-[1.02]"
                >
                  Go to Login
                  <ArrowRight className="h-4 w-4" />
                </button>
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
