import React from "react";

type SidebarButtonProps = {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

export default function SidebarButton({
  active,
  icon,
  label,
  onClick,
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
        active
          ? "bg-[#FF2D6F] text-white shadow-[0_0_20px_rgba(255,45,111,0.35)]"
          : "bg-[#1A1A1A] text-zinc-200 hover:bg-white/10"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}