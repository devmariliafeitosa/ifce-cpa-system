import { apiRequest } from "./api";

export interface BackendCampus {
  id: string;
  nome: string;
  sigla: string;
  ativo: boolean;
}

export interface CreateCampusPayload {
  nome: string;
  sigla: string;
  ativo?: boolean;
}

export async function listCampuses(
  apenasAtivos = false
): Promise<BackendCampus[]> {
  const query = apenasAtivos ? "?apenasAtivos=true" : "";
  return apiRequest<BackendCampus[]>(`/campuses${query}`);
}

export async function getCampusById(
  campusId: string
): Promise<BackendCampus> {
  return apiRequest<BackendCampus>(
    `/campuses/${encodeURIComponent(campusId)}`
  );
}

export async function createCampus(
  data: CreateCampusPayload
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>("/campuses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deactivateCampus(
  campusId: string
): Promise<{ mensagem: string }> {
  return apiRequest<{ mensagem: string }>(
    `/campuses/${encodeURIComponent(campusId)}/desativar`,
    { method: "PATCH" }
  );
}