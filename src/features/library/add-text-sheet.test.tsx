import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AddTextSheet } from './add-text-sheet';

describe('AddTextSheet', () => {
  it('keeps Add disabled until there is enough text, then saves it normalized', async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<AddTextSheet onClose={onClose} onSave={onSave} />);

    const addButton = screen.getByRole('button', { name: 'Add to library' });
    expect(addButton).toBeDisabled();

    const textarea = screen.getByLabelText('Text to read');
    fireEvent.change(textarea, {
      target: { value: 'This is a long enough pasted paragraph to be worth saving.' },
    });
    expect(addButton).toBeEnabled();

    fireEvent.submit(textarea.closest('form') as HTMLFormElement);

    await vi.waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const saved = onSave.mock.calls[0][0];
    expect(saved.custom).toBe(true);
    expect(saved.body[0]).toContain('long enough pasted paragraph');
  });
});
