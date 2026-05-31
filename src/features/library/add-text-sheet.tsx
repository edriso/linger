import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ReadingText } from '@/types/domain';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Sheet } from '@/components/sheet';
import { MIN_PASTE_LENGTH } from '@/lib/constants';
import { estimateMinutesFromWords, makeCustomText, wordCount } from '@/lib/text';

const schema = z.object({
  title: z.string(),
  body: z.string().trim().min(MIN_PASTE_LENGTH, 'Paste a little more text to save it'),
});
type AddTextForm = z.infer<typeof schema>;

interface AddTextSheetProps {
  onClose: () => void;
  onSave: (text: ReadingText) => void;
}

/** The bottom sheet for pasting your own text into the library. */
export function AddTextSheet({ onClose, onSave }: AddTextSheetProps) {
  const { register, handleSubmit, watch } = useForm<AddTextForm>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', body: '' },
  });

  const body = watch('body');
  const words = wordCount(body);
  const minutes = estimateMinutesFromWords(words);
  const valid = body.trim().length >= MIN_PASTE_LENGTH;

  const save = handleSubmit((data) => {
    onSave(makeCustomText({ id: `u${Date.now()}`, title: data.title, body: data.body }));
  });

  return (
    <Sheet ariaLabel="Paste a read" onClose={onClose}>
      <form onSubmit={save}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <h2 style={{ fontFamily: 'var(--read)', fontWeight: 600, fontSize: 22, margin: 0 }}>
            Paste a read
          </h2>
          <button type="button" onClick={onClose} className="l-iconbtn l-tap" aria-label="Close">
            <Icon name="x" size={20} />
          </button>
        </div>

        <input
          {...register('title')}
          placeholder="Title (optional)"
          aria-label="Title"
          className="l-input"
          style={{ width: '100%', marginBottom: 12 }}
        />
        <textarea
          {...register('body')}
          placeholder="Paste the article, essay, or chapter here. Plain text works best."
          rows={9}
          aria-label="Text to read"
          className="l-input"
          style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.55 }}
          autoFocus
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 14,
          }}
        >
          <span style={{ fontFamily: 'var(--ui)', fontSize: 13, color: 'var(--text-faint)' }}>
            {words > 0
              ? `${words.toLocaleString()} words · ~${minutes} min`
              : 'Plain text works best'}
          </span>
          <Button type="submit" variant="primary" icon="check" disabled={!valid}>
            Add to library
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
