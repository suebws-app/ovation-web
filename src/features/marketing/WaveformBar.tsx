type WaveformBarProps = {
  height: number;
};

export const WaveformBar = ({ height }: WaveformBarProps) => (
  <div
    className="bg-primary/40 flex-1 rounded-full"
    style={{ height: `${height}px` }}
  />
);
