const API_URL = (
  (import.meta as ImportMeta & {
    env?: { VITE_API_URL?: string };
  }).env?.VITE_API_URL ||
  `http://${window.location.hostname}:3001/api`
).replace(/\/$/, "");

const AUTH_TOKEN_KEY = "cpa_auth_token";
const LOCAL_USER_KEY = "cpa_auth_user";
const SESSION_USER_KEY = "cpa_session_auth_user";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function setAuthToken(
  token: string,
  rememberMe = false,
): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);

  const storage = rememberMe
    ? localStorage
    : sessionStorage;

  storage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  );
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export function setStoredAuthUser(
  user: unknown,
  rememberMe = false,
): void {
  localStorage.removeItem(LOCAL_USER_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);

  const storage = rememberMe
    ? localStorage
    : sessionStorage;

  const key = rememberMe
    ? LOCAL_USER_KEY
    : SESSION_USER_KEY;

  storage.setItem(
    key,
    JSON.stringify(user),
  );
}

export function getStoredAuthUser<T>(): T | null {
  const raw =
    localStorage.getItem(LOCAL_USER_KEY) ||
    sessionStorage.getItem(SESSION_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearStoredAuthUser(): void {
  localStorage.removeItem(LOCAL_USER_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
}

export function clearAuthSession(): void {
  clearAuthToken();
  clearStoredAuthUser();
}

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    auth = true,
    headers,
    body,
    ...rest
  } = options;

  const requestHeaders = new Headers(headers);

  if (
    body !== undefined &&
    !(body instanceof FormData)
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json",
    );
  }

  if (auth) {
    const token = getAuthToken();

    if (!token) {
      throw new ApiError(
        "Sessão não encontrada. Faça login novamente.",
        401,
      );
    }

    requestHeaders.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...rest,
      headers: requestHeaders,
      body,
    },
  );

  const contentType =
    response.headers.get("content-type") || "";

  const data =
    contentType.includes("application/json")
      ? await response.json()
      : null;

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearAuthSession();
    }

    let message = `Erro HTTP ${response.status}`;

    if (
      data &&
      typeof data === "object"
    ) {
      if ("error" in data) {
        message = String(
          (data as { error: unknown }).error,
        );
      } else if ("mensagem" in data) {
        message = String(
          (data as { mensagem: unknown }).mensagem,
        );
      }
    }

    throw new ApiError(
      message,
      response.status,
      data,
    );
  }

  return data as T;
}

export function jsonBody(
  value: unknown,
): string {
  return JSON.stringify(value);
}