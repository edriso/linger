import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReadingText } from '@/types/domain';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Label } from '@/components/label';
import { ShelfRow } from '@/components/shelf-row';
import { Stat } from '@/components/stat';
import { levels, notes, shelf, copy } from '@/lib/content';
import { formatLongDate } from '@/lib/date';
import { formatMinutes } from '@/lib/format';
import { currentLevel } from '@/lib/level';
import { useLingerStore } from '@/store/linger-store';
import { useReaderStore } from '@/store/reader-store';

function greeting(hour: number): string {
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export function ReadScreen() {
  const navigate = useNavigate();
  const progress = useLingerStore((state) => state.progress);
  const library = useLingerStore((state) => state.library);
  const guidedRamp = useLingerStore((state) => state.settings.guidedRamp);
  const openReader = useReaderStore((state) => state.open);

  const note = useMemo(() => notes[Math.floor(Math.random() * notes.length)], []);
  const level = currentLevel(progress.clearedLevels, guidedRamp, levels);

  const lastSession = progress.sessions[progress.sessions.length - 1];
  const lastText: ReadingText | undefined = lastSession
    ? (shelf.find((text) => text.id === lastSession.textId) ??
      library.find((text) => text.id === lastSession.textId))
    : undefined;

  const now = new Date();

  return (
    <div className="l-screen">
      <header style={{ marginBottom: 24 }}>
        <Label style={{ marginBottom: 10 }}>{formatLongDate(now)}</Label>
        <h1
          style={{
            fontFamily: 'var(--read)',
            fontWeight: 600,
            margin: 0,
            fontSize: 34,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {greeting(now.getHours())}.
        </h1>
        <p
          style={{
            margin: '10px 0 0',
            color: 'var(--text-dim)',
            fontSize: 16,
            lineHeight: 1.5,
            fontFamily: 'var(--read)',
            fontStyle: 'italic',
          }}
        >
          {copy.tagline}
        </p>
      </header>

      {/* Today's session hero */}
      <Card accent pad={0} style={{ marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 22px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Label style={{ color: 'var(--accent)' }}>Today&rsquo;s read · Level {level.lvl}</Label>
            <span style={{ fontFamily: 'var(--ui)', fontSize: 12.5, color: 'var(--text-faint)' }}>
              {level.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 44,
                fontWeight: 500,
                lineHeight: 1,
                color: 'var(--text)',
              }}
            >
              {level.target}
            </span>
            <span style={{ fontFamily: 'var(--read)', fontSize: 19, color: 'var(--text-dim)' }}>
              minutes, unbroken
            </span>
          </div>
          <p
            style={{
              margin: '0 0 20px',
              color: 'var(--text-dim)',
              fontSize: 14.5,
              lineHeight: 1.55,
              textWrap: 'pretty',
            }}
          >
            Read one piece without leaving the page for {level.target} minutes to clear the level.
            Pick something below, or bring your own.
          </p>
          {lastText ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button onClick={() => openReader(lastText)} variant="primary" size="lg" icon="play">
                Continue &ldquo;{truncate(lastText.title, 22)}&rdquo;
              </Button>
              <Button onClick={() => navigate('/library')} variant="ghost" size="lg">
                Pick another
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/library')} variant="primary" size="lg" icon="read">
              Choose something to read
            </Button>
          )}
        </div>
      </Card>

      {/* Honest stats */}
      <Card pad={20} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stat
            value={formatMinutes(progress.longestEver)}
            unit="m"
            label="longest unbroken"
            icon="bookmark"
          />
          <Stat
            value={formatMinutes(progress.totalSeconds)}
            unit="m"
            label="total read"
            icon="clock"
          />
          <Stat value={progress.streak} label="day streak" icon="flame" />
        </div>
      </Card>

      {/* Shelf suggestions */}
      <Label style={{ marginBottom: 12 }}>From the shelf</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        {shelf.slice(0, 2).map((text) => (
          <ShelfRow key={text.id} text={text} onStart={() => openReader(text)} />
        ))}
      </div>

      <Card
        pad={18}
        style={{
          display: 'flex',
          gap: 13,
          alignItems: 'flex-start',
          background: 'var(--surface-2)',
        }}
      >
        <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>
          <Icon name="quote" size={19} />
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: 'var(--text-dim)',
            fontFamily: 'var(--read)',
            fontStyle: 'italic',
            textWrap: 'pretty',
          }}
        >
          {note}
        </p>
      </Card>
    </div>
  );
}
