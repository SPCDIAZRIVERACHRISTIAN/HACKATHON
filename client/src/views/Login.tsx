import { useState } from "react";
import { LockKeyhole, UserRound, ShieldCheck } from "lucide-react";
import AppLayout from "../components/AppLayout";
import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<
    "admin" | "judge" | "student"
  >("admin");

  return (
    <AppLayout>
      <main className="flex w-full items-center justify-center">
        <section className="grid w-full max-w-6xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
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
              Secure Access
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              Sign in to the Hackathon Platform
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
              This login page will connect later to your real Django users and
              database. For now, we are preparing the interface and access flow
              for admins, judges, and students.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#151515] p-4">
                <ShieldCheck className="mb-3 h-5 w-5 text-[#FF2D6F]" />
                <h2 className="font-semibold text-white">Admin</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Full access to all views and controls.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#151515] p-4">
                <LockKeyhole className="mb-3 h-5 w-5 text-[#FF2D6F]" />
                <h2 className="font-semibold text-white">Judge</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Access dashboard and judging workflow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#151515] p-4">
                <UserRound className="mb-3 h-5 w-5 text-[#FF2D6F]" />
                <h2 className="font-semibold text-white">Student</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Access dashboard and student workspace.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#FF2D6F]">
              Login
            </p>
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Use your assigned credentials to enter the platform.
            </p>

            <form className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Email or Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Role Preview
                </label>

                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#111111] p-2">
                  {(["admin", "judge", "student"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`rounded-xl px-4 py-3 text-sm font-medium capitalize transition ${
                        selectedRole === role
                          ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
                          : "bg-transparent text-zinc-200 hover:bg-white/10"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
  localStorage.setItem("role", selectedRole);

  if (selectedRole === "admin") {
    window.location.href = "/dashboard/";
  } else if (selectedRole === "judge") {
    window.location.href = "/judge/";
  } else {
    window.location.href = "/student/";
  }
}}
                className="w-full rounded-2xl bg-[#FF2D6F] px-5 py-3 font-medium text-white transition hover:scale-[1.01]"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#151515] p-4">
              <p className="text-sm text-zinc-300">
                Temporary note: authentication is not connected yet. This page
                is currently a frontend mockup ready to connect to the real user
                system later.
              </p>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}