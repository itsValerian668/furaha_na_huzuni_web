import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import apiClient from '../../api/client';
import RequestCard from '../../components/RequestCard';

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AllRequests() {
  const [status, setStatus] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get('/admin/requests', {
          params: { page, status: status || undefined },
        });
        if (!cancelled) {
          setRequests(data.data);
          setLastPage(data.last_page);
        }
      } catch {
        if (!cancelled) setError('Could not load requests.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, status]);

  return (
    <Box>
      <Tabs
        value={status}
        onChange={(_, value) => {
          setStatus(value);
          setPage(1);
        }}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {STATUSES.map((s) => (
          <Tab key={s.value} value={s.value} label={s.label} />
        ))}
      </Tabs>

      {loading && <CircularProgress size={28} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && requests.length === 0 && (
        <Typography color="text.secondary">No requests found.</Typography>
      )}

      <Grid container spacing={2}>
        {requests.map((request) => (
          <Grid item xs={12} sm={6} key={request.id}>
            <RequestCard request={request} />
          </Grid>
        ))}
      </Grid>

      {lastPage > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={lastPage} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      )}
    </Box>
  );
}
