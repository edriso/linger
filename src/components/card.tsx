import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  pad?: number;
  accent?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

/** The basic surface. Becomes a real button when `onClick` is given. */
export function Card({ children, style, pad = 22, accent = false, onClick, ariaLabel }: CardProps) {
  const base: CSSProperties = {
    background: 'var(--surface)',
    border: `1px solid ${accent ? 'var(--accent-line)' : 'var(--line)'}`,
    borderRadius: 'var(--radius)',
    padding: pad,
    ...style,
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="l-card l-tap"
        style={{
          ...base,
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
          width: '100%',
          display: 'block',
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="l-card" style={base}>
      {children}
    </div>
  );
}
