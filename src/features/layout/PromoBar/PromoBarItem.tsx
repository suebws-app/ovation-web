type PromoBarItemProps = {
  message: string;
};

export const PromoBarItem = ({ message }: PromoBarItemProps) => (
  <span className="type-body-small flex items-center gap-3 font-medium">
    {message}
    <span aria-hidden className="text-primary">
      ✦
    </span>
  </span>
);
