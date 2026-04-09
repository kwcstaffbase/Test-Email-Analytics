import { getEmailPerformance } from '../services/emailApi';
import { ApiError } from '../types/email';

// Set env var before the module loads
process.env['STAFFBASE_API_BASE_URL'] = 'https://api.staffbase.test';

const TOKEN = 'test-jwt-token';

const MOCK_RECORDS = [
  {
    message_id: 'msg-1',
    send_datetime_utc: '2025-04-01T10:00:00Z',
    unique_opens: 500,
    unique_clicks: 120,
    total_clicks: 200,
    open_rate: 32.5,
    click_through_rate: 15.2,
    subject_line: 'April Newsletter',
  },
];

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getEmailPerformance', () => {
  it('attaches Authorization: Bearer header on every call', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_RECORDS,
    } as Response);

    await getEmailPerformance(TOKEN, { timePeriod: 'week' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [, options] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('returns parsed EmailRecord array on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_RECORDS,
    } as Response);

    const result = await getEmailPerformance(TOKEN, {});
    expect(result).toEqual(MOCK_RECORDS);
  });

  it('throws ApiError with status 401 on unauthorized', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    } as Response);

    await expect(getEmailPerformance(TOKEN, {})).rejects.toMatchObject({
      status: 401,
    });
  });

  it('throws ApiError with status 403 on forbidden', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    } as Response);

    await expect(getEmailPerformance(TOKEN, {})).rejects.toMatchObject({
      status: 403,
    });
  });

  it('throws ApiError with status 404 on not found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    await expect(getEmailPerformance(TOKEN, {})).rejects.toMatchObject({
      status: 404,
    });
  });

  it('throws ApiError with status 500 on server error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(getEmailPerformance(TOKEN, {})).rejects.toMatchObject({
      status: 500,
    });
  });

  it('throws typed ApiError instances (not generic Error)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    } as Response);

    try {
      await getEmailPerformance(TOKEN, {});
      fail('Expected ApiError to be thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
    }
  });

  it('includes time_period query param when provided', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    await getEmailPerformance(TOKEN, { timePeriod: 'month' });

    const [url] = (global.fetch as jest.Mock).mock.calls[0] as [string];
    expect(url).toContain('time_period=month');
  });
});
