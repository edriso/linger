import { useEffect } from 'react';
import { MEASURE, READ_FONTS } from '@/lib/constants';
import type { Settings } from '@/types/domain';

/**
 * Applies the reading and look settings to the page: resolves the theme
 * ("auto" picks dark in the evening), and sets the reading font, size, line
 * height, and measure as CSS variables the prose reads from.
 */
export function useApplyReadingTheme(settings: Settings): void {
  useEffect(() => {
    const root = document.documentElement;

    let theme = settings.theme;
    if (theme === 'auto') {
      const hour = new Date().getHours();
      theme = hour >= 19 || hour < 7 ? 'dark' : 'paper';
    }
    root.setAttribute('data-theme', theme);

    root.style.setProperty('--read', READ_FONTS[settings.readFont]);
    root.style.setProperty('--read-size', `${settings.fontSize}px`);
    root.style.setProperty('--read-leading', (settings.fontSize >= 21 ? 1.75 : 1.7).toFixed(2));
    root.style.setProperty('--measure', `${settings.measure + MEASURE.base}rem`);
  }, [settings.theme, settings.readFont, settings.fontSize, settings.measure]);
}
