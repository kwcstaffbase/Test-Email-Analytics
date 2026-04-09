/**
 * usePluginSdk — provides the Staffbase platform auth token to the plugin.
 *
 * DEVIATION NOTE:
 * The spec references `usePluginSdk()` from `@staffbase/plugin-sdk-react`,
 * which does not exist on npm. The actual available package is
 * `@staffbase/plugins-client-sdk` (v3.1.1), which provides platform utilities
 * (device info, deep links, locale) but no auth-token hook.
 *
 * The Staffbase embedded-plugin auth pattern passes the JWT as a `jwt` query
 * parameter in the iframe URL. This hook reads it from there, following the
 * documented Staffbase Custom Plugin SSO pattern.
 *
 * In a production deployment the Staffbase platform appends
 * ?jwt=<signed-JWT> to the plugin iframe URL. The JWT is signed by Staffbase
 * and should be verified server-side before being trusted for API calls.
 */

import { useState, useEffect } from 'react';

export interface PluginSdkState {
  /** Auth JWT from the Staffbase platform, or null if not yet available */
  token: string | null;
  /** True while the token is being extracted from the platform context */
  isLoading: boolean;
}

function extractTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('jwt');
}

export function usePluginSdk(): PluginSdkState {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwt = extractTokenFromUrl();
    setToken(jwt);
    setIsLoading(false);
  }, []);

  return { token, isLoading };
}
