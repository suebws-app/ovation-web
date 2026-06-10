type ContactRowProps = {
  label: string;
  email: string;
};

export const ContactRow = ({ label, email }: ContactRowProps) => (
  <div className="border-border tablet:flex-row tablet:items-center flex flex-col items-start justify-between gap-2 border-b py-5">
    <span className="text-muted-foreground type-body-small font-semibold tracking-widest uppercase">
      {label}
    </span>
    <a
      href={`mailto:${email}`}
      className="text-primary type-body font-semibold underline underline-offset-4"
    >
      {email}
    </a>
  </div>
);
