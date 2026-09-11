import { Platform } from 'react-native';

const DEFAULT_PORT = '3000';

export const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android emulator localhost alias
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${DEFAULT_PORT}`;
  }
  // Physical device, iOS simulator, Expo web, and default
  return `http://172.20.10.3:${DEFAULT_PORT}`;
};

let inMemoryToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  inMemoryToken = token;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (token) {
        window.localStorage.setItem('warungku_mobile_token', token);
      } else {
        window.localStorage.removeItem('warungku_mobile_token');
      }
    } catch {
      // Silently ignore storage errors in restricted contexts
    }
  }
};

export const getAuthToken = (): string | null => {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem('warungku_mobile_token');
      if (stored) {
        inMemoryToken = stored;
        return stored;
      }
    } catch {
      return null;
    }
  }
  return null;
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export interface RequestOptions extends RequestInit {
  token?: string | null;
}

/**
 * Standard API request wrapper for WarungKu mobile.
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = options.token !== undefined ? options.token : getAuthToken();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let json: any = null;
    try {
      json = await response.json();
    } catch {
      // Non-JSON response
      json = null;
    }

    if (!response.ok) {
      const errorMessage =
        (json && (json.error || json.message)) ||
        `Permintaan gagal dengan status ${response.status}`;
      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      success: json?.success ?? true,
      data: json as T,
      status: response.status,
    };
  } catch (err: any) {
    const isNetworkError =
      err?.message?.includes('Network request failed') ||
      err?.message?.includes('Failed to fetch') ||
      err?.name === 'TypeError';

    const errorMessage = isNetworkError
      ? 'Gagal terhubung ke server WarungKu. Pastikan server backend sedang aktif.'
      : (err?.message || 'Terjadi kesalahan sistem');

    return {
      success: false,
      error: errorMessage,
      status: 0,
    };
  }
}
