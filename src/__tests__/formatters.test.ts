import { formatDate, formatPercent, formatCount } from '../utils/formatters';

describe('formatPercent', () => {
  it('returns em dash for undefined', () => {
    expect(formatPercent(undefined)).toBe('—');
  });

  it('returns formatted percentage for valid number', () => {
    expect(formatPercent(24.3)).toBe('24.3%');
    expect(formatPercent(0)).toBe('0.0%');
    expect(formatPercent(100)).toBe('100.0%');
  });

  it('rounds to one decimal place', () => {
    expect(formatPercent(33.333)).toBe('33.3%');
  });
});

describe('formatCount', () => {
  it('returns em dash for undefined', () => {
    expect(formatCount(undefined)).toBe('—');
  });

  it('formats numbers with locale commas', () => {
    expect(formatCount(1204)).toBe('1,204');
    expect(formatCount(0)).toBe('0');
    expect(formatCount(1000000)).toBe('1,000,000');
  });
});

describe('formatDate', () => {
  it('returns em dash for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns em dash for empty string', () => {
    expect(formatDate('')).toBe('—');
  });

  it('returns em dash for invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });

  it('formats a valid ISO date string', () => {
    // Apr 3, 2025 at 14:14 UTC
    const result = formatDate('2025-04-03T14:14:00Z');
    // The exact format depends on locale, but it should contain the year
    expect(result).toContain('2025');
    expect(result).toContain('Apr');
  });
});
