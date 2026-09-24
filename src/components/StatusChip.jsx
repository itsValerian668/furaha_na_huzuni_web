import Chip from '@mui/material/Chip';

const STATUS_COLORS = {
  pending: 'warning',
  verified: 'success',
  rejected: 'error',
  closed: 'default',
  paid: 'success',
  late: 'error',
  completed: 'success',
  initiated: 'info',
  failed: 'error',
  active: 'success',
  inactive: 'default',
};

export default function StatusChip({ status, ...props }) {
  return (
    <Chip
      label={status}
      size="small"
      color={STATUS_COLORS[status] || 'default'}
      sx={{ textTransform: 'capitalize' }}
      {...props}
    />
  );
}
