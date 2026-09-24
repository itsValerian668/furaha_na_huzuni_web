import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import apiClient from '../api/client';

export default function CreateRequest() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [attachments, setAttachments] = useState([{ file: null, label: '' }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  const selectedCategory = categories.find((c) => String(c.id) === String(categoryId));

  function updateAttachment(index, field, value) {
    setAttachments((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  }

  function addAttachmentRow() {
    setAttachments((prev) => [...prev, { file: null, label: '' }]);
  }

  function removeAttachmentRow(index) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const validAttachments = attachments.filter((a) => a.file && a.label);
    if (validAttachments.length === 0) {
      setError('At least one verification document with a label is required.');
      return;
    }

    const formData = new FormData();
    formData.append('request_category_id', categoryId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('target_amount', targetAmount);

    validAttachments.forEach((a, i) => {
      formData.append(`attachments[${i}][file]`, a.file);
      formData.append(`attachments[${i}][label]`, a.label);
    });

    setLoading(true);
    try {
      await apiClient.post('/requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/requests/mine');
    } catch (err) {
      const messages = err.response?.data?.errors;
      setError(
        messages
          ? Object.values(messages).flat().join(' ')
          : err.response?.data?.message || 'Could not submit request.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        New Request
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          select
          label="Category"
          required
          fullWidth
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Title"
          required
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Description"
          required
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          label="Target Amount (TSh)"
          type="number"
          required
          fullWidth
          inputProps={{ min: 1 }}
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2">Verification Documents</Typography>
            <Button size="small" onClick={addAttachmentRow}>
              + Add another
            </Button>
          </Box>

          {selectedCategory?.suggested_attachment_labels?.length > 0 && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              Suggested: {selectedCategory.suggested_attachment_labels.join(', ')}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {attachments.map((a, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Label (e.g. Hospital letter)"
                  value={a.label}
                  onChange={(e) => updateAttachment(i, 'label', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<UploadFileIcon />}
                  sx={{ flexShrink: 0 }}
                >
                  {a.file ? a.file.name.slice(0, 14) : 'Choose file'}
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => updateAttachment(i, 'file', e.target.files[0])}
                  />
                </Button>
                {attachments.length > 1 && (
                  <IconButton size="small" color="error" onClick={() => removeAttachmentRow(i)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Request'}
        </Button>
      </Box>
    </Box>
  );
}
