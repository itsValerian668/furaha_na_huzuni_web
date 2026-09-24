import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import apiClient from '../api/client';
import RequestCard from '../components/RequestCard';

export default function RequestsFeed() {
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
        const { data } = await apiClient.get('/requests', { params: { page } });
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
  }, [page]);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        Community Requests
      </Typography>

      {loading && <CircularProgress size={28} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && requests.length === 0 && (
        <Typography color="text.secondary">No verified requests yet.</Typography>
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
