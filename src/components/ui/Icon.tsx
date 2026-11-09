import type { SVGProps } from "react";

const paths = {
  bag: (
    <>
      <path d="M5.5 8.5h13l-1 11.5h-11z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </>
  ),
  heart: (
    <path d="M12 19.5s-7.5-4.4-7.5-10A4.1 4.1 0 0 1 12 7.2a4.1 4.1 0 0 1 7.5 2.3c0 5.6-7.5 10-7.5 10z" />
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </>
  ),
  menu: <path d="M3.5 8h17M3.5 16h17" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  filter: <path d="M4 7h10m4 0h2M4 17h4m4 0h8M14 5v4M8 15v4" />,
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  /** Mirror the glyph in RTL layouts (arrows and chevrons). */
  flipRtl?: boolean;
}

export function Icon({ name, size = 20, flipRtl, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={[flipRtl ? "rtl:-scale-x-100" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
