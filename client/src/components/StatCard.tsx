import React from "react";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
};

export default function StatCard({
  icon,
  label,
  value,
  detail,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-4 shadow-[0_0_16px_rgba(255,45,111,0.06)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF2D6F]/15 text-[#FF2D6F]">
        {icon}
      </div>
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-zinc-300">{detail}</div>
    </div>
  );
}