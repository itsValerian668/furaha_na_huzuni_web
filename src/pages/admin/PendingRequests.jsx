import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import apiClient from '../../api/client';
import { formatTsh, formatDateTime, fileUrl } from '../../utils/format';

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/admin/requests/pending', { params: { page } });
      setRequests(data.data);
      setLastPage(data.last_page);
    } catch {
      setError('Could not load pending requests.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleVerify(request) {
    setFeedback(null);
    setBusyId(request.id);
    try {
      await apiClient.post(`/admin/requests/${request.id}/verify`);
      setFeedback({ type: 'success', text: `"${request.title}" was verified.` });
      load();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Could not verify request.' });
    } finally {
      setBusyId(null);
    }
  }

  function openReject(request) {
    setRejectTarget(request);
    setAdminNote('');
  }

  async function handleReject() {
    if (!rejectTarget) return;
    setFeedback(null);
    setBusyId(rejectTarget.id);
    try {
      await apiClient.post(`/admin/requests/${rejectTarget.id}/reject`, { admin_note: adminNote });
      setFeedback({ type: 'success', text: `"${rejectTarget.title}" was rejected.` });
      setRejectTarget(null);
      load();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Could not reject request.' });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Box>
      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
          {feedback.text}
        </Alert>
      )}

      {loading && <CircularProgress size={28} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && requests.length === 0 && (
        <Typography color="text.secondary">No requests are awaiting review.</Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {requests.map((r) => (
          <Paper key={r.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {r.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {r.user?.name} · {r.user?.phone} · {r.user?.email}
                </Typography>
                <Typography variant="caption" color="secondary.main" display="block" sx={{ mb: 1 }}>
                  {r.category?.name} · submitted {formatDateTime(r.created_at)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
                  {r.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target: {formatTsh(r.target_amount)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 140 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  disabled={busyId === r.id}
                  onClick={() => handleVerify(r)}
                >
                  Verify
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  disabled={busyId === r.id}
                  onClick={() => openReject(r)}
                >
                  Reject
                </Button>
              </Box>
            </Box>

            {r.attachments?.length > 0 && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  Verification Documents
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {r.attachments.map((a) => (
                    <Chip
                      key={a.id}
                      component={Link}
                      href={fileUrl(a.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      clickable
                      label={a.label}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </>
            )}
          </Paper>
        ))}
      </Box>

      {lastPage > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={lastPage} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      )}

      <Dialog open={!!rejectTarget} onClose={() => setRejectTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle>Reject "{rejectTarget?.title}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Reason for rejection"
            multiline
            rows={3}
            fullWidth
            required
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectTarget(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={!adminNote.trim() || busyId === rejectTarget?.id}
            onClick={handleReject}
          >
            Reject Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
