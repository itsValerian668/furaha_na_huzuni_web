import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Pagination from '@mui/material/Pagination';
import AddIcon from '@mui/icons-material/Add';
import apiClient from '../../api/client';
import { formatTsh, monthName } from '../../utils/format';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const now = new Date();

const emptyForm = { month: now.getMonth() + 1, year: now.getFullYear(), amount: '' };

export default function AdminDuesSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [feedback, setFeedback] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/admin/dues-schedules', { params: { page } });
      setSchedules(data.data);
      setLastPage(data.last_page);
    } catch {
      setError('Could not load dues schedules.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function openCreate() {
    setForm(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  }

  async function handleSave() {
    setFormError(null);
    setSaving(true);
    try {
      await apiClient.post('/admin/dues-schedules', form);
      setFeedback({ type: 'success', text: 'Dues schedule created and payment records generated.' });
      setDialogOpen(false);
      setPage(1);
      load();
    } catch (err) {
      const messages = err.response?.data?.errors;
      setFormError(
        messages ? Object.values(messages).flat().join(' ') : err.response?.data?.message || 'Could not create schedule.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
          {feedback.text}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          New Schedule
        </Button>
      </Box>

      {loading && <CircularProgress size={28} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Period</TableCell>
                <TableCell>Amount per Member</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>
                    {monthName(s.month)} {s.year}
                  </TableCell>
                  <TableCell>{formatTsh(s.amount)}</TableCell>
                  <TableCell align="right">
                    <Link component={RouterLink} to={`/admin/dues-schedules/${s.id}`} underline="hover">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">No dues schedules yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {lastPage > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={lastPage} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>New Dues Schedule</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Alert severity="info">A pending payment record will be generated for every member.</Alert>
          <TextField
            select
            label="Month"
            fullWidth
            value={form.month}
            onChange={(e) => setForm((f) => ({ ...f, month: Number(e.target.value) }))}
          >
            {MONTHS.map((m) => (
              <MenuItem key={m} value={m}>
                {monthName(m)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Year"
            type="number"
            fullWidth
            inputProps={{ min: 2020 }}
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
          />
          <TextField
            label="Amount per Member (TSh)"
            type="number"
            fullWidth
            inputProps={{ min: 1 }}
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={saving} onClick={handleSave}>
            {saving ? 'Creating…' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
