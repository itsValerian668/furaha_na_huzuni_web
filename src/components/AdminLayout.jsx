import { NavLink, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useLocation } from 'react-router-dom';

const TABS = [
  { to: '/admin', label: 'Dashboard', match: '/admin' },
  { to: '/admin/requests/pending', label: 'Pending Requests', match: '/admin/requests/pending' },
  { to: '/admin/requests', label: 'All Requests', match: '/admin/requests' },
  { to: '/admin/users', label: 'Users', match: '/admin/users' },
  { to: '/admin/categories', label: 'Categories', match: '/admin/categories' },
  { to: '/admin/dues-schedules', label: 'Dues Schedules', match: '/admin/dues-schedules' },
  { to: '/admin/transactions', label: 'Transactions', match: '/admin/transactions' },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  // Pick the most specific matching tab (longest prefix), so nested routes
  // like /admin/dues-schedules/3 still highlight "Dues Schedules".
  const current =
    TABS.filter((t) => pathname === t.match || pathname.startsWith(`${t.match}/`))
      .sort((a, b) => b.match.length - a.match.length)[0]?.to || false;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 1 }}>
        Admin
      </Typography>

      <Tabs
        value={current}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.to} label={tab.label} value={tab.to} component={NavLink} to={tab.to} />
        ))}
      </Tabs>

      <Outlet />
    </Box>
  );
}
