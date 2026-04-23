export const DashboardGreeting = () => {
  const name = "Lena";
  const date = "14 June 2026";
  const venue = "Mas de la Calma";
  const newMessages = 12;

  return (
    <div className="mb-8 tablet:mb-12">
      <p className="type-body-small text-muted-foreground">
        {date} &middot; {venue}
      </p>
      <h1 className="mt-3 max-w-205 font-serif text-[2rem] font-semibold leading-[1.05] tracking-tight tablet:text-[3.5rem]">
        Good morning, {name}.
      </h1>
      <p className="mt-3.5 max-w-160 type-h4 font-normal leading-snug text-muted-foreground">
        You have{" "}
        <strong className="text-foreground">
          {newMessages} new voice messages
        </strong>{" "}
        waiting. Want to keep listening?
      </p>
    </div>
  );
};
