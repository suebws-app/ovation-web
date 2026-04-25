type CountdownCardProps = {
  days: number;
};

export const CountdownCard = ({ days }: CountdownCardProps) => (
  <div className="rounded-16 relative border border-white/15 bg-white/10 p-4.5 backdrop-blur-sm">
    <p className="type-overline tracking-[1.5px] opacity-70">Countdown</p>
    <div className="mt-2 flex items-baseline gap-4.5">
      <div>
        <span className="font-serif text-[2.625rem] font-semibold">{days}</span>
        <span className="type-body-small ml-1.5 opacity-70">days</span>
      </div>
      <p className="type-caption opacity-70">
        Plenty of time to gather voices.
      </p>
    </div>
  </div>
);
