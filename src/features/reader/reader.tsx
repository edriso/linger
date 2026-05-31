import type { ReadingText, Session } from '@/types/domain';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Overlay } from '@/components/overlay';
import { copy } from '@/lib/content';
import { formatClock } from '@/lib/format';
import { useReaderSession } from '@/hooks/use-reader-session';
import { RecallCard } from './recall-card';

interface ReaderProps {
  text: ReadingText;
  // Seconds of unbroken reading to clear this session (0 means no target).
  target: number;
  onClose: () => void;
  onComplete: (session: Session | null) => void;
}

/**
 * The full-screen, distraction-free Reader. Tracks the unbroken stretch with a
 * gentle focus-guard (leaving the tab resets it), shows progress quietly, and
 * moves to Recall when the target is reached or the reader finishes early.
 */
export function Reader({ text, target, onClose, onComplete }: ReaderProps) {
  const { state, scrollProgress, leftNote, toggle, finishEarly, onScroll, scrollRef } =
    useReaderSession(target);

  if (state.done) {
    return (
      <RecallCard
        text={text}
        stats={{ elapsed: state.elapsed, longest: state.longest, breaks: state.breaks, target }}
        onClose={onClose}
        onComplete={onComplete}
      />
    );
  }

  const unbrokenFraction = target > 0 ? Math.min(1, state.unbroken / target) : 0;
  const cleared = state.unbroken >= target && target > 0;

  return (
    <Overlay ariaLabel={`Reading: ${text.title}`} onClose={onClose}>
      {/* Top unbroken-progress bar */}
      <div style={{ position: 'relative', height: 3, background: 'var(--line)', flexShrink: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${unbrokenFraction * 100}%`,
            background: 'var(--accent)',
            transition: 'width .5s linear',
          }}
        />
      </div>

      {/* Quiet header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 22px',
          flexShrink: 0,
        }}
      >
        <button onClick={onClose} className="l-iconbtn l-tap" aria-label="Leave">
          <Icon name="x" size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--ui)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-dim)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {text.title}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--mono)',
            fontSize: 14,
            color: cleared ? 'var(--accent)' : 'var(--text-dim)',
            minWidth: 64,
            justifyContent: 'flex-end',
          }}
        >
          {!state.running && (
            <span
              style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--text-faint)' }}
            />
          )}
          {formatClock(state.unbroken)}
        </div>
      </div>

      {/* Scrollable prose */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="l-reader-scroll"
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
      >
        <article
          className="l-prose"
          style={{ maxWidth: 'var(--measure)', margin: '0 auto', padding: '40px 28px 140px' }}
        >
          {text.kicker && (
            <div
              style={{
                fontFamily: 'var(--ui)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: 'var(--accent)',
                marginBottom: 14,
                textTransform: 'uppercase',
              }}
            >
              {text.kicker}
            </div>
          )}
          <h1
            style={{
              fontFamily: 'var(--read)',
              fontWeight: 600,
              fontSize: 'calc(var(--read-size) * 1.7)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              margin: '0 0 32px',
              color: 'var(--text)',
            }}
          >
            {text.title}
          </h1>
          {text.body.map((paragraph, index) => (
            <p
              key={index}
              style={{
                fontFamily: 'var(--read)',
                fontSize: 'var(--read-size)',
                lineHeight: 'var(--read-leading)',
                color: 'var(--text)',
                margin: '0 0 1.35em',
                textWrap: 'pretty',
              }}
            >
              {paragraph}
            </p>
          ))}
          <div
            style={{
              marginTop: 48,
              paddingTop: 28,
              borderTop: '1px solid var(--line)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--ui)',
                fontSize: 13.5,
                color: 'var(--text-faint)',
                marginBottom: 16,
              }}
            >
              End of the piece.
            </div>
            <Button onClick={finishEarly} variant="soft" icon="check">
              Finish &amp; reflect
            </Button>
          </div>
        </article>
      </div>

      {/* Paused overlay */}
      {!state.running && !leftNote && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'color-mix(in oklab, var(--bg) 78%, transparent)',
            backdropFilter: 'blur(3px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 5,
          }}
        >
          <div style={{ textAlign: 'center', padding: 30 }}>
            <div
              style={{
                fontFamily: 'var(--read)',
                fontStyle: 'italic',
                fontSize: 22,
                color: 'var(--text-dim)',
                marginBottom: 22,
              }}
            >
              Paused.
            </div>
            <Button onClick={toggle} variant="primary" size="lg" icon="play">
              Keep reading
            </Button>
          </div>
        </div>
      )}

      {/* Gentle "you came back" note */}
      {leftNote && (
        <div
          className="l-fade"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 32,
            transform: 'translateX(-50%)',
            zIndex: 6,
            background: 'var(--surface)',
            border: '1px solid var(--accent-line)',
            borderRadius: 999,
            padding: '11px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: 'var(--shadow)',
          }}
        >
          <Icon name="leaf" size={17} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 13.5, color: 'var(--text-dim)' }}>{copy.leftNote}</span>
        </div>
      )}

      {/* Bottom control bar */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 22px calc(14px + env(safe-area-inset-bottom))',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: 'var(--bg)',
        }}
      >
        <button
          onClick={toggle}
          className="l-iconbtn l-tap"
          aria-label={state.running ? 'Pause' : 'Resume'}
        >
          <Icon name={state.running ? 'pauseSolid' : 'play'} size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span
              style={{
                fontFamily: 'var(--ui)',
                fontSize: 11.5,
                color: 'var(--text-faint)',
                letterSpacing: '0.04em',
              }}
            >
              {target > 0
                ? `UNBROKEN · ${Math.round(unbrokenFraction * 100)}% OF ${Math.round(target / 60)} MIN`
                : 'UNBROKEN · FREE READING'}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--text-faint)' }}>
              {Math.round(scrollProgress * 100)}% read
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: 'var(--surface-2)',
              borderRadius: 99,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${unbrokenFraction * 100}%`,
                background: 'var(--accent)',
                borderRadius: 99,
                transition: 'width .5s linear',
              }}
            />
          </div>
        </div>
      </div>
    </Overlay>
  );
}
