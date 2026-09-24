import { useEffect, useState } from 'react';
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
import Pagination from '@mui/material/Pagination';
import StatusChip from '../components/StatusChip';
import apiClient from '../api/client';
import { formatTsh, formatDate, monthName } from '../utils/format';

export default function MyDues() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [payingId, setPayingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/dues/mine', { params: { page } });
      setPayments(data.data);
      setLastPage(data.last_page);
    } catch {
      setError('Could not load your dues.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handlePay(duesPayment) {
    setFeedback(null);
    setPayingId(duesPayment.id);
    try {
      const { data } = await apiClient.post(`/dues-payments/${duesPayment.id}/pay`);
      setFeedback({
        type: 'success',
        text: data.payment?.message || 'Payment initiated. Check your phone to approve.',
      });
      load();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Could not initiate payment.',
      });
    } finally {
      setPayingId(null);
    }
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        My Dues
      </Typography>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
          {feedback.text}
        </Alert>
      )}

      {loading && <CircularProgress size={28} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && payments.length === 0 && (
        <Typography color="text.secondary">No dues have been scheduled for you yet.</Typography>
      )}

      {!loading && payments.length > 0 && (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Period</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Paid On</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    {monthName(p.dues_schedule?.month)} {p.dues_schedule?.year}
                  </TableCell>
                  <TableCell>{formatTsh(p.amount)}</TableCell>
                  <TableCell>
                    <StatusChip status={p.status} />
                  </TableCell>
                  <TableCell>{p.paid_at ? formatDate(p.paid_at) : '—'}</TableCell>
                  <TableCell align="right">
                    {(p.status === 'pending' || p.status === 'late') && (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={payingId === p.id}
                        onClick={() => handlePay(p)}
                      >
                        {payingId === p.id ? 'Sending…' : 'Pay'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {lastPage > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={lastPage} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      )}
    </Box>
  );
}
