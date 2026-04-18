import { useEffect, useState } from "react";
import { ArrowLeft, UserPlus, ShieldCheck } from "lucide-react";
import AppLayout from "../components/AppLayout";
import diLogoUrl from "../assets/di-logo.png";
import itapLogoUrl from "../assets/itap-logo.png";
import { apiFetch } from "../utils/api"

type Role = "admin" | "judge" | "student";

type Team = {
  id: number;
  team_name?: string;
  name?: string;
};

export default function CreateAccountView() {
  const [selectedRole, setSelectedRole] = useState<Role>("student");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [teamId, setTeamId] = useState("");

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
  if (selectedRole !== "student") return;

  const loadTeams = async () => {
    setLoadingTeams(true);
    try {
      const response = await apiFetch("/api/team/teams");
      if (!response.ok) {
        throw new Error("Failed to load teams.");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setTeams(data);
      } else if (Array.isArray(data.teams)) {
        setTeams(data.teams);
      } else {
        setTeams([]);
      }
    } catch (error) {
      console.error("Error loading teams:", error);
      setTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  };

  loadTeams();
}, [selectedRole]);

  console.log("this is teams: ", teams);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (selectedRole === "student" && !teamId) {
      setErrorMessage("Please select a team for the student account.");
      return;
    }

    const payload: Record<string, string | number> = {
      full_name: fullName.trim(),
      username: username.trim(),
      password,
      role: selectedRole,
    };

    if (selectedRole === "student") {
      payload.team_id = Number(teamId);
    }

    setSubmitting(true);

    try {
      const response = await apiFetch("/api/users/create/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const backendMessage =
          data?.error ||
          data?.message ||
          "Could not create account. Please try again.";
        throw new Error(backendMessage);
      }

      setSuccessMessage("Account created successfully. Redirecting to login...");
      setFullName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setTeamId("");

      setTimeout(() => {
        window.location.href = "/login/";
      }, 1200);
    } catch (error) {
      console.error("Create account error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the account."
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
              New Account
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              Create your Hackathon Platform account
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
              This page is now connected to your create-user backend endpoint
              and submits the new account information directly to the server.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#151515] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#FF2D6F]" />
                <div>
                  <h2 className="font-semibold text-white">Role selection</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Students must select a team before creating the account.
                    Admin and judge accounts can be created directly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#FF2D6F]">
              Create Account
            </p>
            <h2 className="text-2xl font-semibold text-white">Get started</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Fill out the information below to create your account.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Choose a username"
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#FF2D6F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Role
                </label>

                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#111111] p-2">
                  {(["admin", "judge", "student"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role);
                        if (role !== "student") setTeamId("");
                      }}
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

              {selectedRole === "student" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Team
                  </label>
                  <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition focus:border-[#FF2D6F]"
                  >
                    <option value="" className="bg-[#151515] text-zinc-400">
                      {loadingTeams ? "Loading teams..." : "Select a team"}
                    </option>
                    {teams.map((team) => (
                      <option
                        key={team.id}
                        value={team.id}
                        className="bg-[#151515] text-white"
                      >
                        {team.team_name || team.name || `Team ${team.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-sm text-red-300">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-sm text-emerald-300">{successMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF2D6F] px-5 py-3 font-medium text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <UserPlus className="h-4 w-4" />
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#151515] p-4">
                <p className="text-sm text-zinc-300">
                  After successful creation, the user is redirected back to the
                  login page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/login/";
                }}
                className="inline-flex items-center gap-2 self-start text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
