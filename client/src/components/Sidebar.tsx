import { useState } from "react";
import SidebarButton from "./SidebarButton";
import { apiFetch } from "../utils/api";
import {
  Home as HomeIcon,
  LayoutDashboard,
  UserRoundCog,
  GraduationCap,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type ActiveView = "dashboard" | "judge" | "student" | "admin" | "home" | "none";
type UserRole = "admin" | "judge" | "student";

type Props = {
  active: ActiveView;
  role: UserRole;
};

export default function Sidebar({ active, role }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout/", { method: "POST" });
    } catch {
      // continue with client-side cleanup even if request fails
    }
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    localStorage.removeItem("teamName");
    window.location.href = "/";
  };

  const navItems = (
    <>
      <SidebarButton
        active={active === "home"}
        icon={<HomeIcon className="h-4 w-4" />}
        label="Home"
        onClick={() => (window.location.href = "/")}
      />

      <SidebarButton
        active={active === "dashboard"}
        icon={<LayoutDashboard className="h-4 w-4" />}
        label="Dashboard"
        onClick={() => (window.location.href = "/dashboard/")}
      />

      {(role === "admin" || role === "judge") && (
        <SidebarButton
          active={active === "judge"}
          icon={<UserRoundCog className="h-4 w-4" />}
          label="Judge"
          onClick={() => (window.location.href = "/judge/")}
        />
      )}

      {(role === "admin" || role === "student") && (
        <SidebarButton
          active={active === "student"}
          icon={<GraduationCap className="h-4 w-4" />}
          label="Student"
          onClick={() => (window.location.href = "/student/")}
        />
      )}

      {role === "admin" && (
        <>
          <SidebarButton
            active={active === "admin"}
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Admin"
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
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A0A0A]/90 p-4 lg:hidden">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-[#FF2D6F]">ITAP Hackathon</span>
          <span className="text-sm font-bold capitalize">{role} Portal</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-white/5 p-2 text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)}>
          <aside 
            className="absolute left-4 top-4 bottom-4 w-[280px] rounded-[28px] border border-white/10 bg-[#0A0A0A] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#FF2D6F]">DISRUPTIVE</p>
                <h1 className="text-xl font-bold">Hackathon</h1>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-xl bg-white/5 p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-2">{navItems}</nav>
            <div className="mt-8 border-t border-white/10 pt-6">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-zinc-400 hover:bg-red-500/10 hover:text-red-400">
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-auto min-w-[240px] max-w-[280px] shrink-0 rounded-[28px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-2xl backdrop-blur lg:block">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF2D6F]">
            DISRUPTIVE INNOVATION
          </p>
          <h1 className="mt-3 text-2xl font-black tracking-tighter">
            ITAP Hackathon
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
            {role} Portal
          </p>
        </div>

        <nav className="space-y-2">{navItems}</nav>

        <div className="mt-8 border-t border-white/10 pt-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
