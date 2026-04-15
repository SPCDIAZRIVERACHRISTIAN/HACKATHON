import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";
import { Search } from "lucide-react";
import RoleNavbar from "./RoleNavbar";

type Props = {
  title?: string;
  subtitle?: string;
  active: "dashboard" | "judge" | "student";
};

export default function PageHero({
  title = "University Hackathon Dashboard",
  subtitle = "Clean, presentable front end for live judging, student progress, clear instructions, and leaderboard tracking.",
  active,
}: Props) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4">
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

          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#FF2D6F]">
              Hackathon Control Center
            </p>
            <h2 className="bg-gradient-to-r from-white via-white to-[#FF4D85] bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              {title}
            </h2>
            <p className="mt-3 max-w-3xl text-zinc-300">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[430px]">
          <div className="flex items-center gap-3 rounded-2xl bg-[#111111] px-4 py-3">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
              placeholder="Search teams, judges, or submissions"
            />
          </div>
          <RoleNavbar active={active} />
        </div>
      </div>
    </section>
  );
}