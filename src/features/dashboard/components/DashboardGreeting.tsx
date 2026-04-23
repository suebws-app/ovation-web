type DashboardGreetingProps = {
  name: string
  date: string
  venue: string
  newMessages: number
}

export const DashboardGreeting = ({
  name,
  date,
  venue,
  newMessages,
}: DashboardGreetingProps) => (
  <div className="mb-8 tablet:mb-12">
    <p className="type-body-small text-muted-foreground">
      {date} &middot; {venue}
    </p>
    <h1 className="mt-3 max-w-[820px] font-serif text-[2rem] font-semibold leading-[1.05] tracking-tight tablet:text-[3.5rem]">
      Good morning, {name}.
    </h1>
    <p className="mt-3.5 max-w-[640px] type-h4 font-normal leading-snug text-muted-foreground">
      You have <strong className="text-foreground">{newMessages} new voice messages</strong> waiting.
      Want to keep listening?
    </p>
  </div>
)
