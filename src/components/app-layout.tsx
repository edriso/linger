import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { copy } from '@/lib/content';
import { useApplyReadingTheme } from '@/hooks/use-apply-reading-theme';
import { useLingerStore } from '@/store/linger-store';
import { ReaderHost } from '@/features/reader/reader-host';
import { SettingsOverlay } from '@/features/settings/settings-overlay';
import { Icon, type IconName } from './icon';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Read', icon: 'read', end: true },
  { to: '/library', label: 'Library', icon: 'library' },
  { to: '/progress', label: 'Progress', icon: 'progress' },
];

/**
 * The shell around every screen: a side rail on desktop, a bottom bar on
 * mobile, the routed screen in the middle, and the Reader and Settings overlays
 * on top.
 */
export function AppLayout() {
  const settings = useLingerStore((state) => state.settings);
  useApplyReadingTheme(settings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="l-app">
      {/* Desktop side rail */}
      <nav className="l-rail" aria-label="Main">
        <div className="l-brand">
          <span className="l-logo">
            <Icon name="read" size={20} />
          </span>
          <span>Linger</span>
        </div>
        <div className="l-rail-items">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'l-navitem l-tap' + (isActive ? ' is-on' : '')}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button onClick={() => setSettingsOpen(true)} className="l-navitem l-tap" type="button">
            <Icon name="aA" size={20} />
            <span>Settings</span>
          </button>
        </div>
        <div className="l-rail-foot">
          <div
            style={{
              fontFamily: 'var(--read)',
              fontStyle: 'italic',
              fontSize: 13,
              color: 'var(--text-faint)',
              lineHeight: 1.5,
            }}
          >
            &ldquo;{copy.tagline}&rdquo;
          </div>
        </div>
      </nav>

      {/* Routed screen */}
      <main className="l-main">
        <div className="l-col">
          <Outlet />
        </div>
      </main>

      {/* Mobile settings control, top right */}
      <div className="l-mobile-top">
        <button
          onClick={() => setSettingsOpen(true)}
          className="l-iconbtn l-tap"
          type="button"
          aria-label="Settings"
        >
          <Icon name="aA" size={20} />
        </button>
      </div>

      {/* Mobile bottom bar */}
      <nav className="l-bottom" aria-label="Main">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'l-tabbtn l-tap' + (isActive ? ' is-on' : '')}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <ReaderHost />
      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
