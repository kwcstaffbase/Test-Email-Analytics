import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailTable } from '../components/EmailTable/EmailTable';
import { EmailRecord } from '../types/email';

const FULL_RECORD: EmailRecord = {
  message_id: 'msg-1',
  send_datetime_utc: '2025-04-01T10:00:00Z',
  unique_opens: 500,
  unique_clicks: 120,
  total_clicks: 200,
  open_rate: 32.5,
  click_through_rate: 15.2,
  subject_line: 'April Newsletter',
  sender_name: 'Marketing Team',
};

const SPARSE_RECORD: EmailRecord = {
  message_id: 'msg-2',
  send_datetime_utc: '2025-04-02T09:00:00Z',
  unique_opens: 300,
  unique_clicks: 80,
  total_clicks: 100,
  open_rate: 18.0,
  click_through_rate: 8.5,
  // subject_line, sender_name, etc. omitted → should render —
};

describe('EmailTable', () => {
  it('renders the correct number of columns (8)', () => {
    render(<EmailTable data={[FULL_RECORD]} />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(8);
  });

  it('renders em dash for undefined subject_line', () => {
    render(<EmailTable data={[SPARSE_RECORD]} />);
    const cells = screen.getAllByRole('cell');
    const subjectCell = cells[0];
    expect(subjectCell.textContent).toBe('—');
  });

  it('renders em dash for undefined sender_name', () => {
    render(<EmailTable data={[SPARSE_RECORD]} />);
    const cells = screen.getAllByRole('cell');
    const senderCell = cells[1];
    expect(senderCell.textContent).toBe('—');
  });

  it('renders em dash for a third undefined field (preheader is not displayed, but subject and sender are two; check a record with no subject and no sender)', () => {
    const sparseRecord2: EmailRecord = {
      ...SPARSE_RECORD,
      message_id: 'msg-3',
    };
    render(<EmailTable data={[sparseRecord2]} />);
    const cells = screen.getAllByRole('cell');
    // subject (index 0) and sender (index 1) should both be —
    expect(cells[0].textContent).toBe('—');
    expect(cells[1].textContent).toBe('—');
  });

  it('renders correct column headers', () => {
    render(<EmailTable data={[]} />);
    expect(screen.getByText('Subject Line')).toBeInTheDocument();
    expect(screen.getByText('Sender')).toBeInTheDocument();
    expect(screen.getByText(/Sent At/)).toBeInTheDocument();
    expect(screen.getByText(/Open Rate/)).toBeInTheDocument();
    expect(screen.getByText(/CTR/)).toBeInTheDocument();
  });

  it('sortable headers have aria-sort attribute', () => {
    render(<EmailTable data={[FULL_RECORD]} />);
    const sentAtHeader = screen.getByRole('columnheader', { name: /Sent At/ });
    expect(sentAtHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('clicking a sortable column header changes aria-sort to ascending', async () => {
    const user = userEvent.setup();
    render(<EmailTable data={[FULL_RECORD, SPARSE_RECORD]} />);

    const openRateHeader = screen.getByRole('columnheader', { name: /Open Rate/ });
    expect(openRateHeader).toHaveAttribute('aria-sort', 'none');

    await user.click(openRateHeader);
    expect(openRateHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('clicking same sortable header twice changes sort to descending', async () => {
    const user = userEvent.setup();
    render(<EmailTable data={[FULL_RECORD, SPARSE_RECORD]} />);

    const ctrHeader = screen.getByRole('columnheader', { name: /CTR/ });
    await user.click(ctrHeader);
    expect(ctrHeader).toHaveAttribute('aria-sort', 'ascending');

    await user.click(ctrHeader);
    expect(ctrHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('shows empty state message when data is empty', () => {
    render(<EmailTable data={[]} />);
    expect(screen.getByText(/No email data available/)).toBeInTheDocument();
  });
});
