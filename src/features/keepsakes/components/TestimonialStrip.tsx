const TESTIMONIALS = [
  { quote: 'The book arrived and we both cried. Again.', couple: 'Ella & Joachim', location: 'Ghent \u00b7 Apr 26' },
  { quote: 'Playing the vinyl at our 1-year anniversary was wild.', couple: 'Nadia & Finn', location: 'Lisbon \u00b7 Jun 25' },
  { quote: 'Every guest asked where we got the cards.', couple: 'Martina & Pavel', location: 'Prague \u00b7 Sep 25' },
]

export const TestimonialStrip = () => (
  <div className="relative grid gap-5 overflow-hidden rounded-20 bg-foreground p-7 text-background tablet:grid-cols-3">
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: 'radial-gradient(400px 200px at 80% 50%, oklch(0.818 0.105 73.3 / 0.2), transparent 70%)' }}
    />
    {TESTIMONIALS.map((t) => (
      <TestimonialCard key={t.couple} {...t} />
    ))}
  </div>
)

const TestimonialCard = ({
  quote,
  couple,
  location,
}: {
  quote: string
  couple: string
  location: string
}) => (
  <div className="relative">
    <div className="mb-2.5 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)">
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
        </svg>
      ))}
    </div>
    <p className="font-serif type-body italic leading-snug">&ldquo;{quote}&rdquo;</p>
    <p className="mt-2 type-caption text-background/60">
      {couple} &middot; {location}
    </p>
  </div>
)
