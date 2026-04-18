type NavItem = "dashboard" | "judge" | "student" | "admin" | "none";
type UserRole = "admin" | "judge" | "student";

type Props = {
  active: NavItem;
  role: UserRole;
};

export default function RoleNavbar({ active, role }: Props) {
  const navItems = [
    { value: "dashboard", label: "Home", href: "/dashboard/" },

    ...(role === "admin" || role === "judge"
      ? [{ value: "judge", label: "Judge View", href: "/judge/" }]
      : []),

    ...(role === "admin" || role === "student"
      ? [{ value: "student", label: "Student View", href: "/student/" }]
      : []),

    ...(role === "admin"
      ? [{ value: "admin", label: "Admin", href: "/admin-panel/" }]
      : []),
  ];

  return (
    <nav className="inline-flex gap-2 rounded-2xl bg-[#111111] p-2">
      {navItems.map(({ value, label, href }) => (
        <a
          key={value}
          href={href}
          className={`rounded-xl px-5 py-3 text-center text-sm font-medium whitespace-nowrap transition ${
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