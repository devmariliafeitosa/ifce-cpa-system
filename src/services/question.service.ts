import type { SmartQuestion, TargetAudience } from "../types";
import { apiRequest } from "./api";
import { linkQuestionToForm } from "./form-questions.service";

type BackendAudience = "aluno" | "docente" | "servidor" | "coordenador";

type BackendQuestionType =
  | "multipla_escolha"
  | "texto_livre"
  | "escala"
  | "sim_nao";

type BackendStudentLevel =
  | "todos"
  | "tecnico"
  | "graduacao"
  | "mestrado"
  | "pos_graduacao";

interface CreateQuestionPayload {
  title: string;
  audiences: BackendAudience[];
  type: BackendQuestionType;
  options: string[];
  order: number;
  required: boolean;
  studentLevel: BackendStudentLevel;
}

interface CreateQuestionResponse {
  id: string;
}

function mapAudiences(audiences: TargetAudience[]): BackendAudience[] {
  const result = new Set<BackendAudience>();

  for (const audience of audiences) {
    if (audience === "todos") {
      result.add("aluno");
      result.add("docente");
      result.add("servidor");
    }
    if (audience === "alunos") result.add("aluno");
    if (audience === "docentes") result.add("docente");
    if (audience === "taes") result.add("servidor");
  }

  return Array.from(result);
}

function mapQuestionType(type: SmartQuestion["type"]): BackendQuestionType {
  switch (type) {
    case "SCALE":
      return "escala";
    case "YES_NO":
      return "sim_nao";
    case "RADIO":
    case "CHECKBOX":
    case "DROPDOWN":
      return "multipla_escolha";
    default:
      return "multipla_escolha";
  }
}

function mapStudentLevel(level?: SmartQuestion["studentLevel"]): BackendStudentLevel {
  if (!level || level === "todos") return "todos";

  switch (level) {
    case "tecnico":
      return "tecnico";
    case "graduacao":
      return "graduacao";
    case "mestrado":
      return "mestrado";
    case "pos_graduacao":
      return "pos_graduacao";
    default:
      return "todos";
  }
}

export async function createQuestion(
  question: SmartQuestion,
  order: number
): Promise<CreateQuestionResponse> {
  const payload: CreateQuestionPayload = {
    title: question.title,
    audiences: mapAudiences(question.audiences),
    type: mapQuestionType(question.type),
    options: question.options ?? [],
    order,
    required: question.required,
    studentLevel: mapStudentLevel(question.studentLevel),
  };

  return apiRequest<CreateQuestionResponse>("/questions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveQuestionsForForm(
  formId: string,
  questions: SmartQuestion[]
): Promise<void> {
  for (let index = 0; index < questions.length; index++) {
    const question = questions[index];
    const created = await createQuestion(question, index);
    await linkQuestionToForm(formId, created.id);
  }
}

interface BackendQuestion {
  id: string;
  idRelation?: string;
  title: string;
  audiences: BackendAudience[];
  type: BackendQuestionType;
  options?: string[];
  order?: number;
  required?: boolean;
  studentLevel?: BackendStudentLevel;
}

function mapBackendAudiences(audiences: BackendAudience[]): TargetAudience[] {
  const hasAluno = audiences.includes("aluno");
  const hasDocente = audiences.includes("docente");
  const hasServidor = audiences.includes("servidor");

  if (hasAluno && hasDocente && hasServidor) {
    return ["todos"];
  }

  const result: TargetAudience[] = [];
  if (hasAluno) result.push("alunos");
  if (hasDocente) result.push("docentes");
  if (hasServidor) result.push("taes");

  return result.length > 0 ? result : ["todos"];
}

function mapBackendQuestionType(type: BackendQuestionType): SmartQuestion["type"] {
  switch (type) {
    case "escala":
      return "SCALE";
    case "sim_nao":
      return "YES_NO";
    case "multipla_escolha":
      return "RADIO";
    default:
      return "RADIO";
  }
}

function mapBackendStudentLevel(level?: BackendStudentLevel): SmartQuestion["studentLevel"] {
  return level ?? "todos";
}

function mapBackendQuestion(question: BackendQuestion): SmartQuestion {
  return {
    id: question.id,
    title: question.title,
    type: mapBackendQuestionType(question.type),
    required: question.required ?? false,
    category: "Outros",
    audiences: mapBackendAudiences(question.audiences),
    options: question.options ?? [],
    studentLevel: mapBackendStudentLevel(question.studentLevel),
  };
}

export async function getQuestionsForForm(formId: string): Promise<SmartQuestion[]> {
  const response = await apiRequest<BackendQuestion[]>(
    `/form-questions/form/${formId}`
  );
  return response.map(mapBackendQuestion);
}