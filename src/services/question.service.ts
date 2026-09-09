import type {
  SmartQuestion,
  TargetAudience,
} from "../types";

import { apiRequest } from "./api";

type BackendAudience =
  | "aluno"
  | "docente"
  | "servidor"
  | "coordenador";

type BackendQuestionType =
  | "multipla_escolha"
  | "texto_livre"
  | "escala"
  | "sim_nao";

interface CreateQuestionPayload {
  title: string;
  audiences: BackendAudience[];
  type: BackendQuestionType;
  options: string[];
  order: number;
  required: boolean;
}

interface CreateQuestionResponse {
  id: string;
}

interface CreateRelationResponse {
  id: string;
}

function mapAudiences(
  audiences: TargetAudience[]
): BackendAudience[] {
  const result =
    new Set<BackendAudience>();

  for (const audience of audiences) {
    if (audience === "todos") {
      result.add("aluno");
      result.add("docente");
      result.add("servidor");
    }

    if (audience === "alunos") {
      result.add("aluno");
    }

    if (audience === "docentes") {
      result.add("docente");
    }

    if (audience === "taes") {
      result.add("servidor");
    }
  }

  return Array.from(result);
}

function mapQuestionType(
  type: SmartQuestion["type"]
): BackendQuestionType {
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

export async function createQuestion(
  question: SmartQuestion,
  order: number
): Promise<CreateQuestionResponse> {
  const payload: CreateQuestionPayload = {
    title: question.title,
    audiences: mapAudiences(
      question.audiences
    ),
    type: mapQuestionType(
      question.type
    ),
    options: question.options ?? [],
    order,
    required: question.required,
  };

  return apiRequest<CreateQuestionResponse>(
    "/questions",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function linkQuestionToForm(
  formId: string,
  questionId: string
): Promise<CreateRelationResponse> {
  return apiRequest<CreateRelationResponse>(
    "/form-questions",
    {
      method: "POST",
      body: JSON.stringify({
        formId,
        questionId,
      }),
    }
  );
}

export async function saveQuestionsForForm(
  formId: string,
  questions: SmartQuestion[]
): Promise<void> {
  for (
    let index = 0;
    index < questions.length;
    index++
  ) {
    const question =
      questions[index];

    const created =
      await createQuestion(
        question,
        index
      );

    await linkQuestionToForm(
      formId,
      created.id
    );
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
}

function mapBackendAudiences(
  audiences: BackendAudience[]
): TargetAudience[] {
  const hasAluno =
    audiences.includes("aluno");

  const hasDocente =
    audiences.includes("docente");

  const hasServidor =
    audiences.includes("servidor");

  /*
   * Quando salvamos "todos", o frontend
   * converteu para aluno + docente + servidor.
   *
   * Aqui fazemos a conversão inversa.
   */
  if (
    hasAluno &&
    hasDocente &&
    hasServidor
  ) {
    return ["todos"];
  }

  const result: TargetAudience[] = [];

  if (hasAluno) {
    result.push("alunos");
  }

  if (hasDocente) {
    result.push("docentes");
  }

  if (hasServidor) {
    result.push("taes");
  }

  return result.length > 0
    ? result
    : ["todos"];
}

function mapBackendQuestionType(
  type: BackendQuestionType
): SmartQuestion["type"] {
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

function mapBackendQuestion(
  question: BackendQuestion
): SmartQuestion {
  return {
    id: question.id,

    title: question.title,

    type:
      mapBackendQuestionType(
        question.type
      ),

    required:
      question.required ?? false,

    /*
     * O backend atual não guarda categoria.
     * Então usamos um padrão visual.
     */
    category: "Outros",

    audiences:
      mapBackendAudiences(
        question.audiences
      ),

    options:
      question.options ?? [],
  };
}

export async function getQuestionsForForm(
  formId: string
): Promise<SmartQuestion[]> {
  const response =
    await apiRequest<BackendQuestion[]>(
      `/form-questions/form/${formId}`
    );

  return response.map(
    mapBackendQuestion
  );
}