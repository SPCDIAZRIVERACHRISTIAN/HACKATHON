import { useState } from "react";
import { LockKeyhole, UserRound, ShieldCheck } from "lucide-react";
import AppLayout from "../components/AppLayout";
import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";
import { apiFetch } from "../utils/api";

type Role = "admin" | "judge" | "student";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password) {
      setErrorMessage("Please enter your username and password.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiFetch("/api/users/login/", {
        method: "POST",
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Login failed. Please try again."
        );
      }

      const backendRole: Role | undefined = data?.user?.role;

      if (!backendRole) {
        throw new Error("Login succeeded but no user role was returned.");
      }

      localStorage.setItem("role", backendRole);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("full_name", data.user.full_name || "");

      if (backendRole === "admin") {
        window.location.href = "/dashboard/";
      } else if (backendRole === "judge") {
        window.location.href = "/judge/";
      } else {
        window.location.href = "/student/";
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong during login."
      );
    } finally {
      setSubmitting(false);
    }
  };

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
              Sign in with your assigned username and password. Your destination
              is determined automatically by your backend role.
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
                  Access judging workflow and review tools.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#151515] p-4">
                <UserRound className="mb-3 h-5 w-5 text-[#FF2D6F]" />
                <h2 className="font-semibold text-white">Student</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Access team workspace and student portal.
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

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                />
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-sm text-red-300">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#FF2D6F] px-5 py-3 font-medium text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#151515] p-4">
              <p className="text-sm text-zinc-300">
                Access is determined by the authenticated user role from the
                backend, not by a frontend selector.
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-300">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/create-account/";
                  }}
                  className="font-medium text-[#FF2D6F] transition hover:text-[#ff5a8f]"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
