import { Icon, type IconName } from './icon';

interface StatProps {
  value: number | string;
  unit?: string;
  label: string;
  icon: IconName;
}

/** A small stat chip used in the stats row on the Read screen. */
export function Stat({ value, unit, label, icon }: StatProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background: 'var(--surface-2)',
          color: 'var(--accent)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={20} />
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1,
            color: 'var(--text)',
          }}
        >
          {value}
          {unit && (
            <span style={{ fontSize: 12, color: 'var(--text-faint)', marginLeft: 2 }}>{unit}</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}
