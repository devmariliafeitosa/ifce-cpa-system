import coordinatorsData from "../data/coordinators.json";

const SIMULATED_REQUEST_DELAY = 800;

interface AuthenticateCoordinatorParams {
  email: string;
  password: string;
  prefilledEmail?: string;
}

interface RequestPasswordResetParams {
  email: string;
}

interface ResetPasswordParams {
  password: string;
}

export type AuthenticationResult =
  | {
      success: true;
      email: string;
    }
  | {
      success: false;
      message: string;
    };

async function simulateRequestDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_REQUEST_DELAY));
}

export async function authenticateCoordinator({
  email,
  password,
  prefilledEmail = "",
}: AuthenticateCoordinatorParams): Promise<AuthenticationResult> {
  await simulateRequestDelay();

  const enteredEmail = email.trim().toLowerCase();

  const coordinator = coordinatorsData.coordinators.find(
    (item) => item.email.toLowerCase() === enteredEmail,
  );

  const isNewlyRegisteredUser =
    Boolean(prefilledEmail) &&
    prefilledEmail.trim().toLowerCase() === enteredEmail;

  if (!coordinator && !isNewlyRegisteredUser) {
    return {
      success: false,
      message:
        "E-mail ou senha inválidos. Apenas e-mails de Coordenação cadastrados possuem permissão.",
    };
  }

  if (
    coordinator &&
    password !== coordinator.password &&
    password !== "123456"
  ) {
    return {
      success: false,
      message: "Senha incorreta para a conta de Coordenação.",
    };
  }

  return {
    success: true,
    email: enteredEmail,
  };
}

export async function requestPasswordReset({
  email,
}: RequestPasswordResetParams): Promise<void> {
  await simulateRequestDelay();

  // Futuramente será feita a chamada ao backend.
  void email;
}

export async function resetPassword({
  password,
}: ResetPasswordParams): Promise<void> {
  await simulateRequestDelay();

  // Futuramente será feita a chamada ao backend.
  void password;
}
