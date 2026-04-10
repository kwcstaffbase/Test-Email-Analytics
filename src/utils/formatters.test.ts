import { formatDate, formatPercent, formatCount } from './formatters';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = '2025-04-03T14:14:00Z';
    expect(formatDate(date)).toBe('Apr 3, 2025, 2:14 PM');
  });
  
  it('should return "—" for undefined input', () => {
    expect(formatDate(undefined)).toBe('—');
  });
  
  it('should handle invalid date gracefully', () => {
    expect(formatDate('invalid-date')).toBe('—');
  });
});

describe('formatPercent', () => {
  it('should format percentage correctly', () => {
    expect(formatPercent(24.35)).toBe('24.4%');
    expect(formatPercent(0)).toBe('0.0%');
    expect(formatPercent(100)).toBe('100.0%');
  });
  
  it('should return "—" for undefined input', () => {
    expect(formatPercent(undefined)).toBe('—');
  });
});

describe('formatCount', () => {
  it('should format number with commas', () => {
    expect(formatCount(1234)).toBe('1,234');
    expect(formatCount(1234567)).toBe('1,234,567');
    expect(formatCount(0)).toBe('0');
  });
  
  it('should return "—" for undefined input', () => {
    expect(formatCount(undefined)).toBe('—');
  });
});