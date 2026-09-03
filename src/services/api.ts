const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

const LOCAL_TOKEN_KEY = "cpa_auth_token";

const SESSION_TOKEN_KEY = "cpa_session_auth_token";

const LOCAL_USER_KEY = "cpa_auth_user";

const SESSION_USER_KEY = "cpa_session_auth_user";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getAuthToken(): string | null {
  return (
    localStorage.getItem(LOCAL_TOKEN_KEY) ||
    sessionStorage.getItem(SESSION_TOKEN_KEY)
  );
}

export function setAuthSession(
  token: string,
  user: unknown,
  rememberMe = false,
): void {
  clearAuthSession();

  const storage = rememberMe ? localStorage : sessionStorage;

  const tokenKey = rememberMe ? LOCAL_TOKEN_KEY : SESSION_TOKEN_KEY;

  const userKey = rememberMe ? LOCAL_USER_KEY : SESSION_USER_KEY;

  storage.setItem(tokenKey, token);

  storage.setItem(userKey, JSON.stringify(user));
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

export function clearAuthSession() {
  localStorage.removeItem(LOCAL_TOKEN_KEY);

  localStorage.removeItem(LOCAL_USER_KEY);

  sessionStorage.removeItem(SESSION_TOKEN_KEY);

  sessionStorage.removeItem(SESSION_USER_KEY);
}

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { auth = true, headers, body, ...rest } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const token = getAuthToken();

  if (auth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body,
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearAuthSession();
    }

    const message =
      data && typeof data === "object" && "error" in data
        ? String(
            (
              data as {
                error: unknown;
              }
            ).error,
          )
        : `Erro HTTP ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}
