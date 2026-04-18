import SidebarButton from "./SidebarButton";
import {
  Home,
  UserRoundCog,
  GraduationCap,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  LogOut,
} from "lucide-react";

type ActiveView = "dashboard" | "judge" | "student" | "admin" | "none";
type UserRole = "admin" | "judge" | "student";

type Props = {
  active: ActiveView;
  role: UserRole;
};

export default function Sidebar({ active, role }: Props) {
  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout/", { method: "POST" });
    } catch {
      // continue with client-side cleanup even if request fails
    }
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    window.location.href = "/login/";
  };

  return (
    <aside className="hidden w-auto min-w-[220px] max-w-[280px] shrink-0 rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-5 shadow-2xl backdrop-blur lg:block">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[#FF2D6F]">
          Disruptive Innovation
        </p>
        <h1 className="mt-3 text-xl font-bold">
          ITAP Hackathon
        </h1>
        <p className="mt-1 text-sm text-zinc-400 capitalize">
          {role} Portal
        </p>
      </div>

      <nav className="space-y-2">
        <SidebarButton
          active={active === "dashboard"}
          icon={<Home className="h-4 w-4" />}
          label="Home"
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

      <div className="mt-6 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}