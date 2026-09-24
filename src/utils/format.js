export function formatTsh(amount) {
  const number = Number(amount);
  if (Number.isNaN(number)) return `${amount} TSh`;
  return `${number.toLocaleString('en-TZ')} TSh`;
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function monthName(month) {
  return MONTH_NAMES[Number(month) - 1] || month;
}

// Attachment/file paths from the API are stored relative to the `public`
// disk (storage/app/public) and served from /storage/* once `storage:link`
// has been run — this derives that base from the configured API URL.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const STORAGE_BASE = API_URL.replace(/\/api\/?$/, '') + '/storage/';

export function fileUrl(path) {
  if (!path) return null;
  return `${STORAGE_BASE}${path}`;
}
