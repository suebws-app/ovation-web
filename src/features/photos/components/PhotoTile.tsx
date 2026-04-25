"use client";

import { cn } from "@ovation/ui/utils/cn";
import { Check } from "@ovation/icons/Check";
import { Play } from "@ovation/icons/Play";

import type { PhotoTileMock } from "../mocks";

type PhotoTileProps = {
  tile: PhotoTileMock;
  selected?: boolean;
  showSelect?: boolean;
  onClick?: () => void;
};

export const PhotoTile = ({
  tile,
  selected = false,
  showSelect = false,
  onClick,
}: PhotoTileProps) => {
  const { monogram, name, tint, height, favourite, hasAudio, audioLen, time } =
    tile;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative mb-3 w-full cursor-pointer overflow-hidden rounded-12 text-left transition-all hover:scale-[1.02] hover:shadow-md",
        selected ? "ring-[3px] ring-secondary ring-offset-1" : "shadow-sm",
      )}
      style={{ breakInside: "avoid" }}
    >
      <div
        className="relative flex w-full items-center justify-center"
        style={{
          height,
          background: `linear-gradient(160deg, ${tint}, ${tint}bb)`,
        }}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.03)_0_8px,transparent_8px_16px)]" />
        <span className="font-serif text-4xl text-black/40">{monogram}</span>

        {showSelect && <SelectIndicator selected={selected} />}
        {favourite && <FavouriteIndicator />}
        {hasAudio && <AudioBadge duration={audioLen} />}

        {!hasAudio && (
          <div className="absolute right-2 bottom-2 left-2 flex items-baseline justify-between type-caption font-semibold text-white drop-shadow-sm">
            <span>{name}</span>
            <span className="font-mono opacity-85">{time}</span>
          </div>
        )}
      </div>
    </button>
  );
};

const SelectIndicator = ({ selected }: { selected: boolean }) => (
  <div
    className={cn(
      "absolute top-2 left-2 flex size-[22px] items-center justify-center rounded-full",
      selected ? "bg-secondary" : "border-2 border-white bg-white/75",
    )}
  >
    {selected && (
      <Check
        width={12}
        height={12}
        className="text-foreground"
        strokeWidth={2.5}
      />
    )}
  </div>
);

const FavouriteIndicator = () => (
  <svg
    className="absolute top-2 right-2"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="oklch(0.723 0.135 40)"
    stroke="oklch(0.723 0.135 40)"
    strokeWidth="1.5"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21l8.84-8.61a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const AudioBadge = ({ duration }: { duration: string }) => (
  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 type-caption font-semibold text-white">
    <Play width={9} height={9} className="text-white" />
    {duration}
  </span>
);
