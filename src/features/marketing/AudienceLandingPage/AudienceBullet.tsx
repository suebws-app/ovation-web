import { CheckIcon } from "@ovation/icons/CheckIcon";

interface AudienceBulletProps {
  text: string;
}

export const AudienceBullet = ({ text }: AudienceBulletProps) => (
  <li className="border-border rounded-16 flex items-start gap-3 border p-6">
    <CheckIcon className="text-primary mt-1 size-5 shrink-0" />
    <span className="text-foreground type-body leading-relaxed">{text}</span>
  </li>
);
