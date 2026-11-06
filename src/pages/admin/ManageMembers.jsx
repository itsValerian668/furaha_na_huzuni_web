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
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import { demoMembers } from '../../data/demo';
import { formatTsh } from '../../utils/format';

const emptyMember = { name: '', email: '', phone: '', nationalId: '', bankName: '', accountName: '', accountNumber: '', role: 'Member' };

function Detail({ label, value }) {
  return <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}><Typography variant="caption" color="text.secondary" display="block">{label}</Typography><Typography variant="body2" fontWeight={600}>{value || 'Not provided'}</Typography></Box>;
}

function CloseButton({ onClick }) {
  return <Button aria-label="Close dialog" onClick={onClick} sx={{ minWidth: 0, p: 0.75, color: 'text.secondary' }}><CloseIcon /></Button>;
}

export default function ManageMembers() {
  const [members, setMembers] = useState(demoMembers);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMember);
  const rows = useMemo(() => members.filter((member) => `${member.name} ${member.id} ${member.email}`.toLowerCase().includes(query.toLowerCase())), [members, query]);
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  function openCreate() { setEditing({ newMember: true }); setForm(emptyMember); }
  function openEdit(member) { setSelected(null); setEditing(member); setForm({ name: member.name, email: member.email, phone: member.phone, nationalId: member.nationalId || '', bankName: member.bankName || '', accountName: member.accountName || '', accountNumber: member.accountNumber || '', role: member.role }); }
  function saveMember() {
    if (!form.name || !form.email || !form.phone || !form.nationalId || !form.bankName || !form.accountName || !form.accountNumber) return;
    if (editing?.newMember) setMembers((current) => [...current, { ...form, id: `MB-${String(current.length + 1).padStart(4, '0')}`, status: 'Active', contributions: 0, requests: 0 }]);
    else setMembers((current) => current.map((member) => member.id === editing.id ? { ...member, ...form } : member));
    setEditing(null);
  }
  function toggleStatus(member) { const updated = { ...member, status: member.status === 'Active' ? 'Inactive' : 'Active' }; setMembers((current) => current.map((item) => item.id === member.id ? updated : item)); setSelected(updated); }

  return <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3, flexWrap: 'wrap' }}><Box><Typography variant="h4" fontWeight={800}>Manage members</Typography><Typography color="text.secondary">Register members and manage their membership information.</Typography></Box><Button variant="contained" onClick={openCreate}>Register new member</Button></Box>
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2 }}><TextField size="small" label="Search members" value={query} onChange={(event) => setQuery(event.target.value)} /></Paper>
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}><Table><TableHead><TableRow><TableCell>Member</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell><TableCell>Contributions</TableCell><TableCell>Requests</TableCell><TableCell align="right">Action</TableCell></TableRow></TableHead><TableBody>{rows.map((member) => <TableRow key={member.id} hover><TableCell><Typography fontWeight={700}>{member.name}</Typography><Typography variant="caption" color="text.secondary">{member.id} · {member.email}</Typography></TableCell><TableCell>{member.role}</TableCell><TableCell><Chip size="small" label={member.status} color={member.status === 'Active' ? 'success' : 'default'} /></TableCell><TableCell>{formatTsh(member.contributions)}</TableCell><TableCell>{member.requests}</TableCell><TableCell align="right"><Button size="small" onClick={() => setSelected(member)}>Review</Button></TableCell></TableRow>)}</TableBody></Table></TableContainer>

    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm"><DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Member details<CloseButton onClick={() => setSelected(null)} /></DialogTitle><DialogContent><Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{selected?.name}</Typography><Grid container spacing={1.5}><Grid item xs={12} sm={6}><Detail label="Member number" value={selected?.id} /></Grid><Grid item xs={12} sm={6}><Detail label="Status" value={selected?.status} /></Grid><Grid item xs={12} sm={6}><Detail label="Email" value={selected?.email} /></Grid><Grid item xs={12} sm={6}><Detail label="Phone number" value={selected?.phone} /></Grid><Grid item xs={12}><Detail label="National ID" value={selected?.nationalId} /></Grid><Grid item xs={12} sm={6}><Detail label="Bank name" value={selected?.bankName} /></Grid><Grid item xs={12} sm={6}><Detail label="Account name" value={selected?.accountName} /></Grid><Grid item xs={12}><Detail label="Account number" value={selected?.accountNumber} /></Grid><Grid item xs={12} sm={6}><Detail label="Total contributions" value={selected ? formatTsh(selected.contributions) : ''} /></Grid><Grid item xs={12} sm={6}><Detail label="Requests submitted" value={selected?.requests} /></Grid></Grid></DialogContent><DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}><Button color={selected?.status === 'Active' ? 'error' : 'success'} onClick={() => toggleStatus(selected)}>{selected?.status === 'Active' ? 'Deactivate membership' : 'Activate membership'}</Button><Button variant="contained" onClick={() => openEdit(selected)}>Edit membership</Button></DialogActions></Dialog>

    <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm"><DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{editing?.newMember ? 'Register new member' : 'Edit membership information'}<CloseButton onClick={() => setEditing(null)} /></DialogTitle><DialogContent><Grid container spacing={2} sx={{ pt: 1 }}><Grid item xs={12}><TextField fullWidth required label="Full name" value={form.name} onChange={update('name')} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth required type="email" label="Email" value={form.email} onChange={update('email')} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth required label="Phone number" value={form.phone} onChange={update('phone')} /></Grid><Grid item xs={12}><TextField fullWidth required label="National ID" value={form.nationalId} onChange={update('nationalId')} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth required label="Bank name" value={form.bankName} onChange={update('bankName')} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth required label="Account name" value={form.accountName} onChange={update('accountName')} /></Grid><Grid item xs={12}><TextField fullWidth required label="Account number" value={form.accountNumber} onChange={update('accountNumber')} /></Grid></Grid></DialogContent><DialogActions><Button variant="contained" onClick={saveMember}>{editing?.newMember ? 'Register member' : 'Save changes'}</Button></DialogActions></Dialog>
  </Box>;
}
