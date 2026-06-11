import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  iconOnly?: boolean;
  size?: number;
}

export const Logo = ({ iconOnly, size = 50, ...props }: IconProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M97 84c-14-18-19-40-9-58 6-8 18-8 24 0 10 18 5 40-9 58-1 2-5 2-6 0"
          fill="var(--primary)"
        />
        <path
          d="M109.192 86.565c2.829-22.627 14.85-41.72 34.649-47.376 9.899-1.414 18.384 7.07 16.97 16.97-5.657 19.8-24.749 31.82-47.376 34.649-2.121.707-4.95-2.122-4.243-4.243"
          fill="var(--primary)"
        />
        <path
          d="M116 97c18-14 40-19 58-9 8 6 8 18 0 24-18 10-40 5-58-9-2-1-2-5 0-6"
          fill="var(--primary)"
        />
        <path
          d="M113.435 109.192c22.627 2.829 41.719 14.85 47.376 34.649 1.414 9.899-7.071 18.384-16.97 16.97-19.799-5.657-31.82-24.749-34.649-47.376-.707-2.121 2.122-4.95 4.243-4.243"
          fill="var(--primary)"
        />
        <path
          d="M103 116c14 18 19 40 9 58-6 8-18 8-24 0-10-18-5-40 9-58 1-2 5-2 6 0"
          fill="var(--primary)"
        />
        <path
          d="M90.808 113.435c-2.829 22.627-14.85 41.719-34.649 47.376-9.9 1.414-18.384-7.071-16.97-16.97 5.657-19.799 24.749-31.82 47.376-34.649 2.121-.707 4.95 2.122 4.243 4.243"
          fill="var(--primary)"
        />
        <path
          d="M84 103c-18 14-40 19-58 9-8-6-8-18 0-24 18-10 40-5 58 9 2 1 2 5 0 6"
          fill="var(--primary)"
        />
        <path
          d="M86.565 90.808c-22.627-2.829-41.72-14.85-47.376-34.649-1.414-9.9 7.07-18.384 16.97-16.97 19.8 5.657 31.82 24.749 34.649 47.376.707 2.121-2.122 4.95-4.243 4.243"
          fill="var(--primary)"
        />
        <path d="M100 104a4 4 0 1 0 0-8 4 4 0 0 0 0 8" fill="#1f1b17" />
      </svg>
      {!iconOnly && (
        <span className="text-foreground order-1 grow-0 text-lg uppercase">
          Ovation
        </span>
      )}
    </div>
  );
};
