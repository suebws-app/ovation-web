import { GridPhoto } from "./GridPhoto";

type PhotoGridColumnProps = {
  sources: string[];
};

export const PhotoGridColumn = ({ sources }: PhotoGridColumnProps) => (
  <div className="tablet:grid hidden flex-1 grid-cols-3 gap-1.5">
    {sources.map((src, index) => (
      <GridPhoto key={`${src}-${index}`} src={src} />
    ))}
  </div>
);
