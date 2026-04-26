import { Phone } from "@ovation/icons/Phone";
import { Mail } from "@ovation/icons/Mail";
import { LinkIcon } from "@ovation/icons/LinkIcon";

export type ContactType = "phone" | "email" | "via";

type ContactIconProps = {
  type: ContactType;
};

export const ContactIcon = ({ type }: ContactIconProps) => {
  if (type === "phone")
    return <Phone width={12} height={12} className="text-muted-foreground" />;
  if (type === "via")
    return (
      <LinkIcon width={12} height={12} className="text-muted-foreground" />
    );
  return <Mail width={12} height={12} className="text-muted-foreground" />;
};
