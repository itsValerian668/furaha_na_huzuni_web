import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatTsh } from '../utils/format';
import StatusChip from '../components/StatusChip';

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [amount, setAmount] = useState('');
  const [contributing, setContributing] = useState(false);
  const [contributeMessage, setContributeMessage] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get(`/requests/${id}`);
      setRequest(data);
    } catch {
      setError('Could not load this request.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleContribute(e) {
    e.preventDefault();
    setContributeMessage(null);
    setContributing(true);
    try {
      const { data } = await apiClient.post(`/requests/${id}/contributions`, {
        amount: Number(amount),
      });
      setContributeMessage({
        type: 'success',
        text: data.payment?.message || 'Contribution initiated. Check your phone to approve.',
      });
      setAmount('');
      load();
    } catch (err) {
      setContributeMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not initiate contribution.',
      });
    } finally {
      setContributing(false);
    }
  }

  if (loading) return <CircularProgress size={28} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!request) return null;

  const isOwner = request.user_id === user?.id;
  const canContribute = request.status === 'verified' && !isOwner;
  const progress = Math.min(
    100,
    Math.round((Number(request.current_amount) / Number(request.target_amount)) * 100)
  );

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {request.title}
        </Typography>
        <StatusChip status={request.status} />
      </Box>

      {request.category?.name && (
        <Typography variant="body2" color="secondary.main" gutterBottom>
          {request.category.name}
        </Typography>
      )}
      {request.user?.name && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Requested by {request.user.name}
        </Typography>
      )}

      <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
        {request.description}
      </Typography>

      <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {formatTsh(request.current_amount)} raised
        </Typography>
        <Typography variant="body2" color="text.secondary">
          of {formatTsh(request.target_amount)}
        </Typography>
      </Box>

      {request.admin_note && request.status === 'rejected' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Rejected: {request.admin_note}
        </Alert>
      )}

      {request.attachments && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Verification Documents
          </Typography>
          {request.attachments.map((a) => (
            <Typography variant="body2" color="text.secondary" key={a.id}>
              • {a.label}
            </Typography>
          ))}
        </Box>
      )}

      {isOwner && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This is your own request.
        </Typography>
      )}

      {canContribute && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Contribute
          </Typography>

          {contributeMessage && (
            <Alert severity={contributeMessage.type} sx={{ mb: 2 }}>
              {contributeMessage.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleContribute} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              type="number"
              size="small"
              placeholder="Amount (TSh)"
              required
              inputProps={{ min: 500 }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button type="submit" variant="contained" disabled={contributing}>
              {contributing ? 'Sending…' : 'Contribute'}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
