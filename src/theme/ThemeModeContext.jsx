import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { THEME_PRESETS, DEFAULT_PRESET_KEY, DEFAULT_MODE } from './palettes';

const ThemeModeContext = createContext(null);

function buildTheme(presetKey, mode) {
  const preset = THEME_PRESETS[presetKey] || THEME_PRESETS[DEFAULT_PRESET_KEY];
  const colors = preset[mode];

  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      background: { default: colors.background, paper: colors.paper },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` },
        },
      },
    },
  });
}

export function ThemeModeProvider({ children }) {
  const [presetKey, setPresetKeyState] = useState(
    () => localStorage.getItem('theme_preset') || DEFAULT_PRESET_KEY
  );
  const [mode, setModeState] = useState(
    () => localStorage.getItem('theme_mode') || DEFAULT_MODE
  );

  const setPresetKey = useCallback((key) => {
    localStorage.setItem('theme_preset', key);
    setPresetKeyState(key);
  }, []);

  const setMode = useCallback((newMode) => {
    localStorage.setItem('theme_mode', newMode);
    setModeState(newMode);
  }, []);

  const theme = useMemo(() => buildTheme(presetKey, mode), [presetKey, mode]);

  return (
    <ThemeModeContext.Provider value={{ presetKey, mode, setPresetKey, setMode, presets: THEME_PRESETS }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within a ThemeModeProvider');
  return ctx;
}
