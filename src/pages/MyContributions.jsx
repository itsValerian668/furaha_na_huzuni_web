import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import StatusChip from '../components/StatusChip';
import { formatTsh, formatDate } from '../utils/format';
import { demoContributions } from '../data/demo';

export default function MyContributions() {
  const contributions = demoContributions;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        My Contributions
      </Typography>

      {contributions.length === 0 && (
        <Typography color="text.secondary">You haven't contributed to any requests yet.</Typography>
      )}

      {contributions.length > 0 && (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributions.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    {c.request ? (
                      <Link component={RouterLink} to={`/requests/${c.request.id}`} underline="hover">
                        {c.request.title}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>{formatTsh(c.amount)}</TableCell>
                  <TableCell>
                    <StatusChip status={c.status} />
                  </TableCell>
                  <TableCell>{formatDate(c.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </Box>
  );
}
