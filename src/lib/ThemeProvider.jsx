import { useEffect } from 'react';
import { useWebsiteContent } from './useWebsiteContent';

// SCH/29 — Yale Blue + Gold (matches Heritage Academy logo)
const DEFAULTS = {
  primary_color:    '#0F2D6B',           // Yale blue  — shield, text, banner
  secondary_color:  '#C9A227',           // Gold       — laurel wreath, accents
  accent_color:     '#EAD282',           // Light gold — highlights, badges
  background_color: '#f8f9fc',           // Near-white with cool tint
  text_color:       '#0F2D6B',           // Yale blue  — body text
  font_family:      'Poppins, sans-serif',
  heading_font:     'Poppins, sans-serif',
  border_radius:    '0.5rem',
  spacing:          'normal',
};

/**
 * Applies theme from elite-api as CSS variables on :root.
 * Falls back to DEFAULTS when the API returns no theme object.
 * Also merges meta.primary_color / meta.secondary_color (stored in
 * school_website_content) when the dedicated theme columns are absent.
 */
export default function ThemeProvider({ children }) {
  const { theme, meta, loading } = useWebsiteContent();

  useEffect(() => {
    // Apply DEFAULTS immediately on mount so the page is never unstyled
    applyTheme(DEFAULTS);
  }, []);

  useEffect(() => {
    if (loading) return;

    // Build an effective theme object:
    // 1. Start with DEFAULTS
    // 2. Override with meta.primary_color / secondary_color (always present in DB)
    // 3. Override with full theme object if the API returned one
    const effective = {
      ...DEFAULTS,
      ...(meta?.primary_color   ? { primary_color:   meta.primary_color }   : {}),
      ...(meta?.secondary_color ? { secondary_color: meta.secondary_color } : {}),
      ...(theme || {}),
    };

    applyTheme(effective);
  }, [theme, meta, loading]);

  return children;
}

function applyTheme(t) {
  const root = document.documentElement;

  root.style.setProperty('--color-primary',    t.primary_color    || DEFAULTS.primary_color);
  root.style.setProperty('--color-secondary',  t.secondary_color  || DEFAULTS.secondary_color);
  root.style.setProperty('--color-accent',     t.accent_color     || DEFAULTS.accent_color);
  root.style.setProperty('--color-background', t.background_color || DEFAULTS.background_color);
  root.style.setProperty('--color-text',       t.text_color       || DEFAULTS.text_color);
  root.style.setProperty('--font-family',      t.font_family      || DEFAULTS.font_family);
  root.style.setProperty('--font-heading',     t.heading_font     || DEFAULTS.heading_font);
  root.style.setProperty('--border-radius',    t.border_radius    || DEFAULTS.border_radius);

  // Tailwind-compatible aliases
  root.style.setProperty('--primary',   t.primary_color   || DEFAULTS.primary_color);
  root.style.setProperty('--secondary', t.secondary_color || DEFAULTS.secondary_color);

  document.body.style.fontFamily       = t.font_family      || DEFAULTS.font_family;
  document.body.style.backgroundColor  = t.background_color || DEFAULTS.background_color;
  document.body.style.color            = t.text_color       || DEFAULTS.text_color;
}
