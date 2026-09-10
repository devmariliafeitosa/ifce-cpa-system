
import type { SmartForm } from "../types";
import { apiRequest } from "./api";
import { getQuestionsForForm } from "./question.service";

export interface CreateFormPayload {
  title: string;
  description?: string;
  campusId: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  status: 'rascunho' | 'publicado';
  isAtivo: boolean;
}

export interface CreateFormResponse {
  id: string;
}

export async function createForm(
  data: CreateFormPayload
): Promise<CreateFormResponse> {
  return apiRequest<CreateFormResponse>(
    '/forms',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

export async function activateForm(
  formId: string
): Promise<void> {
  await apiRequest<unknown>(
    `/forms/${formId}/ativar`,
    {
      method: "PATCH",
    }
  );
}

export type UpdateFormPayload =
  Partial<CreateFormPayload>;

export async function updateForm(
  formId: string,
  data: UpdateFormPayload
): Promise<{ mensagem: string }> {
  return apiRequest<{ mensagem: string }>(
    `/forms/${formId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

interface BackendTimestamp {
  _seconds?: number;
  _nanoseconds?: number;

  seconds?: number;
  nanoseconds?: number;
}

export interface BackendForm {
  id: string;

  title: string;
  description?: string;

  campusId: string;

  startDate?: string;
  startTime?: string;

  endDate?: string;
  endTime?: string;

  status:
    | "rascunho"
    | "publicado"
    | "encerrado";

  isAtivo?: boolean;

  createdBy?: string;

  createdAt?:
    | string
    | BackendTimestamp
    | null;

  updatedAt?:
    | string
    | BackendTimestamp
    | null;
}

function formatBackendDate(
  value:
    | string
    | BackendTimestamp
    | null
    | undefined,
): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("pt-BR");
    }

    return value;
  }

  const seconds =
    value._seconds ??
    value.seconds;

  if (typeof seconds === "number") {
    return new Date(
      seconds * 1000,
    ).toLocaleDateString("pt-BR");
  }

  return "";
}

function mapStatus(
  status: BackendForm["status"],
  isAtivo?: boolean,
): SmartForm["status"] {
  if (status === "encerrado") {
    return "Encerrado";
  }

  if (
    status === "publicado" ||
    isAtivo === true
  ) {
    return "Ativo";
  }

  return "Rascunho";
}

function formatPeriodo(
  startDate?: string,
  endDate?: string,
): string | undefined {
  if (!startDate && !endDate) {
    return undefined;
  }

  const formatDate = (
    value?: string,
  ): string => {
    if (!value) return "";

    const [year, month, day] =
      value.split("-");

    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }

    return value;
  };

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end;
}

export function mapBackendFormToSmartForm(
  form: BackendForm,
): SmartForm {
  return {
    id: form.id,

    title: form.title,

    description:
      form.description ?? "",

    /*
     * Por enquanto o backend devolve somente
     * campusId.
     *
     * Depois vamos buscar o nome real do campus.
     */
    campus:
      form.campusId || "Campus não informado",

    status: mapStatus(
      form.status,
      form.isAtivo,
    ),

    createdAt:
      formatBackendDate(form.createdAt),

    updatedAt:
      formatBackendDate(form.updatedAt),

    startDate: form.startDate,
    startTime: form.startTime,

    endDate: form.endDate,
    endTime: form.endTime,

    periodo: formatPeriodo(
      form.startDate,
      form.endDate,
    ),

    questions: [],

    responsesCount: {
      total: 0,
      alunos: 0,
      docentes: 0,
      taes: 0,
    },
  };
}

export async function listForms(): Promise<
  SmartForm[]
> {
  const response =
    await apiRequest<BackendForm[]>(
      "/forms"
    );

  const forms =
    response.map(
      mapBackendFormToSmartForm
    );

  const formsWithQuestions =
    await Promise.all(
      forms.map(async (form) => {
        try {
          const questions =
            await getQuestionsForForm(
              form.id
            );

          return {
            ...form,
            questions,
          };
        } catch (error) {
          console.error(
            `Erro ao carregar perguntas do formulário ${form.id}:`,
            error
          );

          /*
           * Um erro nas perguntas não impede
           * a lista inteira de formulários
           * de aparecer.
           */
          return {
            ...form,
            questions: [],
          };
        }
      })
    );

  return formsWithQuestions;
}