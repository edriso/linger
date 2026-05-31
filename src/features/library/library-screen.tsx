import { useState } from 'react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { ShelfRow } from '@/components/shelf-row';
import { shelf } from '@/lib/content';
import { estimateMinutes } from '@/lib/text';
import { useLingerStore } from '@/store/linger-store';
import { useReaderStore } from '@/store/reader-store';
import { AddTextSheet } from './add-text-sheet';

export function LibraryScreen() {
  const library = useLingerStore((state) => state.library);
  const addText = useLingerStore((state) => state.addText);
  const removeText = useLingerStore((state) => state.removeText);
  const openReader = useReaderStore((state) => state.open);
  const [adding, setAdding] = useState(false);

  return (
    <div className="l-screen">
      <header
        style={{
          marginBottom: 20,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--read)',
              fontWeight: 600,
              margin: 0,
              fontSize: 32,
              letterSpacing: '-0.02em',
            }}
          >
            Library
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
            Bring the long read you keep meaning to finish.
          </p>
        </div>
        <Button
          onClick={() => setAdding(true)}
          variant="primary"
          icon="plus"
          style={{ flexShrink: 0 }}
        >
          Paste text
        </Button>
      </header>

      {library.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Label style={{ marginBottom: 12 }}>Your texts</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {library
              .slice()
              .reverse()
              .map((text) => (
                <ShelfRow
                  key={text.id}
                  text={text}
                  onStart={() => openReader(text)}
                  onDelete={() => removeText(text.id)}
                />
              ))}
          </div>
        </div>
      )}

      <Label style={{ marginBottom: 12 }}>The shelf · short reads to start</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shelf.map((text) => (
          <Card
            key={text.id}
            pad={18}
            onClick={() => openReader(text)}
            ariaLabel={`Read ${text.title}`}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--ui)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                }}
              >
                {text.kicker}
              </div>
              <span
                style={{
                  fontFamily: 'var(--ui)',
                  fontSize: 12.5,
                  color: 'var(--text-faint)',
                  whiteSpace: 'nowrap',
                }}
              >
                {estimateMinutes(text)} min
              </span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--read)',
                fontWeight: 600,
                fontSize: 21,
                letterSpacing: '-0.01em',
                margin: '0 0 8px',
              }}
            >
              {text.title}
            </h3>
            <p
              style={{
                margin: 0,
                color: 'var(--text-dim)',
                fontSize: 14.5,
                lineHeight: 1.55,
                textWrap: 'pretty',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {text.body[0]}
            </p>
          </Card>
        ))}
      </div>

      {adding && (
        <AddTextSheet
          onClose={() => setAdding(false)}
          onSave={(text) => {
            addText(text);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}
