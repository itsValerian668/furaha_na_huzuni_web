import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

const initialDependants = [{ id: 1, name: 'Neema Victor', relationship: 'Child', dateOfBirth: '2015-05-12', nationalId: 'Not applicable', certificate: 'Birth certificate.pdf' }];
const emptyForm = { name: '', relationship: '', dateOfBirth: '', nationalId: '', certificate: null };

function CloseButton({ onClick }) { return <Button aria-label="Close dialog" onClick={onClick} sx={{ minWidth: 0, p: 0.75, color: 'text.secondary' }}><CloseIcon /></Button>; }

export default function MemberDependants() {
  const [dependants, setDependants] = useState(initialDependants);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteReason, setDeleteReason] = useState('');
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  function openCreate() { setEditing({ newDependant: true }); setForm(emptyForm); }
  function openEdit(dependant) { setEditing(dependant); setForm({ ...dependant, certificate: null }); }
  function save() { if (!form.name || !form.relationship || !form.dateOfBirth || (editing?.newDependant && !form.certificate)) return; const record = { ...form, id: editing?.newDependant ? Date.now() : editing.id, certificate: form.certificate?.name || editing.certificate }; setDependants((current) => editing?.newDependant ? [...current, record] : current.map((item) => item.id === editing.id ? record : item)); setEditing(null); }
  function confirmDelete() { if (!deleteReason.trim()) return; setDependants((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); setDeleteReason(''); }
  return <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 3, flexWrap: 'wrap' }}><Box><Typography variant="h4" fontWeight={800}>Dependants</Typography><Typography color="text.secondary">Keep dependant information and supporting certificates up to date.</Typography></Box><Button variant="contained" onClick={openCreate}>Add dependant</Button></Box><Grid container spacing={2}>{dependants.map((dependant) => <Grid item xs={12} md={6} key={dependant.id}><Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}><Box><Typography variant="h6" fontWeight={700}>{dependant.name}</Typography><Typography color="text.secondary">{dependant.relationship} · Born {dependant.dateOfBirth}</Typography></Box><Box><Button size="small" onClick={() => openEdit(dependant)}>Edit</Button><Button size="small" color="error" onClick={() => setDeleting(dependant)}>Delete</Button></Box></Box><Typography variant="body2" sx={{ mt: 1 }}>National ID: {dependant.nationalId || 'Not provided'}</Typography><Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>Certificate: {dependant.certificate}</Typography></Paper></Grid>)}</Grid><Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm"><DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{editing?.newDependant ? 'Add dependant' : 'Edit dependant'}<CloseButton onClick={() => setEditing(null)} /></DialogTitle><DialogContent><Grid container spacing={2} sx={{ pt: 1 }}><Grid item xs={12}><TextField fullWidth required label="Full name" value={form.name} onChange={update('name')} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth required label="Relationship" value={form.relationship} onChange={update('relationship')} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth required type="date" label="Date of birth" InputLabelProps={{ shrink: true }} value={form.dateOfBirth} onChange={update('dateOfBirth')} /></Grid><Grid item xs={12}><TextField fullWidth label="National ID" value={form.nationalId} onChange={update('nationalId')} /></Grid><Grid item xs={12}><Button component="label" variant="outlined">{form.certificate ? form.certificate.name : editing?.certificate || 'Upload necessary certificate'}<input hidden type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setForm({ ...form, certificate: event.target.files?.[0] || null })} /></Button><Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>Examples: birth certificate, marriage certificate, or guardianship document.</Typography></Grid></Grid></DialogContent><DialogActions><Button variant="contained" onClick={save}>{editing?.newDependant ? 'Save dependant' : 'Save changes'}</Button></DialogActions></Dialog><Dialog open={Boolean(deleting)} onClose={() => setDeleting(null)} fullWidth maxWidth="xs"><DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>Delete dependant<CloseButton onClick={() => setDeleting(null)} /></DialogTitle><DialogContent><Typography sx={{ mb: 2 }}>Why are you removing {deleting?.name} from your dependants?</Typography><TextField fullWidth required multiline minRows={3} label="Reason for deletion" value={deleteReason} onChange={(event) => setDeleteReason(event.target.value)} /></DialogContent><DialogActions><Button color="error" variant="contained" onClick={confirmDelete}>Delete dependant</Button></DialogActions></Dialog></Box>;
}
