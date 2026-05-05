type WaveformBarProps = {
  height: number;
  fill: number;
};

export const WaveformBar = ({ height, fill }: WaveformBarProps) => (
  <span
    className="bg-primary/20 relative w-[2.5px] overflow-hidden rounded-full"
    style={{ height }}
  >
    <span
      className="bg-primary absolute inset-x-0 bottom-0 top-0 origin-left rounded-full transition-transform duration-300 ease-linear"
      style={{ transform: `scaleX(${fill})` }}
    />
  </span>
);
