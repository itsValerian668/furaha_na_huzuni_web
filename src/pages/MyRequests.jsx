import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RequestCard from '../components/RequestCard';
import { demoRequests } from '../data/demo';

export default function MyRequests() {
  const requests = demoRequests.slice(0, 2);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        My Requests
      </Typography>

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
