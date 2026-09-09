import {
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { firebaseAuth } from "../config/firebase";

import {
  ApiError,
  apiRequest,
  clearStoredAuthUser,
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
  firebaseUid: string;
  nome: string;
  email: string;
  campusId?: string | null;
  roles: string[];
  ativo: boolean;
  siape?: string;
  createdAt?: string;
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

function getFirebaseErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error
      ? String(
          (error as { code: unknown }).code,
        )
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-mail ou senha inválidos.";

    case "auth/user-disabled":
      return "Esta conta foi desativada.";

    case "auth/too-many-requests":
      return "Muitas tentativas de login. Tente novamente mais tarde.";

    case "auth/network-request-failed":
      return "Não foi possível conectar ao Firebase. Verifique sua internet.";

    case "auth/invalid-email":
      return "E-mail inválido.";

    default:
      return "Não foi possível realizar o login.";
  }
}

export async function authenticateCoordinator({
  email,
  password,
  rememberMe = false,
}: AuthenticateCoordinatorParams): Promise<AuthenticationResult> {
  const enteredEmail =
    email.trim().toLowerCase();

  try {
    /**
     * Lembrar de mim:
     *
     * true:
     * continua autenticado ao fechar o navegador.
     *
     * false:
     * sessão termina ao fechar a aba/janela.
     */
    await setPersistence(
      firebaseAuth,
      rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence,
    );

    /**
     * Firebase verifica e-mail + senha.
     */
    await signInWithEmailAndPassword(
      firebaseAuth,
      enteredEmail,
      password,
    );

    const response =
      await apiRequest<MeResponse>("/auth/me");

    const backendUser = response.usuario;

    if (
      !backendUser.roles?.includes(
        "coordenador",
      )
    ) {
      await signOut(firebaseAuth);
      clearStoredAuthUser();

      return {
        success: false,
        message:
          "Esta conta não possui permissão de Coordenação.",
      };
    }

    const user: UserCoordinator = {
      id: backendUser.id,

      name: backendUser.nome,

      email: backendUser.email,

      campus:
        backendUser.campusId ||
        "Campus não informado",

      siape: backendUser.siape || "",

      createdAt:
        backendUser.createdAt || "",
    };

    setStoredAuthUser(
      user,
      rememberMe,
    );

    return {
      success: true,
      email: enteredEmail,
      user,
    };
  } catch (error) {
    /**
     * Se o Firebase autenticou mas o backend
     * recusou o usuário, encerra a sessão.
     */
    if (error instanceof ApiError) {
      await signOut(firebaseAuth);
      clearStoredAuthUser();

      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message:
        getFirebaseErrorMessage(error),
    };
  }
}

export async function requestPasswordReset({
  email,
}: RequestPasswordResetParams): Promise<void> {
  await sendPasswordResetEmail(
    firebaseAuth,
    email.trim().toLowerCase(),
  );
}

export async function resetPassword({
  password,
}: ResetPasswordParams): Promise<void> {
  void password;
}