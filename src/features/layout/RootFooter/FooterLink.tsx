type FooterLinkProps = {
  link: string;
};

export const FooterLink = ({ link }: FooterLinkProps) => (
  <a className="text-foreground hover:text-primary cursor-pointer text-sm">
    {link}
  </a>
);
