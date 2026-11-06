import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Chip from '@mui/material/Chip';
import { demoMembers } from '../../data/demo';
import { formatTsh } from '../../utils/format';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

function monthlyRows(month) {
  return demoMembers.map((member, index) => ({
    ...member,
    amount: month === currentMonth && member.status === 'Inactive' ? 0 : 25000 + (index % 3) * 5000,
    paymentStatus: month === currentMonth && (member.status === 'Inactive' || index === 3) ? 'Pending' : 'Paid',
  }));
}

export default function ManageContributions() {
  const [month, setMonth] = useState(String(currentMonth));
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'name', direction: 'asc' });
  const rows = useMemo(() => {
    const filtered = monthlyRows(Number(month)).filter((member) => `${member.name} ${member.id} ${member.email}`.toLowerCase().includes(search.toLowerCase()));
    return filtered.sort((a, b) => {
      const left = sort.field === 'amount' ? a.amount : sort.field === 'status' ? a.paymentStatus : a[sort.field];
      const right = sort.field === 'amount' ? b.amount : sort.field === 'status' ? b.paymentStatus : b[sort.field];
      const comparison = typeof left === 'number' ? left - right : String(left).localeCompare(String(right));
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [month, search, sort]);
  function sortBy(field) { setSort((current) => ({ field, direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc' })); }
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const paid = rows.filter((row) => row.paymentStatus === 'Paid').length;

  return <Box>
    <Box sx={{ mb: 3 }}><Typography variant="h4" fontWeight={800}>Manage contributions</Typography><Typography color="text.secondary">Review individual member contributions month by month.</Typography></Box>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}><TextField select SelectProps={{ native: true }} label="Contribution month" value={month} onChange={(event) => setMonth(event.target.value)} sx={{ minWidth: 220 }}>{monthNames.map((name, index) => <option key={name} value={index + 1}>{name} {currentYear}</option>)}</TextField><TextField label="Search members" value={search} onChange={(event) => setSearch(event.target.value)} sx={{ minWidth: 250 }} /></Box>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}><Chip label={`${monthNames[Number(month) - 1]} ${currentYear}`} /><Chip label={`${paid}/${rows.length} paid`} color="success" variant="outlined" /><Chip label={`${formatTsh(total)} collected`} variant="outlined" /></Box>
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}><Table><TableHead><TableRow><TableCell><TableSortLabel active={sort.field === 'name'} direction={sort.field === 'name' ? sort.direction : 'asc'} onClick={() => sortBy('name')}>Member</TableSortLabel></TableCell><TableCell>Member number</TableCell><TableCell><TableSortLabel active={sort.field === 'amount'} direction={sort.field === 'amount' ? sort.direction : 'asc'} onClick={() => sortBy('amount')}>Contribution</TableSortLabel></TableCell><TableCell><TableSortLabel active={sort.field === 'status'} direction={sort.field === 'status' ? sort.direction : 'asc'} onClick={() => sortBy('status')}>Status</TableSortLabel></TableCell></TableRow></TableHead><TableBody>{rows.map((member) => <TableRow key={member.id} hover><TableCell><Typography fontWeight={700}>{member.name}</Typography><Typography variant="caption" color="text.secondary">{member.email}</Typography></TableCell><TableCell>{member.id}</TableCell><TableCell>{formatTsh(member.amount)}</TableCell><TableCell><Chip size="small" label={member.paymentStatus} color={member.paymentStatus === 'Paid' ? 'success' : 'warning'} /></TableCell></TableRow>)}</TableBody></Table></TableContainer>
  </Box>;
}
