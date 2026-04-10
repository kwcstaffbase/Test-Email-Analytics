import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('should render low status badge for values below 20%', () => {
    render(<StatusBadge value={15.5} />);
    
    const badge = screen.getByText('15.5%');
    expect(badge).toHaveClass('low');
  });

  it('should render medium status badge for values between 20-40%', () => {
    render(<StatusBadge value={30.5} />);
    
    const badge = screen.getByText('30.5%');
    expect(badge).toHaveClass('medium');
  });

  it('should render high status badge for values above 40%', () => {
    render(<StatusBadge value={50.5} />);
    
    const badge = screen.getByText('50.5%');
    expect(badge).toHaveClass('high');
  });

  it('should not render anything when value is undefined', () => {
    render(<StatusBadge value={undefined} />);
    
    // Should not render any content
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});