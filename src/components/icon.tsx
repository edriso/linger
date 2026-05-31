import type { CSSProperties, ReactElement } from 'react';

export type IconName =
  | 'read'
  | 'library'
  | 'progress'
  | 'play'
  | 'pauseSolid'
  | 'check'
  | 'arrow'
  | 'chevR'
  | 'chevL'
  | 'x'
  | 'plus'
  | 'clock'
  | 'feather'
  | 'flame'
  | 'bookmark'
  | 'quote'
  | 'leaf'
  | 'sun'
  | 'moon'
  | 'trash'
  | 'minus'
  | 'aA';

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: CSSProperties;
}

/**
 * The minimal line-icon set, ported from the design prototype so the look
 * matches exactly. Decorative by default (aria-hidden).
 */
export function Icon({ name, size = 22, stroke = 1.6, style }: IconProps): ReactElement {
  const p = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const paths: Record<IconName, ReactElement> = {
    read: (
      <>
        <path
          {...p}
          d="M12 6.5C10 5 7 4.5 4 4.8V18c3-.3 6 .2 8 1.6 2-1.4 5-1.9 8-1.6V4.8c-3-.3-6 .2-8 1.7Z"
        />
        <path {...p} d="M12 6.5v13" />
      </>
    ),
    library: (
      <>
        <path {...p} d="M5 4h4v16H5zM10.5 4h4v16h-4z" />
        <path {...p} d="M16.5 5l3 .6-2.6 14.8-3-.6z" />
      </>
    ),
    progress: (
      <>
        <path {...p} d="M4 19V5M4 19h16" />
        <path {...p} d="M8 16l3.5-4 3 2.4L19 8" />
      </>
    ),
    play: <path {...p} d="M9 6.5 17 12l-8 5.5z" />,
    pauseSolid: <path {...p} d="M9.5 6.5v11M14.5 6.5v11" />,
    check: <path {...p} d="M5 12.5 9.5 17 19 7" />,
    arrow: <path {...p} d="M5 12h13M13 6.5 18.5 12 13 17.5" />,
    chevR: <path {...p} d="M9.5 6l6 6-6 6" />,
    chevL: <path {...p} d="M14.5 6l-6 6 6 6" />,
    x: <path {...p} d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />,
    plus: <path {...p} d="M12 5v14M5 12h14" />,
    clock: (
      <>
        <circle {...p} cx="12" cy="12" r="8.5" />
        <path {...p} d="M12 7.5V12l3.2 1.8" />
      </>
    ),
    feather: (
      <>
        <path {...p} d="M20 5C12.5 5 6 9 6 16.5V19" />
        <path {...p} d="M6 19c4-4 7-5 12-5M9 13h6" />
      </>
    ),
    flame: (
      <path
        {...p}
        d="M12 3c.5 3-2 4-2 7a2 2 0 0 0 4 0c0-1 0-1.5-.5-2.5C16 9 17 11 17 14a5 5 0 0 1-10 0c0-4 3-5 5-11Z"
      />
    ),
    bookmark: <path {...p} d="M7 4h10v16l-5-3.5L7 20z" />,
    quote: (
      <path
        {...p}
        d="M9 7c-2 0-3.5 1.5-3.5 3.5S7 14 9 14c0 2-1.5 3-3 3.5M19 7c-2 0-3.5 1.5-3.5 3.5S17 14 19 14c0 2-1.5 3-3 3.5"
      />
    ),
    leaf: (
      <>
        <path {...p} d="M6 18C6 9 12 5 19 5c0 9-6 13-13 13Z" />
        <path {...p} d="M9 15c2-3 5-5 8-6" />
      </>
    ),
    sun: (
      <>
        <circle {...p} cx="12" cy="12" r="4" />
        <path
          {...p}
          d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19"
        />
      </>
    ),
    moon: <path {...p} d="M19 13.5A7.5 7.5 0 1 1 10.5 5a6 6 0 0 0 8.5 8.5Z" />,
    trash: <path {...p} d="M5 7h14M10 7V5h4v2M6 7l1 12h10l1-12" />,
    minus: <path {...p} d="M5 12h14" />,
    aA: <path {...p} d="M3 17 7 7l4 10M4.2 14h5.6M14 17l3-7 3 7M14.8 14.6h4.4" />,
  };

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
