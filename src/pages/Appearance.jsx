import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useThemeMode } from '../theme/ThemeModeContext';

export default function Appearance() {
  const navigate = useNavigate();
  const { presetKey, mode, setPresetKey, setMode, presets } = useThemeMode();

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', px: 2, py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          Appearance
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a look you like. Tap a theme to preview it instantly — you can change it anytime.
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, value) => value && setMode(value)}
        fullWidth
        sx={{ mb: 3 }}
      >
        <ToggleButton value="light" sx={{ gap: 1 }}>
          <LightModeIcon fontSize="small" /> Light
        </ToggleButton>
        <ToggleButton value="dark" sx={{ gap: 1 }}>
          <DarkModeIcon fontSize="small" /> Dark
        </ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={2}>
        {Object.entries(presets).map(([key, preset]) => {
          const selected = key === presetKey;
          return (
            <Grid item xs={6} key={key}>
              <Paper
                onClick={() => setPresetKey(key)}
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? 'primary.main' : 'divider',
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: preset.swatch.primary,
                    mb: 4,
                  }}
                />
                <Box
                  sx={{
                    width: '70%',
                    height: 6,
                    borderRadius: 3,
                    bgcolor: preset.swatch.primary,
                    mb: 0.75,
                  }}
                />
                <Box
                  sx={{
                    width: '45%',
                    height: 6,
                    borderRadius: 3,
                    bgcolor: preset.swatch.secondary,
                    mb: 2,
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {preset.label}
                  </Typography>
                  {selected && <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} />}
                </Box>
                <Typography variant="caption" color="text.secondary" noWrap component="div">
                  {preset.description}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 4, borderRadius: 3, py: 1.5 }}
        onClick={() => navigate(-1)}
      >
        Done
      </Button>
    </Box>
  );
}
