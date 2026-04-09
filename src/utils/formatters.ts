const EM_DASH = '—';

export function formatDate(iso: string | undefined): string {
  if (iso === undefined || iso === null || iso === '') return EM_DASH;
  const date = new Date(iso);
  if (isNaN(date.getTime())) return EM_DASH;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatPercent(value: number | undefined): string {
  if (value === undefined || value === null) return EM_DASH;
  return `${value.toFixed(1)}%`;
}

export function formatCount(value: number | undefined): string {
  if (value === undefined || value === null) return EM_DASH;
  return new Intl.NumberFormat('en-US').format(value);
}
