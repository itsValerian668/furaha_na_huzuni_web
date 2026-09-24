import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import StatusChip from './StatusChip';
import { formatTsh } from '../utils/format';

export default function RequestCard({ request }) {
  const progress = Math.min(
    100,
    Math.round((Number(request.current_amount) / Number(request.target_amount)) * 100)
  );

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardActionArea component={RouterLink} to={`/requests/${request.id}`}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {request.title}
            </Typography>
            <StatusChip status={request.status} />
          </Box>

          {request.category?.name && (
            <Typography variant="caption" color="secondary.main" display="block" gutterBottom>
              {request.category.name}
            </Typography>
          )}

          {request.user?.name && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              by {request.user.name}
            </Typography>
          )}

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {formatTsh(request.current_amount)} raised
            </Typography>
            <Typography variant="body2" color="text.secondary">
              of {formatTsh(request.target_amount)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
