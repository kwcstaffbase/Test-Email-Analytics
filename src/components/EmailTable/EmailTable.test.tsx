import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailTable from './EmailTable';

describe('EmailTable', () => {
  const mockEmails = [
    {
      message_id: '1',
      send_datetime_utc: '2025-04-03T10:00:00Z',
      unique_opens: 100,
      unique_clicks: 50,
      total_clicks: 75,
      open_rate: 25.5,
      click_through_rate: 12.3,
      subject_line: 'Test Email Subject',
      sender_name: 'John Doe'
    },
    {
      message_id: '2',
      send_datetime_utc: '2025-04-02T15:30:00Z',
      unique_opens: 85,
      unique_clicks: 30,
      total_clicks: 45,
      open_rate: 20.0,
      click_through_rate: 10.0,
      subject_line: 'Another Test Email',
      sender_name: 'Jane Smith'
    }
  ];

  it('should render table with correct number of columns', () => {
    render(<EmailTable emails={mockEmails} />);
    
    // Should have 8 columns (Subject Line, Sender, Sent At, Unique Opens, 
    // Unique Clicks, Total Clicks, Open Rate, CTR)
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(8);
  });

  it('should render email data correctly', () => {
    render(<EmailTable emails={mockEmails} />);
    
    // Check that the test data is rendered
    expect(screen.getByText('Test Email Subject')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Apr 3, 2025, 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('25.5%')).toBeInTheDocument();
    expect(screen.getByText('12.3%')).toBeInTheDocument();
  });

  it('should render "—" for undefined fields', () => {
    const emailsWithUndefined = [
      {
        ...mockEmails[0],
        subject_line: undefined,
        sender_name: undefined,
        unique_opens: undefined
      }
    ];
    
    render(<EmailTable emails={emailsWithUndefined} />);
    
    // Should show "—" for undefined fields
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should handle empty data correctly', () => {
    render(<EmailTable emails={[]} />);
    
    const emptyState = screen.getByText(/no email performance data available/i);
    expect(emptyState).toBeInTheDocument();
  });
});