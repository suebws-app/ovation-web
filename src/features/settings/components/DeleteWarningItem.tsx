type DeleteWarningItemProps = {
  text: string;
};

export const DeleteWarningItem = ({ text }: DeleteWarningItemProps) => (
  <div className="flex gap-2.5 py-1 type-body-small leading-relaxed">
    <span className="mt-0.5 shrink-0 text-destructive">&times;</span>
    {text}
  </div>
);
