import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import apiClient from '../../api/client';
import { formatTsh, formatDateTime, monthName } from '../../utils/format';

function StatCard({ label, value, sub, color = 'primary.main' }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, activityRes] = await Promise.all([
          apiClient.get('/admin/dashboard/stats'),
          apiClient.get('/admin/dashboard/recent-activity'),
        ]);
        if (!cancelled) {
          setStats(statsRes.data);
          setActivity(activityRes.data);
        }
      } catch {
        if (!cancelled) setError('Could not load dashboard data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <CircularProgress size={28} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return null;

  const schedule = stats.dues.current_schedule;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard label="Members" value={stats.members.total} sub={`${stats.members.admins} admins`} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Pending Requests"
            value={stats.requests.pending}
            color="warning.main"
            sub={`${stats.requests.verified} verified · ${stats.requests.closed} closed · ${stats.requests.rejected} rejected`}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Contributions Raised"
            value={formatTsh(stats.contributions.total_completed_amount)}
            sub={`${stats.contributions.total_completed_count} completed · ${stats.contributions.pending_count} pending`}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Dues Collected (All-Time)"
            value={formatTsh(stats.dues.all_time_collected)}
            color="secondary.main"
          />
        </Grid>
      </Grid>

      {schedule && (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 4 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Current Dues Schedule — {monthName(schedule.month)} {schedule.year}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" display="block">
                Per Member
              </Typography>
              <Typography fontWeight={700}>{formatTsh(schedule.amount_per_member)}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" display="block">
                Paid
              </Typography>
              <Typography fontWeight={700} color="success.main">
                {schedule.paid_count}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" display="block">
                Pending
              </Typography>
              <Typography fontWeight={700} color="warning.main">
                {schedule.pending_count}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" display="block">
                Collected
              </Typography>
              <Typography fontWeight={700}>
                {formatTsh(schedule.total_collected)} / {formatTsh(schedule.total_expected)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Recent Requests
            </Typography>
            {activity.recent_requests.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No requests yet.
              </Typography>
            )}
            {activity.recent_requests.map((r, i) => (
              <Box key={r.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Link component={RouterLink} to={`/requests/${r.id}`} underline="hover" noWrap sx={{ display: 'block' }}>
                      {r.title}
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      by {r.user?.name} · {formatDateTime(r.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ textTransform: 'capitalize', flexShrink: 0, ml: 1 }}>
                    {r.status}
                  </Typography>
                </Box>
                {i < activity.recent_requests.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Recent Contributions
            </Typography>
            {activity.recent_contributions.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No completed contributions yet.
              </Typography>
            )}
            {activity.recent_contributions.map((c, i) => (
              <Box key={c.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {c.user?.name} → {c.request?.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(c.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700} sx={{ flexShrink: 0, ml: 1 }}>
                    {formatTsh(c.amount)}
                  </Typography>
                </Box>
                {i < activity.recent_contributions.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
