type RoleCardProps = {
  title: string;
  description: string;
};

export default function RoleCard({ title, description }: RoleCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4">
      <div className="font-medium text-white">{title}</div>
      <div className="mt-1 text-zinc-400">{description}</div>
    </div>
  );
}