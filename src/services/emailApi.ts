import { ApiError, EmailRecord, EmailPerformanceParams } from '../types/email';

// Base URL is sourced from environment variable injected at build time — never hardcoded.
// In development set STAFFBASE_API_BASE_URL in your environment.
// The webpack DefinePlugin or process.env fallback provides this at runtime.
declare const __STAFFBASE_API_BASE_URL__: string | undefined;

function getBaseUrl(): string {
  // Prefer compile-time constant injected by webpack DefinePlugin
  if (typeof __STAFFBASE_API_BASE_URL__ !== 'undefined' && __STAFFBASE_API_BASE_URL__) {
    return __STAFFBASE_API_BASE_URL__;
  }
  // Fallback to runtime environment variable (e.g. when running in Node for tests)
  const envUrl =
    typeof process !== 'undefined' && process.env['STAFFBASE_API_BASE_URL'];
  if (envUrl) return envUrl;
  throw new Error(
    'STAFFBASE_API_BASE_URL is not configured. Set it via environment variable before running.'
  );
}

async function checkResponse(res: Response): Promise<void> {
  if (res.ok) return;

  switch (res.status) {
    case 401:
      throw new ApiError(401, 'Authentication token is invalid or has expired.');
    case 403:
      throw new ApiError(403, 'You do not have permission to access email performance data.');
    case 404:
      throw new ApiError(404, 'Email performance endpoint not found. Check your API configuration.');
    case 500:
      throw new ApiError(500, 'The server encountered an error. Please try again later.');
    default:
      throw new ApiError(res.status, `Unexpected response: ${res.status} ${res.statusText}`);
  }
}

export async function getEmailPerformance(
  token: string,
  params: EmailPerformanceParams
): Promise<EmailRecord[]> {
  const baseUrl = getBaseUrl();
  const url = new URL('/api/v1/email-performance', baseUrl);

  if (params.timePeriod) {
    url.searchParams.set('time_period', params.timePeriod);
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await checkResponse(res);

  const data: unknown = await res.json();
  return data as EmailRecord[];
}
