import {
  ApiError,
  apiRequest,
  clearAuthSession,
  clearStoredAuthUser,
  getStoredAuthUser,
  jsonBody,
  setAuthToken,
  setStoredAuthUser,
} from "./api";
import type { UserCoordinator } from "../types";

interface AuthenticateCoordinatorParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RequestPasswordResetParams {
  email: string;
}

interface ResetPasswordParams {
  password: string;
}

interface BackendUser {
  id: string;
  firebaseUid?: string;
  nome: string;
  email: string;
  campusId?: string | null;
  roles: string[];
  ativo: boolean;
  siape?: string;
  createdAt?: string;
  dadosRoles?: {
    coordenador?: { siape?: string | number };
    docente?: { siape?: string | number };
    servidor?: { siape?: string | number };
  };
}

interface LoginResponse {
  token: string;
  usuario: BackendUser;
}

interface MeResponse {
  usuario: BackendUser;
}

export type AuthenticationResult =
  | {
      success: true;
      email: string;
      user: UserCoordinator;
    }
  | {
      success: false;
      message: string;
    };

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível realizar o login.";
}

function mapBackendUser(
  backendUser: BackendUser,
): UserCoordinator {
  const siapeDoRole =
    backendUser.dadosRoles?.coordenador?.siape ??
    backendUser.dadosRoles?.docente?.siape ??
    backendUser.dadosRoles?.servidor?.siape;

  return {
    id: backendUser.id,
    name: backendUser.nome,
    email: backendUser.email,
    campus:
      backendUser.campusId ||
      "Campus não informado",
    siape: String(siapeDoRole ?? backendUser.siape ?? ""),
    createdAt: backendUser.createdAt || "",
  };
}

export async function authenticateCoordinator(
  params: AuthenticateCoordinatorParams,
): Promise<AuthenticationResult> {
  const email = params.email.trim().toLowerCase();

  try {
    const response = await apiRequest<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        auth: false,
        body: jsonBody({
          email,
          senha: params.password,
        }),
      },
    );

    const backendUser = response.usuario;

    if (!response.token) {
      return {
        success: false,
        message: "O servidor não retornou um token de acesso.",
      };
    }

    if (!backendUser) {
      return {
        success: false,
        message: "O servidor não retornou os dados do usuário.",
      };
    }

    if (!backendUser.ativo) {
      return {
        success: false,
        message: "Esta conta está desativada.",
      };
    }

    if (!backendUser.roles.includes("coordenador")) {
      return {
        success: false,
        message:
          "Acesso permitido somente para coordenadores.",
      };
    }

    const user = mapBackendUser(backendUser);

    setAuthToken(
      response.token,
      params.rememberMe ?? false,
    );

    setStoredAuthUser(
      user,
      params.rememberMe ?? false,
    );

    return {
      success: true,
      email: backendUser.email,
      user,
    };
  } catch (error) {
    clearAuthSession();

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function getCurrentUser(): Promise<BackendUser> {
  const response = await apiRequest<MeResponse>(
    "/auth/me",
  );

  return response.usuario;
}

export function getCurrentStoredUser(): UserCoordinator | null {
  return getStoredAuthUser<UserCoordinator>();
}

export async function logout(): Promise<void> {
  clearAuthSession();
}

export async function requestPasswordReset(
  params: RequestPasswordResetParams,
): Promise<void> {
  await apiRequest(
    "/auth/forgot-password",
    {
      method: "POST",
      auth: false,
      body: jsonBody({
        email: params.email.trim().toLowerCase(),
      }),
    },
  );
}

export async function resetPassword(
  params: ResetPasswordParams,
): Promise<void> {
  void params;
}