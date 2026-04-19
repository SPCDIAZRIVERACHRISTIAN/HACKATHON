type NavItem = "dashboard" | "judge" | "student" | "admin" | "home" | "none";
type UserRole = "admin" | "judge" | "student";

type Props = {
  active: NavItem;
  role: UserRole;
};

export default function RoleNavbar({ active, role }: Props) {
  const navItems = [
    { value: "home", label: "Home", href: "/" },
    { value: "dashboard", label: "Dashboard", href: "/dashboard/" },

    ...(role === "admin" || role === "judge"
      ? [{ value: "judge", label: "Judge", href: "/judge/" }]
      : []),

    ...(role === "admin" || role === "student"
      ? [{ value: "student", label: "Student", href: "/student/" }]
      : []),

    ...(role === "admin"
      ? [{ value: "admin", label: "Admin", href: "/admin-panel/" }]
      : []),
  ];

  return (
    <nav className="flex w-full gap-1 rounded-2xl bg-[#111111] p-2 overflow-x-auto no-scrollbar">
      {navItems.map(({ value, label, href }) => (
        <a
          key={value}
          href={href}
          className={`flex-1 rounded-xl px-4 py-3 text-center text-xs sm:text-sm font-medium whitespace-nowrap transition ${
            active === value
              ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
              : "bg-transparent text-zinc-200 hover:bg-white/10"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
