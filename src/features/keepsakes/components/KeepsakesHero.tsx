import { Eyebrow } from "@ovation/ui/components/Eyebrow";

export const KeepsakesHero = () => (
  <div>
    <Eyebrow className="tracking-[2px] text-[#9A6B2F]">
      The keepsake studio
    </Eyebrow>
    <h1 className="mt-2.5 max-w-225 font-serif text-[2rem] font-semibold leading-none tracking-tight tablet:text-[3.375rem]">
      Turn 87 voices into
      <br />
      <span className="italic" style={{ color: "#C88C36" }}>
        something you can hold.
      </span>
    </h1>
    <p className="mt-3.5 max-w-155 type-body-small leading-relaxed text-muted-foreground">
      Pick what speaks to you &mdash; we print, press, and ship. Every keepsake
      is built from the 87 messages and 64 photos your guests have already given
      you.
    </p>
  </div>
);
