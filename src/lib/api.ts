/**
 * API Service Layer - Google Apps Script Backend
 * BEM RDM FHUB - Seleksi Staff Muda
 */

const API_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string;

export interface ParticipantData {
  nim: string;
  name: string;
  ministry: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  announcement_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  stats?: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
    passRate: string;
  };
}

export interface LoginResponse {
  token: string;
  email: string;
}

function isConfigured(): boolean {
  return Boolean(
    API_URL && 
    typeof API_URL === 'string' && 
    API_URL.startsWith('http') && 
    !API_URL.includes('placeholder') && 
    !API_URL.includes('XXXXX')
  );
}

async function apiGet<T>(params: Record<string, string>): Promise<ApiResponse<T>> {
  if (!isConfigured()) {
    console.error('API not configured. URL:', API_URL);
    return { success: false, error: 'API_NOT_CONFIGURED', message: 'API endpoint not configured.' };
  }

  try {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    const fullUrl = `${API_URL}?${queryString}`;
    console.log('API GET Request:', fullUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeout);

      console.log('API Response Status:', response.status, response.statusText);

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        return { success: false, error: 'NETWORK_ERROR', message: `HTTP ${response.status}` };
      }

      const data = await response.json();
      console.log('API Response Data:', data);
      return data;
    } catch (err: unknown) {
      clearTimeout(timeout);
      console.error('API fetch error:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, error: 'TIMEOUT', message: 'Request timed out.' };
      }
      return { success: false, error: 'NETWORK_ERROR', message: 'Cannot connect to server.' };
    }
  } catch (err: unknown) {
    console.error('API configuration error:', err);
    return { success: false, error: 'NETWORK_ERROR', message: 'Invalid API configuration.' };
  }
}

async function apiPost<T>(body: Record<string, unknown>): Promise<ApiResponse<T>> {
  if (!isConfigured()) {
    return { success: false, error: 'API_NOT_CONFIGURED', message: 'API endpoint not configured.' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return { success: false, error: 'NETWORK_ERROR', message: `HTTP ${response.status}` };
      }

      return await response.json();
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, error: 'TIMEOUT', message: 'Request timed out.' };
      }
      return { success: false, error: 'NETWORK_ERROR', message: 'Cannot connect to server.' };
    }
  } catch (err: unknown) {
    return { success: false, error: 'NETWORK_ERROR', message: 'Invalid API configuration.' };
  }
}

export async function getParticipantByNim(nim: string): Promise<ApiResponse<ParticipantData>> {
  const response = await apiGet<any>({
    action: 'getParticipant',
    nim: nim.trim(),
  });

  if (response.success && response.data) {
    const data = response.data;
    
    if (data.status) {
      data.status = String(data.status).toUpperCase();
    }
    
    if (data.nim) {
      data.nim = String(data.nim);
    }
    
    const ministryMap: Record<string, string> = {
      'PSDM': 'Pengembangan dan Sumber Daya Manusia',
      'KAS': 'Kajian dan Aksi Strategis',
      'SPI': 'Satuan Pengendali Internal',
      'DHK': 'Deputi Hukum Kepresidenan',
      'PPP': 'Pemberdayaan dan Perlindungan Perempuan',
      'KPO': 'Kebudayaan Pemuda dan Olahraga',
      'EKRAF': 'Ekonomi Kreatif',
      'SL': 'Sosial dan Linkungan',
      'DIK': 'Pendidikan',
      'AKM': 'Advokasi dan Kesejahteraan Mahasiswa',
      'DLN': 'Dalam dan Luar Negeri',
      'KMI': 'Komunikasi, Media dan Informasi',
    };
    
    if (data.ministry && ministryMap[data.ministry]) {
      data.ministry = ministryMap[data.ministry];
    }
    
    response.data = data;
  }

  return response as ApiResponse<ParticipantData>;
}

export async function adminLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
  return apiPost<LoginResponse>({
    action: 'login',
    email: email.trim(),
    password,
  });
}

export async function adminLogout(token: string): Promise<ApiResponse> {
  return apiPost({
    action: 'logout',
    token,
  });
}

export async function getParticipants(token: string): Promise<ApiResponse<ParticipantData[]>> {
  return apiPost<ParticipantData[]>({
    action: 'listParticipants',
    token,
  });
}

export async function createParticipant(
  token: string,
  data: { nim: string; name: string; ministry: string; status: string }
): Promise<ApiResponse<ParticipantData>> {
  return apiPost<ParticipantData>({
    action: 'createParticipant',
    token,
    ...data,
  });
}

export async function updateParticipant(
  token: string,
  originalNim: string,
  data: { nim?: string; name?: string; ministry?: string; status?: string }
): Promise<ApiResponse<ParticipantData>> {
  return apiPost<ParticipantData>({
    action: 'updateParticipant',
    token,
    originalNim,
    ...data,
  });
}

export async function deleteParticipant(
  token: string,
  nim: string
): Promise<ApiResponse> {
  return apiPost({
    action: 'deleteParticipant',
    token,
    nim,
  });
}

export async function importParticipants(
  token: string,
  participants: Array<{ nim: string; name: string; ministry: string; status: string }>
): Promise<ApiResponse<{ imported: number; skipped: number; duplicates: number; invalid: number; errors: string[] }>> {
  return apiPost({
    action: 'importParticipants',
    token,
    participants,
  });
}

const TOKEN_KEY = 'admin_session_token';
const EMAIL_KEY = 'admin_session_email';

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  return sessionStorage.getItem(EMAIL_KEY);
}

export function storeSession(token: string, email: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(EMAIL_KEY, email);
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}

export function isApiConfigured(): boolean {
  return isConfigured();
}
