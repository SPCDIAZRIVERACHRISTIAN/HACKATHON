type WeightRowProps = {
  label: string;
  value: string;
};

export default function WeightRow({ label, value }: WeightRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1A1A1A] px-4 py-3">
      <span>{label}</span>
      <span className="font-semibold text-[#FF2D6F]">{value}</span>
    </div>
  );
}