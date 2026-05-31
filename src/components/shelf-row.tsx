import type { ReadingText } from '@/types/domain';
import { estimateMinutes } from '@/lib/text';
import { Icon } from './icon';

interface ShelfRowProps {
  text: ReadingText;
  onStart: () => void;
  onDelete?: () => void;
}

/**
 * A compact row for a readable piece. The main area is a button that opens the
 * Reader; a separate delete button (kept as a sibling, never nested) appears
 * for the user's own texts.
 */
export function ShelfRow({ text, onStart, onDelete }: ShelfRowProps) {
  const minutes = estimateMinutes(text);
  const meta = text.custom ? 'Your text' : text.kicker || 'From the shelf';

  return (
    <div
      className="l-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        background: 'var(--surface)',
      }}
    >
      <button
        type="button"
        onClick={onStart}
        className="l-tap"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          font: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
          padding: '16px 8px 16px 16px',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 11,
            background: 'var(--surface-2)',
            color: 'var(--accent)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name={text.custom ? 'feather' : 'read'} size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              letterSpacing: '-0.01em',
              marginBottom: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {text.title}
          </div>
          <div style={{ fontFamily: 'var(--ui)', fontSize: 12.5, color: 'var(--text-faint)' }}>
            {meta} · {minutes} min
          </div>
        </div>
      </button>
      <div style={{ paddingRight: 12, flexShrink: 0 }}>
        {onDelete ? (
          <button
            onClick={onDelete}
            className="l-iconbtn l-tap"
            aria-label={`Remove ${text.title}`}
          >
            <Icon name="trash" size={17} />
          </button>
        ) : (
          <span style={{ color: 'var(--text-faint)' }} aria-hidden="true">
            <Icon name="chevR" size={20} />
          </span>
        )}
      </div>
    </div>
  );
}
