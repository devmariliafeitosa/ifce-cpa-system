export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  const fullUrl = `${API_URL.replace(/\/$/, '')}${cleanEndpoint}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error ||
      payload?.message ||
      'Erro de comunicação com o servidor'
    );
  }

  return payload as T;
}