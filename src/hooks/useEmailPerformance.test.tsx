import { renderHook, act } from '@testing-library/react';
import { useEmailPerformance } from './useEmailPerformance';
import * as emailApi from '../services/emailApi';

// Mock the plugin SDK and email API
jest.mock('@staffbase/plugin-sdk-react', () => ({
  usePluginSdk: jest.fn(),
}));

const mockUsePluginSdk = jest.requireMock('@staffbase/plugin-sdk-react');

describe('useEmailPerformance hook', () => {
  const mockToken = 'mock-jwt-token';
  const mockParams = { timePeriod: 'week' as const };
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePluginSdk.usePluginSdk.mockReturnValue({ token: mockToken });
  });
  
  it('should return loading state initially', () => {
    const { result } = renderHook(() => useEmailPerformance(mockParams));
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
  
  it('should fetch data successfully when token is available', async () => {
    const mockData = [
      {
        message_id: '123',
        send_datetime_utc: '2025-04-01T10:00:00Z',
        unique_opens: 100,
        unique_clicks: 50,
        total_clicks: 75,
        open_rate: 25.5,
        click_through_rate: 12.3
      }
    ];
    
    jest.spyOn(emailApi, 'getEmailPerformance').mockResolvedValue(mockData);
    
    let result;
    act(() => {
      result = renderHook(() => useEmailPerformance(mockParams)).result;
    });
    
    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle error when fetching data fails', async () => {
    const mockError = new Error('Network error');
    jest.spyOn(emailApi, 'getEmailPerformance').mockRejectedValue(mockError);
    
    let result;
    act(() => {
      result = renderHook(() => useEmailPerformance(mockParams)).result;
    });
    
    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });
  
  it('should handle missing token', async () => {
    mockUsePluginSdk.usePluginSdk.mockReturnValue({ token: null });
    
    let result;
    act(() => {
      result = renderHook(() => useEmailPerformance(mockParams)).result;
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error.message).toContain('No authentication token available');
  });
});