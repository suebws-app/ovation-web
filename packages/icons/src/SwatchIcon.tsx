type SwatchIconProps = React.SVGProps<SVGSVGElement> & {
  colors?: [string, string, string];
};

export const SwatchIcon = ({ colors, ...props }: SwatchIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <circle cx="8" cy="8" r="4" fill={colors?.[0]} />
      <circle cx="16" cy="8" r="4" fill={colors?.[1]} />
      <circle cx="12" cy="16" r="4" fill={colors?.[2]} />
    </svg>
  );
};
