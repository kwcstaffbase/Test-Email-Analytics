import { getEmailPerformance, ApiError } from '../types/email';

// Mock fetch globally
global.fetch = jest.fn();

describe('getEmailPerformance', () => {
  const mockToken = 'mock-jwt-token';
  
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  it('should fetch email performance data successfully', async () => {
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
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData)
    });
    
    const result = await getEmailPerformance(mockToken, { timePeriod: 'week' });
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/email-performance'),
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json'
        }
      })
    );
    
    expect(result).toEqual(mockData);
  });
  
  it('should throw ApiError for 401 status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Invalid token')
    });
    
    await expect(getEmailPerformance(mockToken, { timePeriod: 'week' }))
      .rejects.toThrow(new ApiError(401, 'Invalid or expired token'));
  });
  
  it('should throw ApiError for 403 status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: () => Promise.resolve('Insufficient permissions')
    });
    
    await expect(getEmailPerformance(mockToken, { timePeriod: 'week' }))
      .rejects.toThrow(new ApiError(403, 'Insufficient permissions to access email performance data'));
  });
  
  it('should throw ApiError for 404 status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Endpoint not found')
    });
    
    await expect(getEmailPerformance(mockToken, { timePeriod: 'week' }))
      .rejects.toThrow(new ApiError(404, 'Email performance endpoint not found'));
  });
  
  it('should throw ApiError for 500 status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Server error')
    });
    
    await expect(getEmailPerformance(mockToken, { timePeriod: 'week' }))
      .rejects.toThrow(new ApiError(500, 'Server error occurred while fetching email performance data'));
  });
  
  it('should throw generic ApiError for other status codes', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 422,
      text: () => Promise.resolve('Validation failed')
    });
    
    await expect(getEmailPerformance(mockToken, { timePeriod: 'week' }))
      .rejects.toThrow(new ApiError(422, 'Validation failed'));
  });
});