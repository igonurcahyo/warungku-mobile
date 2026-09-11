import { apiRequest, setAuthToken, ApiResponse } from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthStore {
  id: string;
  name: string;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: AuthUser;
  store?: AuthStore | null;
  error?: string;
}

export interface MeResult {
  success: boolean;
  user?: AuthUser;
  store?: AuthStore | null;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  message?: string;
  user?: AuthUser;
  store?: AuthStore | null;
  error?: string;
}

export interface RegisterPayload {
  name: string;
  storeName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  whatsapp?: string;
}

/**
 * Mobile Register API
 * POST /api/mobile/auth/register
 */
export async function registerApi(payload: RegisterPayload): Promise<RegisterResult> {
  const res = await apiRequest<{
    success: boolean;
    message?: string;
    user: AuthUser;
    store: AuthStore | null;
    error?: string;
  }>('/api/mobile/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Pendaftaran gagal. Silakan coba lagi.',
    };
  }

  return {
    success: true,
    message: res.data.message || 'Akun berhasil dibuat.',
    user: res.data.user,
    store: res.data.store,
  };
}

/**
 * Mobile Login API
 * POST /api/mobile/auth/login
 */
export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const res = await apiRequest<{
    success: boolean;
    token: string;
    user: AuthUser;
    store: AuthStore | null;
    error?: string;
  }>('/api/mobile/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (!res.success || !res.data?.token) {
    return {
      success: false,
      error: res.error || 'Login gagal, periksa email dan kata sandi Anda.',
    };
  }

  // Save active token
  setAuthToken(res.data.token);

  return {
    success: true,
    token: res.data.token,
    user: res.data.user,
    store: res.data.store,
  };
}

/**
 * Current Authenticated Session
 * GET /api/mobile/auth/me
 */
export async function getMeApi(tokenOverride?: string): Promise<MeResult> {
  const res = await apiRequest<{
    success: boolean;
    user: AuthUser;
    store: AuthStore | null;
    error?: string;
  }>('/api/mobile/auth/me', {
    method: 'GET',
    token: tokenOverride,
  });

  if (!res.success || !res.data?.user) {
    return {
      success: false,
      error: res.error || 'Sesi login tidak valid atau telah berakhir.',
    };
  }

  return {
    success: true,
    user: res.data.user,
    store: res.data.store,
  };
}

/**
 * Mobile Logout API
 * POST /api/mobile/auth/logout
 */
export async function logoutApi(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiRequest<{ success: boolean; message?: string }>(
      '/api/mobile/auth/logout',
      {
        method: 'POST',
      }
    );
    // Clear local token regardless of network status
    setAuthToken(null);
    return {
      success: res.success,
      message: res.data?.message || 'Berhasil keluar',
    };
  } catch {
    setAuthToken(null);
    return {
      success: true,
      message: 'Berhasil keluar secara lokal',
    };
  }
}
