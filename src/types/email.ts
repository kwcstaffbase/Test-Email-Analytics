// Available fields — confirmed from the Email Performance API
export interface EmailRecord {
  message_id: string;
  send_datetime_utc: string;
  unique_opens: number;
  unique_clicks: number;
  total_clicks: number;
  open_rate: number;
  click_through_rate: number;

  // Uncertain fields — render as — when undefined
  channel?: string;
  subject_line?: string;
  preheader_text?: string;
  sender_name?: string;
  language?: string;
  audience_segment?: string;
  campaign_id?: string;
  campaign_name?: string;
  emails_sent?: number;
  emails_delivered?: number;
  eligible_population?: number;
}

export interface EmailPerformanceParams {
  timePeriod?: 'day' | 'week' | 'month' | 'quarter';
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export type SortField = 'send_datetime_utc' | 'open_rate' | 'click_through_rate';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}
