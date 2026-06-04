"use client";

import { BookSizeFacetTile } from "./BookSizeFacetTile";
import type { SizeFacet } from "./bookFacets";

type BookSizeFacetGroupProps = {
  facets: SizeFacet[];
  selectedSizeKey: string | null;
  onSelect: (sizeKey: string) => void;
};

export const BookSizeFacetGroup = ({
  facets,
  selectedSizeKey,
  onSelect,
}: BookSizeFacetGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 tablet:grid-cols-3">
      {facets.map((facet) => (
        <BookSizeFacetTile
          key={facet.sizeKey}
          facet={facet}
          isSelected={facet.sizeKey === selectedSizeKey}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
