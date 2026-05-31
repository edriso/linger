import type { ReactNode } from 'react';
import { Icon } from '@/components/icon';
import { Label } from '@/components/label';
import { Overlay } from '@/components/overlay';
import { FONT_SIZE, MEASURE, READ_FONT_OPTIONS, THEME_OPTIONS } from '@/lib/constants';
import { useLingerStore } from '@/store/linger-store';

interface SettingsOverlayProps {
  onClose: () => void;
}

/** A small, accessible panel for the reading and look settings. */
export function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const settings = useLingerStore((state) => state.settings);
  const setTheme = useLingerStore((state) => state.setTheme);
  const setReadFont = useLingerStore((state) => state.setReadFont);
  const setFontSize = useLingerStore((state) => state.setFontSize);
  const setMeasure = useLingerStore((state) => state.setMeasure);
  const setGuidedRamp = useLingerStore((state) => state.setGuidedRamp);

  return (
    <Overlay ariaLabel="Settings" onClose={onClose}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 20px',
        }}
      >
        <button onClick={onClose} className="l-iconbtn l-tap" aria-label="Close">
          <Icon name="x" size={20} />
        </button>
        <Label>Settings</Label>
        <div style={{ width: 42 }} />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 22px 40px',
          maxWidth: 460,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Section label="Theme">
          <PillGroup
            options={THEME_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
            selected={settings.theme}
            onSelect={(value) =>
              setTheme(value === 'dark' ? 'dark' : value === 'auto' ? 'auto' : 'paper')
            }
          />
        </Section>

        <Section label="Reading font">
          <PillGroup
            options={READ_FONT_OPTIONS.map((id) => ({ value: id, label: id }))}
            selected={settings.readFont}
            onSelect={(value) => {
              const match = READ_FONT_OPTIONS.find((id) => id === value);
              if (match) {
                setReadFont(match);
              }
            }}
          />
        </Section>

        <Section label={`Text size · ${settings.fontSize}px`}>
          <input
            type="range"
            min={FONT_SIZE.min}
            max={FONT_SIZE.max}
            step={FONT_SIZE.step}
            value={settings.fontSize}
            onChange={(event) => setFontSize(Number(event.target.value))}
            aria-label="Text size"
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </Section>

        <Section label={`Line width · ${settings.measure + MEASURE.base}rem`}>
          <input
            type="range"
            min={MEASURE.min}
            max={MEASURE.max}
            step={MEASURE.step}
            value={settings.measure}
            onChange={(event) => setMeasure(Number(event.target.value))}
            aria-label="Line width"
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </Section>

        <Section label="Training">
          <button
            type="button"
            onClick={() => setGuidedRamp(!settings.guidedRamp)}
            aria-pressed={settings.guidedRamp}
            className="l-tap"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 13,
              cursor: 'pointer',
              textAlign: 'left',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              color: 'inherit',
              font: 'inherit',
            }}
          >
            <span>
              <span style={{ fontWeight: 600, display: 'block' }}>Guided ramp</span>
              <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                Off means read any length, no level targets.
              </span>
            </span>
            <span
              aria-hidden="true"
              style={{
                width: 44,
                height: 26,
                borderRadius: 999,
                flexShrink: 0,
                background: settings.guidedRamp ? 'var(--accent)' : 'var(--surface-2)',
                border: '1px solid var(--line)',
                position: 'relative',
                transition: 'background .2s ease',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: settings.guidedRamp ? 20 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: settings.guidedRamp ? 'var(--on-accent)' : 'var(--text-faint)',
                  transition: 'left .2s ease',
                }}
              />
            </span>
          </button>
        </Section>
      </div>
    </Overlay>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <Label style={{ marginBottom: 12 }}>{label}</Label>
      {children}
    </div>
  );
}

interface PillOption {
  value: string;
  label: string;
}

function PillGroup({
  options,
  selected,
  onSelect,
}: {
  options: PillOption[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div role="group" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            aria-pressed={isSelected}
            className="l-tap"
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
              background: isSelected ? 'var(--accent-soft)' : 'transparent',
              color: isSelected ? 'var(--accent)' : 'var(--text-dim)',
              border: `1px solid ${isSelected ? 'var(--accent-line)' : 'var(--line)'}`,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
