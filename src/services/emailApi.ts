import { ApiError, EmailRecord } from '../types/email';

export async function getEmailPerformance(
  token: string,
  params: { timePeriod: string }
): Promise<EmailRecord[]> {
  const baseUrl = process.env.STAFFBASE_API_URL || 'https://api.staffbase.com';
  
  const url = `${baseUrl}/email-performance?timePeriod=${params.timePeriod}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    throw new ApiError(401, 'Invalid or expired token');
  }
  
  if (response.status === 403) {
    throw new ApiError(403, 'Insufficient permissions to access email performance data');
  }
  
  if (response.status === 404) {
    throw new ApiError(404, 'Email performance endpoint not found');
  }
  
  if (response.status >= 500) {
    throw new ApiError(500, 'Server error occurred while fetching email performance data');
  }
  
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new ApiError(response.status, errorMessage);
  }
  
  return response.json();
}