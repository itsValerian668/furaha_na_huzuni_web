import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { demoMeetings } from '../../data/demo';

export default function ManageMeetings() {
  const [open, setOpen] = useState(false);
  const [meetings, setMeetings] = useState(demoMeetings);
  const [title, setTitle] = useState('');
  function save() { if (title) setMeetings([...meetings, { id: Date.now(), title, date: '2026-12-05', time: '10:00', venue: 'Kinondoni Community Hall', invitees: 128, status: 'Draft' }]); setTitle(''); setOpen(false); }
  return <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}><Box><Typography variant="h4" fontWeight={800}>Manage meetings</Typography><Typography color="text.secondary">Schedule meetings and invite members.</Typography></Box><Button variant="contained" onClick={() => setOpen(true)}>Schedule meeting</Button></Box>{meetings.map((meeting) => <Paper key={meeting.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 2 }}><Typography variant="h6" fontWeight={700}>{meeting.title}</Typography><Typography color="text.secondary" sx={{ mt: 0.5 }}>{meeting.date} at {meeting.time} · {meeting.venue}</Typography><Typography variant="body2" sx={{ mt: 1 }}>{meeting.invitees} members invited · {meeting.status}</Typography></Paper>)}<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"><DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>Schedule meeting<Button aria-label="Close dialog" onClick={() => setOpen(false)} sx={{ minWidth: 0, p: 0.75 }}><CloseIcon /></Button></DialogTitle><DialogContent><TextField autoFocus fullWidth label="Meeting title" value={title} onChange={(event) => setTitle(event.target.value)} sx={{ mt: 1 }} /><TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} defaultValue="2026-12-05" sx={{ mt: 2 }} /><TextField fullWidth label="Venue or meeting link" defaultValue="Kinondoni Community Hall" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button variant="contained" onClick={save}>Save and invite members</Button></DialogActions></Dialog></Box>;
}
