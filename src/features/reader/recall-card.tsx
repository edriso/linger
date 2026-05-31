import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ReadingText, Session } from '@/types/domain';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Overlay } from '@/components/overlay';
import { recallPrompts } from '@/lib/content';
import { formatMinutes } from '@/lib/format';

export interface ReaderStats {
  elapsed: number;
  longest: number;
  breaks: number;
  target: number;
}

interface RecallCardProps {
  text: ReadingText;
  stats: ReaderStats;
  onClose: () => void;
  onComplete: (session: Session | null) => void;
}

const schema = z.object({ recall: z.string() });
type RecallForm = z.infer<typeof schema>;

/** Shown when a reading session ends: a kind summary, then one recall prompt. */
export function RecallCard({ text, stats, onClose, onComplete }: RecallCardProps) {
  const [prompt] = useState(() => recallPrompts[Math.floor(Math.random() * recallPrompts.length)]);
  // Free reading has no target, so it is never "cleared", just read.
  const cleared = stats.target > 0 && stats.longest >= stats.target;

  const { register, handleSubmit } = useForm<RecallForm>({
    resolver: zodResolver(schema),
    defaultValues: { recall: '' },
  });

  const save = handleSubmit((data) => {
    const session: Session = {
      textId: text.id,
      title: text.title,
      at: Date.now(),
      seconds: stats.elapsed,
      longest: stats.longest,
      breaks: stats.breaks,
      cleared,
      target: stats.target,
      recall: data.recall.trim(),
    };
    onComplete(session);
  });

  return (
    <Overlay ariaLabel="Reading complete" onClose={onClose} className="l-veil">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            maxWidth: 520,
            margin: '0 auto',
            padding: 'min(9vh, 70px) 26px 60px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Icon name={cleared ? 'flame' : 'feather'} size={42} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--read)',
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: '-0.01em',
              margin: '0 0 10px',
            }}
          >
            {cleared ? 'You stayed.' : 'Good, you read.'}
          </h2>
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: 16,
              lineHeight: 1.55,
              margin: '0 0 30px',
              textWrap: 'pretty',
            }}
          >
            {cleared
              ? `You read for ${formatMinutes(stats.longest)} minutes unbroken. That's the muscle, working. The page didn't lose you once it mattered.`
              : `You read for ${formatMinutes(stats.elapsed)} minutes. Every page counts, staying gets easier from here.`}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 32 }}>
            <SummaryStat value={formatMinutes(stats.longest)} label="min unbroken" />
            <SummaryStat value={formatMinutes(stats.elapsed)} label="min total" />
            <SummaryStat value={String(stats.breaks)} label="exits" />
          </div>

          <form onSubmit={save}>
            <Card pad={20} style={{ textAlign: 'left', marginBottom: 22 }}>
              <div
                style={{
                  fontFamily: 'var(--read)',
                  fontStyle: 'italic',
                  fontSize: 19,
                  color: 'var(--text)',
                  margin: '0 0 14px',
                  lineHeight: 1.4,
                  textWrap: 'pretty',
                }}
              >
                {prompt}
              </div>
              <textarea
                {...register('recall')}
                placeholder="A line or two, in your own words…"
                rows={3}
                aria-label="Your recall note"
                className="l-input"
                style={{
                  width: '100%',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />
              <div style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 10 }}>
                Putting it in your own words is what makes it stick.
              </div>
            </Card>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button type="submit" variant="primary" size="lg" icon="check">
                Save &amp; close
              </Button>
              <Button onClick={() => onComplete(null)} variant="ghost" size="lg">
                Skip recall
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Overlay>
  );
}

function SummaryStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 24, color: 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>{label}</div>
    </div>
  );
}
