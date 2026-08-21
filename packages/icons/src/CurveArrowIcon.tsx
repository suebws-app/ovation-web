export const CurveArrowIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={24}
      viewBox="0 0 48 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 7C14 1 30 2 42 13" />
      <path d="M39.7 6.4 42 13l-6.8-1.8" />
    </svg>
  );
};
