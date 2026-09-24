import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import StatusChip from '../../components/StatusChip';
import apiClient from '../../api/client';
import { formatTsh, formatDate, monthName } from '../../utils/format';

export default function AdminDuesScheduleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminding, setReminding] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get(`/admin/dues-schedules/${id}`);
      setSchedule(data);
    } catch {
      setError('Could not load this dues schedule.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleRemind() {
    setFeedback(null);
    setReminding(true);
    try {
      const { data } = await apiClient.post(`/admin/dues-schedules/${id}/remind`);
      setFeedback({ type: 'success', text: data.message });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Could not send reminders.' });
    } finally {
      setReminding(false);
    }
  }

  if (loading) return <CircularProgress size={28} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!schedule) return null;

  const unpaidCount = (schedule.payments || []).filter((p) => p.status !== 'paid').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/dues-schedules')} aria-label="Back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          {monthName(schedule.month)} {schedule.year} — {formatTsh(schedule.amount)} per member
        </Typography>
      </Box>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
          {feedback.text}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<NotificationsActiveIcon />}
          disabled={reminding || unpaidCount === 0}
          onClick={handleRemind}
        >
          {reminding ? 'Sending…' : `Remind ${unpaidCount} Unpaid Member(s)`}
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(schedule.payments || []).map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.user?.name}</TableCell>
                <TableCell>
                  <Typography variant="body2">{p.user?.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.user?.phone}
                  </Typography>
                </TableCell>
                <TableCell>{formatTsh(p.amount)}</TableCell>
                <TableCell>
                  <StatusChip status={p.status} />
                </TableCell>
                <TableCell>{p.paid_at ? formatDate(p.paid_at) : '—'}</TableCell>
              </TableRow>
            ))}
            {(schedule.payments || []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color="text.secondary">No members to bill yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
