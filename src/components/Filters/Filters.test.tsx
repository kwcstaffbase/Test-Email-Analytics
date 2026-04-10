import React from 'react';
import { render, screen } from '@testing-library/react';
import Filters from './Filters';

describe('Filters', () => {
  const mockOnChange = jest.fn();
  
  it('should render time period selector with correct options', () => {
    render(<Filters onTimePeriodChange={mockOnChange} />);
    
    const selectElement = screen.getByLabelText(/time period/i);
    expect(selectElement).toBeInTheDocument();
    
    // Check that all options are present
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Quarter')).toBeInTheDocument();
  });

  it('should have "week" selected by default', () => {
    render(<Filters onTimePeriodChange={mockOnChange} />);
    
    const selectElement = screen.getByLabelText(/time period/i);
    expect(selectElement).toHaveValue('week');
  });

  it('should call onChange when time period changes', () => {
    render(<Filters onTimePeriodChange={mockOnChange} />);
    
    const selectElement = screen.getByLabelText(/time period/i);
    
    // Change to "month"
    selectElement.value = 'month';
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    
    expect(mockOnChange).toHaveBeenCalledWith('month');
  });
});