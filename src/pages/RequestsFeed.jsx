import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RequestCard from '../components/RequestCard';
import { demoRequests } from '../data/demo';

export default function RequestsFeed() {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        Community Requests
      </Typography>

      <Grid container spacing={2}>
        {demoRequests.map((request) => (
          <Grid item xs={12} sm={6} key={request.id}>
            <RequestCard request={request} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
        Prototype data — ready to connect to the cooperative API.
      </Typography>
    </Box>
  );
}
