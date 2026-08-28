import coordinatorsData from "../data/coordinators.json";

interface AuthenticateCoordinatorParams {
  email: string;
  password: string;
  prefilledEmail?: string;
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

export async function authenticateCoordinator({
  email,
  password,
  prefilledEmail = "",
}: AuthenticateCoordinatorParams): Promise<AuthenticationResult> {
  // Simulação temporária da chamada ao backend.
  await new Promise((resolve) => setTimeout(resolve, 800));

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
