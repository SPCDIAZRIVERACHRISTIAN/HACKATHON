import SidebarButton from "./SidebarButton";
import {
  Home,
  UserRoundCog,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Bell,
  ShieldCheck,
} from "lucide-react";

type ActiveView = "dashboard" | "judge" | "student" | "admin" | "none";
type UserRole = "admin" | "judge" | "student";

type Props = {
  active: ActiveView;
  role: UserRole;
};

export default function Sidebar({ active, role }: Props) {
  return (
    <aside className="hidden w-72 shrink-0 rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-5 shadow-2xl backdrop-blur lg:block">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#FF2D6F]">
          Disruptive Innovation
        </p>
        <h1 className="mt-3 text-2xl font-bold">
          ITAP Hackathon Control Center
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Demo-ready workspace for judges, students, and admins.
        </p>
      </div>

      <nav className="space-y-2">
        <SidebarButton
          active={active === "dashboard"}
          icon={<Home className="h-4 w-4" />}
          label="Dashboard"
          onClick={() => (window.location.href = "/dashboard/")}
        />

        {(role === "admin" || role === "judge") && (
          <SidebarButton
            active={active === "judge"}
            icon={<UserRoundCog className="h-4 w-4" />}
            label="Judge View"
            onClick={() => (window.location.href = "/judge/")}
          />
        )}

        {(role === "admin" || role === "student") && (
          <SidebarButton
            active={active === "student"}
            icon={<GraduationCap className="h-4 w-4" />}
            label="Student View"
            onClick={() => (window.location.href = "/student/")}
          />
        )}

        {role === "admin" && (
          <>
            <SidebarButton
              active={active === "admin"}
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Admin View"
              onClick={() => (window.location.href = "/admin-panel/")}
            />
            <SidebarButton
              active={false}
              icon={<ClipboardList className="h-4 w-4" />}
              label="Submissions"
              onClick={() => {}}
            />
            <SidebarButton
              active={false}
              icon={<BarChart3 className="h-4 w-4" />}
              label="Analytics"
              onClick={() => {}}
            />
          </>
        )}
      </nav>

      <div className="mt-8 rounded-2xl border border-[#FF2D6F]/20 bg-[#FF2D6F]/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-[#FF2D6F]">
          <Bell className="h-4 w-4" />
          <span className="font-medium">Tomorrow’s Demo Flow</span>
        </div>
        <ul className="space-y-2 text-sm text-zinc-200">
          <li>1. Open leaderboard</li>
          <li>2. Switch to judge scoring</li>
          <li>3. Show student progress + hints</li>
          <li>4. End with instructions and timeline</li>
        </ul>
      </div>
    </aside>
  );
}