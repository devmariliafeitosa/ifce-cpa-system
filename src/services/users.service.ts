import { apiRequest } from "./api";

export type BackendRole = "aluno" | "docente" | "servidor" | "coordenador";

export interface DadosAluno {
  curso: string;
  matricula: string;
  semestre: string;
}

export interface DadosSiape {
  siape: number;
}

export interface CreateUserPayload {
  nome: string;
  email: string;
  campusId: string;
  roles: BackendRole[];
  ativo?: boolean;
  dadosPorRole: {
    aluno?: DadosAluno;
    docente?: DadosSiape;
    servidor?: DadosSiape;
    coordenador?: DadosSiape;
  };
}

export interface CreateUserResponse {
  id: string;
}

export interface BackendUser {
  id: string;
  nome: string;
  email: string;
  campusId: string;
  roles: BackendRole[];
  ativo: boolean;
  dadosRoles?: {
    aluno?: DadosAluno;
    docente?: DadosSiape;
    servidor?: DadosSiape;
    coordenador?: DadosSiape;
  };
}

export type UpdateUserPayload = Partial<
  Pick<CreateUserPayload, "nome" | "email" | "campusId" | "ativo" | "roles">
>;

export async function createUser(
  data: CreateUserPayload
): Promise<CreateUserResponse> {
  return apiRequest<CreateUserResponse>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function listUsers(): Promise<BackendUser[]> {
  return apiRequest<BackendUser[]>("/users");
}

export async function getUserById(userId: string): Promise<BackendUser> {
  return apiRequest<BackendUser>(`/users/${userId}`);
}

export async function updateUser(
  userId: string,
  data: UpdateUserPayload
): Promise<{ mensagem: string }> {
  return apiRequest<{ mensagem: string }>(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deactivateUser(
  userId: string
): Promise<{ mensagem: string }> {
  return apiRequest<{ mensagem: string }>(`/users/${userId}/desativar`, {
    method: "PATCH",
  });
}