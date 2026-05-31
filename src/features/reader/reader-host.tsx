import { levels } from '@/lib/content';
import { currentLevel } from '@/lib/level';
import { useLingerStore } from '@/store/linger-store';
import { useReaderStore } from '@/store/reader-store';
import { Reader } from './reader';

/**
 * Mounts the Reader when a text is open, with the right target for the current
 * level. When the guided ramp is off there is no target (free reading).
 */
export function ReaderHost() {
  const activeText = useReaderStore((state) => state.activeText);
  const close = useReaderStore((state) => state.close);
  const guidedRamp = useLingerStore((state) => state.settings.guidedRamp);
  const clearedLevels = useLingerStore((state) => state.progress.clearedLevels);
  const completeSession = useLingerStore((state) => state.completeSession);

  if (!activeText) {
    return null;
  }

  const level = currentLevel(clearedLevels, guidedRamp, levels);
  const target = guidedRamp ? level.target * 60 : 0;

  return (
    <Reader
      key={activeText.id}
      text={activeText}
      target={target}
      onClose={close}
      onComplete={(session) => {
        close();
        if (session) {
          completeSession(session);
        }
      }}
    />
  );
}
