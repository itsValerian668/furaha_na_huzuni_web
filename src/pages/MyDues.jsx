import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import StatusChip from '../components/StatusChip';
import { formatTsh, formatDate, monthName } from '../utils/format';
import { demoDues } from '../data/demo';

export default function MyDues() {
  const [payments, setPayments] = useState(demoDues);
  const [payingId, setPayingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  async function handlePay(duesPayment) {
    setFeedback(null);
    setPayingId(duesPayment.id);
    try {
      setFeedback({
        type: 'success',
        text: 'Demo payment recorded. No real payment was processed.',
      });
      setPayments((current) => current.map((payment) => payment.id === duesPayment.id ? { ...payment, status: 'paid', paid_at: '2026-11-06' } : payment));
    } catch {
      setFeedback({
        type: 'error',
        text: 'Could not initiate demo payment.',
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

      {payments.length === 0 && (
        <Typography color="text.secondary">No dues have been scheduled for you yet.</Typography>
      )}

      {payments.length > 0 && (
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

    </Box>
  );
}
