import { renderHook, act, waitFor } from '@testing-library/react';
import { useEmailPerformance } from '../hooks/useEmailPerformance';

// Mock usePluginSdk
jest.mock('../hooks/usePluginSdk');
// Mock getEmailPerformance
jest.mock('../services/emailApi');

import { usePluginSdk } from '../hooks/usePluginSdk';
import { getEmailPerformance } from '../services/emailApi';

const mockUsePluginSdk = usePluginSdk as jest.MockedFunction<typeof usePluginSdk>;
const mockGetEmailPerformance = getEmailPerformance as jest.MockedFunction<typeof getEmailPerformance>;

const MOCK_RECORDS = [
  {
    message_id: 'msg-1',
    send_datetime_utc: '2025-04-01T10:00:00Z',
    unique_opens: 500,
    unique_clicks: 120,
    total_clicks: 200,
    open_rate: 32.5,
    click_through_rate: 15.2,
  },
];

beforeEach(() => {
  jest.resetAllMocks();
});

describe('useEmailPerformance', () => {
  it('is in loading state on initial render', () => {
    mockUsePluginSdk.mockReturnValue({ token: null, isLoading: true });

    const { result } = renderHook(() => useEmailPerformance({}));
    expect(result.current.isLoading).toBe(true);
  });

  it('does not call API when token is absent', async () => {
    mockUsePluginSdk.mockReturnValue({ token: null, isLoading: false });

    renderHook(() => useEmailPerformance({}));

    await waitFor(() => {
      expect(mockGetEmailPerformance).not.toHaveBeenCalled();
    });
  });

  it('returns unauthenticated error when token is absent', async () => {
    mockUsePluginSdk.mockReturnValue({ token: null, isLoading: false });

    const { result } = renderHook(() => useEmailPerformance({}));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error?.kind).toBe('unauthenticated');
    });
  });

  it('populates data on successful API call', async () => {
    mockUsePluginSdk.mockReturnValue({ token: 'valid-token', isLoading: false });
    mockGetEmailPerformance.mockResolvedValue(MOCK_RECORDS);

    const { result } = renderHook(() => useEmailPerformance({ timePeriod: 'week' }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(MOCK_RECORDS);
      expect(result.current.error).toBeNull();
    });
  });

  it('populates error on API failure', async () => {
    mockUsePluginSdk.mockReturnValue({ token: 'valid-token', isLoading: false });
    mockGetEmailPerformance.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useEmailPerformance({}));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.kind).toBe('api_error');
    });
  });

  it('marks 401 ApiError as unauthenticated', async () => {
    const { ApiError } = await import('../types/email');
    mockUsePluginSdk.mockReturnValue({ token: 'expired-token', isLoading: false });
    mockGetEmailPerformance.mockRejectedValue(new ApiError(401, 'Token expired'));

    const { result } = renderHook(() => useEmailPerformance({}));

    await waitFor(() => {
      expect(result.current.error?.kind).toBe('unauthenticated');
    });
  });

  it('marks 403 ApiError as forbidden', async () => {
    const { ApiError } = await import('../types/email');
    mockUsePluginSdk.mockReturnValue({ token: 'valid-token', isLoading: false });
    mockGetEmailPerformance.mockRejectedValue(new ApiError(403, 'Forbidden'));

    const { result } = renderHook(() => useEmailPerformance({}));

    await waitFor(() => {
      expect(result.current.error?.kind).toBe('forbidden');
    });
  });
});
