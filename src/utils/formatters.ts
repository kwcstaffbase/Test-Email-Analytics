export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  
  try {
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return '—';
  }
}

export function formatPercent(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  return `${value.toFixed(1)}%`;
}

export function formatCount(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}