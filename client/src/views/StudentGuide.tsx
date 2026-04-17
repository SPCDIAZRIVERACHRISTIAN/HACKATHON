const steps = [
  {
    title: "Clone the repository",
    description:
      "Download the project from GitHub to your computer the first time.",
    command: "git clone <repo-url>",
    tip: "Example: git clone https://github.com/your-org/your-repo.git",
  },
  {
    title: "Enter the project folder",
    description: "Move into the project directory you just cloned.",
    command: "cd <repo-folder-name>",
    tip: "Example: cd HACKATHON",
  },
  {
    title: "Check your branch",
    description: "See which branch you are currently on.",
    command: "git branch",
    tip: "The current branch has a * next to it.",
  },
  {
    title: "Switch to your working branch",
    description: "Always work on your own branch, not directly on main.",
    command: "git checkout your-branch-name",
    tip: "Example: git checkout Luis-setup",
  },
  {
    title: "Pull latest changes",
    description: "Get the newest updates before starting your work.",
    command: "git pull origin your-branch-name",
    tip: "If your team uses main updates often, merge main into your branch when needed.",
  },
  {
    title: "Start the project locally",
    description: "Run the local development environment and confirm everything works.",
    command: "npm run dev",
    tip: "Use the command your team is using locally. If Docker is required, follow the project setup.",
  },
  {
    title: "Review changed files",
    description: "Check what files were modified before saving your work.",
    command: "git status",
    tip: "This helps you avoid committing the wrong files.",
  },
  {
    title: "Stage your files",
    description: "Add the files you want included in the next commit.",
    command: "git add .",
    tip: "You can also add a specific file, like: git add client/src/views/StudentGuide.tsx",
  },
  {
    title: "Commit your work",
    description: "Save your progress with a clear commit message.",
    command: 'git commit -m "Add student guide page"',
    tip: "Keep commit messages short and specific.",
  },
  {
    title: "Push your branch",
    description: "Upload your changes to GitHub so others can review them.",
    command: "git push origin your-branch-name",
    tip: "This updates your remote branch.",
  },
  {
    title: "Open a Pull Request",
    description: "Create a Pull Request on GitHub to merge your work properly.",
    command: "Open GitHub and create a Pull Request",
    tip: "Include a short summary of what you changed.",
  },
];

export default function StudentGuide() {
  return (
    <div className="min-h-screen bg-black px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-[#09090b] p-8 shadow-[0_0_50px_rgba(255,45,111,0.08)]">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#ff2d6f]">
            Student Guide
          </p>

          <h1 className="mb-4 text-4xl font-bold leading-tight">
            GitHub + Git Step-by-Step Guide
          </h1>

          <p className="max-w-3xl text-lg text-white/70">
            This guide helps students work inside the hackathon repository,
            switch branches correctly, save changes, and push work to GitHub.
          </p>
        </div>

        <div className="grid gap-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[24px] border border-white/10 bg-[#0e0e11] p-6 shadow-[0_0_30px_rgba(255,45,111,0.05)]"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff2d6f] text-sm font-bold text-white shadow-[0_0_18px_rgba(255,45,111,0.4)]">
                  {index + 1}
                </div>

                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>

              <p className="mb-4 text-white/75">{step.description}</p>

              <div className="mb-3 rounded-2xl border border-white/10 bg-[#151519] px-4 py-3 font-mono text-sm text-[#ff7aa7]">
                {step.command}
              </div>

              <p className="text-sm text-white/55">{step.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}