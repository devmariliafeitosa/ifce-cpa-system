import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  ActionCodeSettings,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Reuse existing app or initialize
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add Workspace scopes for Google Forms and Google Drive
provider.addScope('https://www.googleapis.com/auth/forms.body');
provider.addScope('https://www.googleapis.com/auth/forms.responses.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

/**
 * Initialize auth listener and maintain cached access token in memory.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token lost on page refresh if re-authenticated silently without popup
        // The user will click "Conectar Google Forms" to get a fresh access token
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Perform Google Sign-In via popup to retrieve user & fresh OAuth access token
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Não foi possível obter o token de acesso do Google.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erro no Login Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const googleLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'E-mail em formato inválido.',
  'auth/user-not-found': 'Nenhuma conta encontrada para este e-mail.',
  'auth/missing-email': 'Informe um e-mail válido.',
  'auth/invalid-continue-uri': 'URL de redirecionamento inválida para redefinição de senha.',
  'auth/unauthorized-continue-uri': 'Domínio não autorizado para recuperação de senha.',
  'auth/expired-action-code': 'O link de redefinição expirou. Solicite um novo link.',
  'auth/invalid-action-code': 'O link de redefinição é inválido ou já foi utilizado.',
  'auth/weak-password': 'A nova senha é muito fraca.',
  'auth/network-request-failed': 'Falha de rede. Verifique sua conexão e tente novamente.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
};

const getAuthErrorMessage = (error: any, fallback: string): string => {
  const code = error?.code as string | undefined;
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return fallback;
};

export const sendResetPasswordEmail = async (
  email: string,
  actionCodeSettings?: ActionCodeSettings
): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (error: any) {
    throw new Error(
      getAuthErrorMessage(error, 'Não foi possível enviar o link de recuperação no momento.')
    );
  }
};

export const validatePasswordResetCode = async (oobCode: string): Promise<string> => {
  try {
    return await verifyPasswordResetCode(auth, oobCode);
  } catch (error: any) {
    throw new Error(
      getAuthErrorMessage(error, 'O link de redefinição nao é válido.')
    );
  }
};

export const applyPasswordReset = async (oobCode: string, newPassword: string): Promise<void> => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error: any) {
    throw new Error(
      getAuthErrorMessage(error, 'Não foi possível redefinir a senha com este link.')
    );
  }
};
