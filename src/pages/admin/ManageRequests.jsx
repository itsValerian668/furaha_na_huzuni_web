import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import { demoRequests } from '../../data/demo';
import { formatTsh } from '../../utils/format';

function Detail({ label, value }) {
  return <Box sx={{ mb: 1.5 }}><Typography variant="caption" color="text.secondary" display="block">{label}</Typography><Typography variant="body2" fontWeight={600}>{value || 'Not provided'}</Typography></Box>;
}

export default function ManageRequests() {
  const [requests, setRequests] = useState(demoRequests);
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('review');
  const [comments, setComments] = useState('');
  const [allocation, setAllocation] = useState('');
  const [feedback, setFeedback] = useState('');

  function openRequest(request) {
    setSelected(request);
    setStep('review');
    setComments('');
    setAllocation(String(request.current_amount));
    setFeedback('');
  }

  function closeRequest() {
    setSelected(null);
    setStep('review');
    setComments('');
    setAllocation('');
    setFeedback('');
  }

  function rejectRequest() {
    if (!comments.trim()) { setFeedback('Please add a reason before rejecting this request.'); return; }
    setRequests((current) => current.map((request) => request.id === selected.id ? { ...request, status: 'rejected', reviewComment: comments } : request));
    setFeedback('Request rejected. The member has been notified with the reason.');
  }

  function continueApproval() {
    if (!comments.trim()) { setFeedback('Please add approval comments before continuing.'); return; }
    setFeedback('');
    setStep('allocation');
  }

  function approveRequest() {
    const amount = Number(allocation);
    if (!amount || amount <= 0) { setFeedback('Enter a valid amount to allocate.'); return; }
    setRequests((current) => current.map((request) => request.id === selected.id ? { ...request, status: 'approved', allocatedAmount: amount, reviewComment: comments } : request));
    setFeedback(`Request approved and ${formatTsh(amount)} allocated for payment.`);
    setStep('complete');
  }

  return <Box>
    <Box sx={{ mb: 3 }}><Typography variant="h4" fontWeight={800}>Manage requests</Typography><Typography color="text.secondary">Review submitted requests, documents and payout decisions.</Typography></Box>
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}><Table><TableHead><TableRow><TableCell>Request</TableCell><TableCell>Member</TableCell><TableCell>Event type</TableCell><TableCell>Target</TableCell><TableCell>Status</TableCell><TableCell align="right">Action</TableCell></TableRow></TableHead><TableBody>{requests.map((request) => <TableRow key={request.id} hover><TableCell><Typography fontWeight={700}>{request.title}</Typography></TableCell><TableCell>{request.user.name}</TableCell><TableCell>{request.category.name}</TableCell><TableCell>{formatTsh(request.target_amount)}</TableCell><TableCell><Chip size="small" label={request.status} color={request.status === 'verified' || request.status === 'approved' ? 'success' : request.status === 'rejected' ? 'error' : 'warning'} /></TableCell><TableCell align="right"><Button size="small" onClick={() => openRequest(request)}>View</Button></TableCell></TableRow>)}</TableBody></Table></TableContainer>

    <Dialog open={Boolean(selected)} onClose={closeRequest} fullWidth maxWidth="md"><DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{step === 'allocation' ? 'Allocate request payment' : step === 'complete' ? 'Decision recorded' : 'Review request'}<Button aria-label="Close dialog" onClick={closeRequest} sx={{ minWidth: 0, p: 0.75, color: 'text.secondary' }}><CloseIcon /></Button></DialogTitle><DialogContent>
      {feedback && <Alert severity={step === 'complete' ? 'success' : 'warning'} sx={{ mb: 2 }}>{feedback}</Alert>}
      {step === 'allocation' ? <Box sx={{ maxWidth: 520 }}><Typography variant="body1" sx={{ mb: 2 }}>The request has passed review. Enter the amount the cooperative will pay to the member.</Typography><TextField fullWidth required type="number" label="Allocated amount (TSh)" value={allocation} onChange={(event) => setAllocation(event.target.value)} helperText={`Requested amount: ${formatTsh(selected?.target_amount)}`} /></Box> : step === 'complete' ? <Box><Typography>Payment allocation has been recorded for <strong>{selected?.user.name}</strong>. The request can now move to the payment processing queue.</Typography></Box> : <Grid container spacing={3}>
        <Grid item xs={12} md={6}><Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Request details</Typography><Detail label="Title" value={selected?.title} /><Detail label="Member" value={selected?.user.name} /><Detail label="Event type" value={selected?.category.name} /><Detail label="Target amount" value={selected ? formatTsh(selected.target_amount) : ''} /><Detail label="Raised so far" value={selected ? formatTsh(selected.current_amount) : ''} /><Divider sx={{ my: 2 }} /><TextField fullWidth multiline minRows={4} label="Review comments" value={comments} onChange={(event) => setComments(event.target.value)} required helperText="Required for approval or rejection. Rejection comments are sent to the member." /></Grid>
        <Grid item xs={12} md={6}><Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Supporting documents</Typography><Paper variant="outlined" sx={{ p: 2, borderRadius: 1, mb: 1.5 }}><DescriptionIcon color="primary" /><Typography variant="body2" fontWeight={600}>Request verification document.pdf</Typography><Typography variant="caption" color="text.secondary">Uploaded by {selected?.user.name}</Typography><Button size="small" sx={{ display: 'block', mt: 1 }}>Preview document</Button></Paper><Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}><DescriptionIcon color="primary" /><Typography variant="body2" fontWeight={600}>Identity confirmation.jpg</Typography><Typography variant="caption" color="text.secondary">Supporting attachment</Typography><Button size="small" sx={{ display: 'block', mt: 1 }}>Preview document</Button></Paper></Grid>
      </Grid>}
    </DialogContent><DialogActions sx={{ px: 3, pb: 2 }}>{step === 'review' && <><Button color="error" onClick={rejectRequest}>Reject request</Button><Button variant="contained" onClick={continueApproval}>Approve and continue</Button></>}{step === 'allocation' && <><Button onClick={() => setStep('review')}>Back</Button><Button variant="contained" onClick={approveRequest}>Confirm allocation</Button></>}{step === 'complete' && <Button variant="contained" onClick={closeRequest}>Done</Button>}</DialogActions></Dialog>
  </Box>;
}
