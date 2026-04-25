import { GuestGroupCard } from "./GuestGroupCard";

const GROUPS = [
  {
    title: "Lena\u2019s family",
    totalCount: 18,
    recordedCount: 16,
    tint: "#B9C9D9",
    members: [
      { initials: "J", tint: "#B9C9D9" },
      { initials: "E", tint: "#B9C9D9" },
      { initials: "M", tint: "#B9C9D9" },
      { initials: "D", tint: "#B9C9D9" },
      { initials: "K", tint: "#B9C9D9" },
      { initials: "+", tint: "#B9C9D9" },
    ],
  },
  {
    title: "Tom\u00e1s\u2019s family",
    totalCount: 21,
    recordedCount: 18,
    tint: "#D8C9B2",
    members: [
      { initials: "P", tint: "#D8C9B2" },
      { initials: "A", tint: "#D8C9B2" },
      { initials: "M", tint: "#D8C9B2" },
      { initials: "I", tint: "#D8C9B2" },
      { initials: "R", tint: "#D8C9B2" },
    ],
  },
  {
    title: "Wedding party",
    totalCount: 12,
    recordedCount: 12,
    tint: "#EFC9A8",
    members: [
      { initials: "M", tint: "#EFC9A8" },
      { initials: "S", tint: "#EFC9A8" },
      { initials: "N", tint: "#EFC9A8" },
      { initials: "H", tint: "#EFC9A8" },
      { initials: "L", tint: "#EFC9A8" },
    ],
  },
  {
    title: "University friends",
    totalCount: 14,
    recordedCount: 10,
    tint: "#C8B5D9",
    members: [
      { initials: "S", tint: "#C8B5D9" },
      { initials: "K", tint: "#C8B5D9" },
      { initials: "P", tint: "#C8B5D9" },
      { initials: "R", tint: "#C8B5D9" },
    ],
  },
  {
    title: "Work & colleagues",
    totalCount: 9,
    recordedCount: 7,
    tint: "#E9BFC4",
    members: [
      { initials: "I", tint: "#E9BFC4" },
      { initials: "D", tint: "#E9BFC4" },
      { initials: "F", tint: "#E9BFC4" },
      { initials: "G", tint: "#E9BFC4" },
    ],
  },
  {
    title: "Kids",
    totalCount: 4,
    recordedCount: 3,
    tint: "#F2D7B3",
    members: [
      { initials: "N", tint: "#F2D7B3" },
      { initials: "H", tint: "#F2D7B3" },
      { initials: "M", tint: "#F2D7B3" },
    ],
  },
];

export const GuestGroupsStrip = () => {
  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="type-h2 font-serif tracking-tight">Groups</h2>
        <button
          type="button"
          className="type-body-small text-primary cursor-pointer font-semibold"
        >
          Edit groups &rarr;
        </button>
      </div>
      <div className="tablet:grid-cols-3 desktop:grid-cols-6 grid grid-cols-2 gap-3">
        {GROUPS.map((group) => (
          <GuestGroupCard key={group.title} {...group} />
        ))}
      </div>
    </div>
  );
};
