import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { Link as RouterLink } from 'react-router-dom';
import { demoContributions, demoDues, demoProfile, demoRequests } from '../data/demo';
import { formatTsh } from '../utils/format';

function Stat({ label, value, detail }) {
  return <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="h5" fontWeight={800} sx={{ mt: 0.75 }}>{value}</Typography><Typography variant="caption" color="text.secondary">{detail}</Typography></Paper>;
}

export default function MemberDashboard() {
  const paid = demoDues.filter((item) => item.status === 'paid').length;
  const totalContributions = demoContributions.reduce((sum, item) => sum + item.amount, 0);
  return <Box>
    <Box sx={{ mb: 3 }}><Typography variant="h4" fontWeight={800}>Good morning, member</Typography><Typography color="text.secondary">Here is your cooperative account at a glance.</Typography></Box>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}><Stat label="Total contributions" value={formatTsh(totalContributions)} detail="This year" /></Grid>
      <Grid item xs={12} sm={6} md={3}><Stat label="Contribution status" value={`${paid}/${demoDues.length}`} detail="Monthly dues paid" /></Grid>
      <Grid item xs={12} sm={6} md={3}><Stat label="My requests" value={demoRequests.length} detail="2 active requests" /></Grid>
      <Grid item xs={12} sm={6} md={3}><Stat label="Member since" value="2020" detail="In good standing" /></Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}><Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}><Typography variant="h6" fontWeight={700}>Contribution summary</Typography><Button component={RouterLink} to="/contributions" size="small">View statement</Button></Box>{demoDues.map((item) => <Box key={item.id} sx={{ mb: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">{item.dues_schedule.month}/{item.dues_schedule.year} contribution</Typography><Typography variant="body2" fontWeight={700}>{formatTsh(item.amount)}</Typography></Box><LinearProgress variant="determinate" value={item.status === 'paid' ? 100 : 35} color={item.status === 'paid' ? 'success' : 'warning'} sx={{ mt: 1, height: 7, borderRadius: 4 }} /></Box>)}</Paper></Grid>
      <Grid item xs={12} md={5}><Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}><Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Profile details</Typography>{[['Member number', demoProfile.memberNumber], ['Phone', demoProfile.phone], ['Branch', demoProfile.branch], ['Status', demoProfile.status]].map(([label, value]) => <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="body2" fontWeight={600} textAlign="right">{value}</Typography></Box>)}<Button component={RouterLink} to="/appearance" sx={{ mt: 2 }} variant="outlined">Edit preferences</Button></Paper></Grid>
    </Grid>
  </Box>;
}
