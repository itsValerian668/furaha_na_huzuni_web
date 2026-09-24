// Each preset defines a primary/secondary color pair plus how the
// light and dark backgrounds should look. "swatch" is just the two
// dots/bars shown in the Appearance picker UI.

export const THEME_PRESETS = {
  'sable-gold': {
    label: 'Sable & Gold',
    description: 'Solemn depth, celebratory warmth',
    swatch: { primary: '#171009', secondary: '#D4AF37' },
    light: {
      primary: '#241B16',
      secondary: '#B8941F',
      background: '#F7F4EF',
      paper: '#FFFFFF',
    },
    dark: {
      primary: '#D4AF37',
      secondary: '#E4C569',
      background: '#171009',
      paper: '#241B16',
    },
  },
  'terracotta-sage': {
    label: 'Terracotta & Sage',
    description: 'Warm, earthy, community-minded',
    swatch: { primary: '#BF5B04', secondary: '#87986A' },
    light: {
      primary: '#BF5B04',
      secondary: '#6E7F52',
      background: '#FBF3EC',
      paper: '#FFFFFF',
    },
    dark: {
      primary: '#E07A2C',
      secondary: '#9CAD7E',
      background: '#241C16',
      paper: '#332821',
    },
  },
  'teal-coral': {
    label: 'Deep Teal & Coral',
    description: 'Trustworthy, quietly confident',
    swatch: { primary: '#0F6B5C', secondary: '#E4572E' },
    light: {
      primary: '#0F6B5C',
      secondary: '#D9532A',
      background: '#EEF6F3',
      paper: '#FFFFFF',
    },
    dark: {
      primary: '#3FA893',
      secondary: '#F07B54',
      background: '#0D1A17',
      paper: '#152622',
    },
  },
  'plum-amber': {
    label: 'Plum & Amber',
    description: 'Elegant and dignified',
    swatch: { primary: '#4A235A', secondary: '#C08A1E' },
    light: {
      primary: '#4A235A',
      secondary: '#B07D1E',
      background: '#F8F1FA',
      paper: '#FFFFFF',
    },
    dark: {
      primary: '#8E5AA3',
      secondary: '#D9A544',
      background: '#1C1220',
      paper: '#2A1B30',
    },
  },
};

export const DEFAULT_PRESET_KEY = 'sable-gold';
export const DEFAULT_MODE = 'dark';
