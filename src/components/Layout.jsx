import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

function NavItem({ to, children }) {
  return (
    <Button
      component={NavLink}
      to={to}
      end
      sx={{
        color: 'inherit',
        '&.active': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        },
      }}
      size="small"
    >
      {children}
    </Button>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
          <Typography variant="h6" fontWeight={700} color="primary" sx={{ flexGrow: 0, mr: 2 }}>
            Huzuni na Furaha
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flexGrow: 1 }}>
            <NavItem to="/">Feed</NavItem>
            <NavItem to="/requests/mine">My Requests</NavItem>
            <NavItem to="/requests/new">New Request</NavItem>
            <NavItem to="/dues">My Dues</NavItem>
            <NavItem to="/contributions">My Contributions</NavItem>
            {user?.role === 'admin' && <NavItem to="/admin">Admin</NavItem>}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {user?.name}
          </Typography>
          <IconButton component={NavLink} to="/appearance" aria-label="Appearance settings">
            <SettingsIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleLogout} aria-label="Logout">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
