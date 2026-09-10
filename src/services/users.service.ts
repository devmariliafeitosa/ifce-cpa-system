import { apiRequest } from "./api";

export type BackendRole =
  | "aluno"
  | "docente"
  | "servidor"
  | "coordenador";

export interface DadosAluno {
  curso: string;
  matricula: string;
  semestre: string;
}

export interface DadosSiape {
  siape: number;
}

export interface DadosRoles {
  aluno?: DadosAluno;
  docente?: DadosSiape;
  servidor?: DadosSiape;
  coordenador?: DadosSiape;
}

export interface BackendUser {
  id: string;
  nome: string;
  email: string;
  campusId: string;
  roles: BackendRole[];
  ativo: boolean;
  dadosRoles?: DadosRoles;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  nome: string;
  email: string;
  campusId: string;
  roles: BackendRole[];
  ativo?: boolean;
  dadosPorRole?: DadosRoles;
}

export interface UpdateUserPayload {
  nome?: string;
  email?: string;
  campusId?: string;
  ativo?: boolean;
  roles?: BackendRole[];
}

export async function createUser(
  data: CreateUserPayload,
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function listUsers(): Promise<BackendUser[]> {
  return apiRequest<BackendUser[]>("/users");
}

export async function getUserById(
  userId: string,
): Promise<BackendUser> {
  return apiRequest<BackendUser>(
    `/users/${encodeURIComponent(userId)}`,
  );
}

export async function updateUser(
  userId: string,
  data: UpdateUserPayload,
): Promise<{ mensagem: string }> {
  return apiRequest<{ mensagem: string }>(
    `/users/${encodeURIComponent(userId)}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function deactivateUser(
  userId: string,
): Promise<{ mensagem: string }> {
  return apiRequest<{ mensagem: string }>(
    `/users/${encodeURIComponent(userId)}/desativar`,
    {
      method: "PATCH",
    },
  );
}