type NavItem = "dashboard" | "judge" | "student" | "none";

type Props = {
  active: NavItem;
};

const navItems: { value: NavItem; label: string; href: string }[] = [
  { value: "dashboard", label: "Dashboard", href: "/dashboard/" },
  { value: "judge", label: "Judge View", href: "/judge/" },
  { value: "student", label: "Student View", href: "/student/" },
];

export default function RoleNavbar({ active }: Props) {
  return (
    <nav className="grid grid-cols-3 gap-2 rounded-2xl bg-[#111111] p-2">
      {navItems.map(({ value, label, href }) => (
        <a
          key={value}
          href={href}
          className={`rounded-xl px-4 py-4 text-center text-sm font-medium transition ${
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