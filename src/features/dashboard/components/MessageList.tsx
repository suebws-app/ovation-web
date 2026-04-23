import { Link } from '@/i18n/navigation'
import { MessageRow } from './MessageRow'

type Message = {
  id: string
  name: string
  relation: string
  quote: string
  initials: string
  tint: string
  wave: number[]
}

type MessageListProps = {
  messages: Message[]
  eventId: string
}

export const MessageList = ({ messages, eventId }: MessageListProps) => (
  <div>
    <div className="mb-5 flex items-baseline justify-between">
      <h2 className="font-serif text-[1.75rem] font-semibold">New messages</h2>
      <Link
        href={`/events/${eventId}/messages`}
        className="type-body-small font-semibold text-primary"
      >
        See all 87 &rarr;
      </Link>
    </div>

    <div className="overflow-hidden rounded-20 border border-border bg-card">
      {messages.map((m, i) => (
        <MessageRow key={m.id} {...m} index={i} />
      ))}
    </div>
  </div>
)
