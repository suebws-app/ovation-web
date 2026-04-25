export const DashboardGreeting = () => {
  const name = "Lena";
  const date = "14 June 2026";
  const venue = "Mas de la Calma";
  const newMessages = 12;

  return (
    <div className="tablet:mb-12 mb-8">
      <p className="type-body-small text-muted-foreground">
        {date} &middot; {venue}
      </p>
      <h1 className="tablet:text-[3.5rem] mt-3 max-w-205 font-serif text-[2rem] leading-[1.05] font-semibold tracking-tight">
        Good morning, {name}.
      </h1>
      <p className="type-h4 text-muted-foreground mt-3.5 max-w-160 leading-snug font-normal">
        You have{" "}
        <strong className="text-foreground">
          {newMessages} new voice messages
        </strong>{" "}
        waiting. Want to keep listening?
      </p>
    </div>
  );
};
