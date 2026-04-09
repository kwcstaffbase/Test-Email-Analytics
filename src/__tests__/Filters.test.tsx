import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Filters } from '../components/Filters/Filters';
import { EmailPerformanceParams } from '../types/email';

describe('Filters', () => {
  it('renders with Week as default selection', () => {
    const onChange = jest.fn();
    const params: EmailPerformanceParams = { timePeriod: 'week' };
    render(<Filters params={params} onChange={onChange} />);

    const select = screen.getByRole('combobox', { name: /Time Period/i });
    expect((select as HTMLSelectElement).value).toBe('week');
  });

  it('label is associated with select via htmlFor/id', () => {
    render(<Filters params={{ timePeriod: 'week' }} onChange={jest.fn()} />);
    const label = screen.getByText('Time Period');
    const select = screen.getByLabelText('Time Period');
    expect(select.tagName).toBe('SELECT');
    expect(label.tagName).toBe('LABEL');
  });

  it('calls onChange with month when month is selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Filters params={{ timePeriod: 'week' }} onChange={onChange} />);

    const select = screen.getByRole('combobox', { name: /Time Period/i });
    await user.selectOptions(select, 'month');

    expect(onChange).toHaveBeenCalledWith({ timePeriod: 'month' });
  });

  it('calls onChange with quarter when quarter is selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Filters params={{ timePeriod: 'week' }} onChange={onChange} />);

    const select = screen.getByRole('combobox', { name: /Time Period/i });
    await user.selectOptions(select, 'quarter');

    expect(onChange).toHaveBeenCalledWith({ timePeriod: 'quarter' });
  });

  it('renders all four time period options', () => {
    render(<Filters params={{ timePeriod: 'week' }} onChange={jest.fn()} />);
    expect(screen.getByRole('option', { name: 'Day' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Week' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Month' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Quarter' })).toBeInTheDocument();
  });
});
