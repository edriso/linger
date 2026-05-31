import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Label } from '@/components/label';
import { levels } from '@/lib/content';
import { formatMinutes } from '@/lib/format';
import { formatShortDate } from '@/lib/date';
import { currentLevel } from '@/lib/level';
import { useLingerStore } from '@/store/linger-store';

export function ProgressScreen() {
  const progress = useLingerStore((state) => state.progress);
  const guidedRamp = useLingerStore((state) => state.settings.guidedRamp);

  const level = currentLevel(progress.clearedLevels, guidedRamp, levels);
  const cleared = progress.clearedLevels;
  const sessions = progress.sessions.slice().reverse();

  return (
    <div className="l-screen">
      <header style={{ marginBottom: 22 }}>
        <h1
          style={{
            fontFamily: 'var(--read)',
            fontWeight: 600,
            margin: 0,
            fontSize: 32,
            letterSpacing: '-0.02em',
          }}
        >
          Progress
        </h1>
        <p
          style={{
            margin: '8px 0 0',
            color: 'var(--text-dim)',
            fontSize: 15.5,
            lineHeight: 1.5,
            textWrap: 'pretty',
          }}
        >
          The muscle, growing. Couch-to-deep-reader, one level at a time.
        </p>
      </header>

      {/* The ramp */}
      <Card pad={20} style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Label>The ramp</Label>
          <span style={{ fontFamily: 'var(--ui)', fontSize: 12.5, color: 'var(--accent)' }}>
            Level {level.lvl} of {levels.length}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {levels.map((lv) => {
            const isDone = lv.lvl <= cleared;
            const isCurrent = lv.lvl === level.lvl;
            return (
              <div
                key={lv.lvl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  padding: '9px 12px',
                  borderRadius: 12,
                  background: isCurrent ? 'var(--accent-soft)' : 'transparent',
                  border: `1px solid ${isCurrent ? 'var(--accent-line)' : 'transparent'}`,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: isDone ? 'var(--accent)' : 'transparent',
                    color: isDone ? 'var(--on-accent)' : 'var(--text-faint)',
                    border: isDone ? 'none' : '1.5px solid var(--line)',
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                  }}
                >
                  {isDone ? <Icon name="check" size={15} stroke={2.3} /> : lv.lvl}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCurrent
                      ? 'var(--text)'
                      : isDone
                        ? 'var(--text-dim)'
                        : 'var(--text-faint)',
                    fontSize: 14.5,
                  }}
                >
                  {lv.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                    color: isCurrent ? 'var(--accent)' : 'var(--text-faint)',
                  }}
                >
                  {lv.target}m
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reading log */}
      <Label style={{ marginBottom: 12 }}>Reading log</Label>
      {sessions.length === 0 ? (
        <Card pad={24} style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-faint)', fontSize: 14.5, lineHeight: 1.5 }}>
            No sessions yet. Your first read will appear here.
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sessions.map((session) => (
            <Card key={session.at} pad={16}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginBottom: session.recall ? 9 : 0,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {session.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--ui)',
                      fontSize: 12.5,
                      color: 'var(--text-faint)',
                      marginTop: 2,
                    }}
                  >
                    {formatShortDate(new Date(session.at))} · {formatMinutes(session.longest)} min
                    unbroken
                    {session.cleared ? ' · cleared' : ''}
                  </div>
                </div>
                {session.cleared && (
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>
                    <Icon name="flame" size={18} />
                  </span>
                )}
              </div>
              {session.recall && (
                <div
                  style={{
                    fontFamily: 'var(--read)',
                    fontStyle: 'italic',
                    fontSize: 14.5,
                    color: 'var(--text-dim)',
                    lineHeight: 1.5,
                    paddingTop: 9,
                    borderTop: '1px solid var(--line)',
                    textWrap: 'pretty',
                  }}
                >
                  &ldquo;{session.recall}&rdquo;
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
