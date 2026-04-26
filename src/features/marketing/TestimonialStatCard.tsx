type TestimonialStatCardProps = {
  value: string;
  label: string;
};

export const TestimonialStatCard = ({
  value,
  label,
}: TestimonialStatCardProps) => (
  <div className="rounded-2xl border border-white/18 bg-white/10 p-4.5 backdrop-blur">
    <p className="type-h1 font-serif leading-none font-semibold">{value}</p>
    <p className="mt-0.5 text-xs opacity-80">{label}</p>
  </div>
);
