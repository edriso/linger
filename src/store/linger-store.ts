import { create } from 'zustand';
import { repository } from '@/lib/repository';
import type { Progress, ReadFontId, ReadingText, Session, Settings, Theme } from '@/types/domain';

interface LingerState {
  settings: Settings;
  library: ReadingText[];
  progress: Progress;
  // Library actions.
  addText: (text: ReadingText) => void;
  removeText: (id: string) => void;
  // Recorded after a reading session finishes.
  completeSession: (session: Session) => void;
  // Settings actions.
  setTheme: (theme: Theme) => void;
  setReadFont: (font: ReadFontId) => void;
  setFontSize: (size: number) => void;
  setMeasure: (measure: number) => void;
  setGuidedRamp: (enabled: boolean) => void;
}

const initial = repository.getState();

export const useLingerStore = create<LingerState>((set, get) => {
  // Save a settings change through the repository, then mirror it into state.
  function patchSettings(patch: Partial<Settings>): void {
    const settings = { ...get().settings, ...patch };
    set({ settings });
    const state = get();
    repository.saveState({
      version: 1,
      settings,
      library: state.library,
      progress: state.progress,
    });
  }

  return {
    settings: initial.settings,
    library: initial.library,
    progress: initial.progress,

    addText: (text) => set({ library: repository.addText(text).library }),
    removeText: (id) => set({ library: repository.removeText(id).library }),
    completeSession: (session) =>
      set({ progress: repository.completeSession(session, new Date()).progress }),

    setTheme: (theme) => patchSettings({ theme }),
    setReadFont: (font) => patchSettings({ readFont: font }),
    setFontSize: (size) => patchSettings({ fontSize: size }),
    setMeasure: (measure) => patchSettings({ measure }),
    setGuidedRamp: (enabled) => patchSettings({ guidedRamp: enabled }),
  };
});
