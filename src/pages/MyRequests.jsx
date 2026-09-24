import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import apiClient from '../api/client';
import RequestCard from '../components/RequestCard';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/requests/mine')
      .then(({ data }) => setRequests(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        My Requests
      </Typography>

      {loading && <CircularProgress size={28} />}
      {!loading && requests.length === 0 && (
        <Typography color="text.secondary">You haven't submitted any requests yet.</Typography>
      )}

      <Grid container spacing={2}>
        {requests.map((request) => (
          <Grid item xs={12} sm={6} key={request.id}>
            <RequestCard request={request} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
