import { ArrowUpRightIcon } from "@ovation/icons/ArrowUpRightIcon";

interface MediaResourceLinkProps {
  label: string;
}

export const MediaResourceLink = ({ label }: MediaResourceLinkProps) => (
  <li className="border-border rounded-16 flex items-start justify-between gap-3 border p-6">
    <span className="text-foreground type-body leading-relaxed">{label}</span>
    <ArrowUpRightIcon className="text-muted-foreground mt-0.5 size-5 shrink-0" />
  </li>
);
