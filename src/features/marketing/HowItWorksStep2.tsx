import { Mic } from "@ovation/icons/Mic";
import { HowItWorksWaveformBar } from "./HowItWorksWaveformBar";

const WAVEFORM_HEIGHTS = [
  8, 14, 20, 28, 36, 44, 36, 28, 44, 36, 20, 28, 36, 44, 36, 28, 20, 14, 28, 36,
  20, 12,
];

export const HowItWorksStep2 = () => (
  <div className="flex h-40 flex-col items-center justify-center gap-4">
    <div
      className="relative flex size-20 items-center justify-center rounded-full"
      style={{
        background:
          "linear-gradient(135deg, var(--destructive), oklch(from var(--destructive) calc(l - 0.1) c h))",
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 0 8px color-mix(in oklch, var(--destructive) 20%, transparent), 0 0 0 16px color-mix(in oklch, var(--destructive) 10%, transparent)",
        }}
      />
      <Mic className="text-primary-foreground" width={32} height={32} />
    </div>
    <div className="flex h-8 items-end gap-0.5">
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <HowItWorksWaveformBar key={i} height={h} variant="primary" />
      ))}
    </div>
  </div>
);
