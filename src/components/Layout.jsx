import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SavingsIcon from '@mui/icons-material/Savings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../theme/ThemeModeContext';

const memberLinks = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/requests/mine', label: 'Requests', icon: <RequestQuoteIcon /> },
  { to: '/contributions', label: 'Contributions', icon: <SavingsIcon /> },
  { to: '/payments', label: 'Payments', icon: <ReceiptLongIcon /> },
  { to: '/dependants', label: 'Dependants', icon: <FamilyRestroomIcon /> },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { mode, setMode } = useThemeMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const drawer = (
    <Box sx={{ width: 260, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h6" fontWeight={800} color="primary">Huzuni na Furaha</Typography>
        <Typography variant="caption" color="text.secondary">Member cooperative</Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        {memberLinks.map((link) => (
          <ListItemButton key={link.to} component={NavLink} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2, mb: 0.5, '&.active': { bgcolor: 'primary.main', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'inherit' } } }}>
            <ListItemIcon sx={{ minWidth: 38 }}>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
        <ListItemButton component={NavLink} to="/admin" onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2, mb: 0.5, '&.active': { bgcolor: 'primary.main', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'inherit' } } }}>
          <ListItemIcon sx={{ minWidth: 38 }}><AdminPanelSettingsIcon /></ListItemIcon>
          <ListItemText primary="Administration" secondary="Admin + member view" />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/admin/members" onClick={() => setMobileOpen(false)} sx={{ pl: 4, borderRadius: 2 }}><ListItemIcon sx={{ minWidth: 38 }}><GroupsIcon /></ListItemIcon><ListItemText primary="Manage members" /></ListItemButton>
        <ListItemButton component={NavLink} to="/admin/meetings" onClick={() => setMobileOpen(false)} sx={{ pl: 4, borderRadius: 2 }}><ListItemIcon sx={{ minWidth: 38 }}><EventIcon /></ListItemIcon><ListItemText primary="Manage meetings" /></ListItemButton>
        <ListItemButton component={NavLink} to="/admin/contributions" onClick={() => setMobileOpen(false)} sx={{ pl: 4, borderRadius: 2 }}><ListItemIcon sx={{ minWidth: 38 }}><SavingsIcon /></ListItemIcon><ListItemText primary="Manage contributions" /></ListItemButton>
      </List>
      <Box sx={{ mt: 'auto', p: 1.5 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 38 }}>{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</ListItemIcon>
          <ListItemText primary={mode === 'light' ? 'Use dark theme' : 'Use light theme'} />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/appearance" onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 38 }}><SettingsIcon /></ListItemIcon><ListItemText primary="Appearance" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 38 }}><LogoutIcon /></ListItemIcon><ListItemText primary="Sign out" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
      <Drawer variant={desktop ? 'permanent' : 'temporary'} open={desktop || mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 } }}>{drawer}</Drawer>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ gap: 1 }}>
            {!desktop && <IconButton onClick={() => setMobileOpen(true)} aria-label="Open navigation"><MenuIcon /></IconButton>}
            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">Admin preview</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}><Outlet /></Container>
      </Box>
    </Box>
  );
}
