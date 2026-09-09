import type { TargetAudience } from "../types";
import { apiRequest } from "./api";

export interface FormAnswerPayload {
  questionId: string;
  value: string | string[];
}

export interface SubmitFormResponse {
  id: string;
}

export interface BackendFormResponse {
  id: string;
  formId: string;
  userId: string;

  answers: Array<{
    questionId: string;
    value: string | string[];
  }>;

  submittedAt?:
    | string
    | {
        _seconds?: number;
        seconds?: number;
      }
    | null;
}

export interface ResultResponseRow {
  id: string;
  formId: string;

  respondentName: string;
  respondentEmail: string;

  segment: TargetAudience;

  campus: string;
  date: string;

  answers: Record<
    string,
    string | number
  >;
}

export async function submitFormResponse(
  formId: string,
  answers: FormAnswerPayload[]
): Promise<SubmitFormResponse> {
  return apiRequest<SubmitFormResponse>(
    "/respostaForms",
    {
      method: "POST",
      body: JSON.stringify({
        formId,
        answers,
      }),
    }
  );
}

function formatResponseDate(
  value: BackendFormResponse["submittedAt"]
): string {
  if (!value) {
    return "—";
  }

  if (typeof value === "string") {
    const date =
      new Date(value);

    return isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("pt-BR");
  }

  const seconds =
    value._seconds ??
    value.seconds;

  if (
    typeof seconds === "number"
  ) {
    return new Date(
      seconds * 1000
    ).toLocaleDateString(
      "pt-BR"
    );
  }

  return "—";
}

export async function listResponsesByForm(
  formId: string,
  campus: string
): Promise<ResultResponseRow[]> {
  const response =
    await apiRequest<
      BackendFormResponse[]
    >(
      `/respostaForms/form/${formId}`
    );

  return response.map(
    (item, index) => {
      const answers =
        Object.fromEntries(
          item.answers.map(
            (answer) => [
              answer.questionId,

              Array.isArray(
                answer.value
              )
                ? answer.value.join(
                    ", "
                  )
                : answer.value,
            ]
          )
        );

      return {
        id: item.id,
        formId: item.formId,

        /*
         * Para amanhã mantemos
         * o resultado anonimizado.
         */
        respondentName:
          `Participante ${index + 1}`,

        respondentEmail:
          "Resposta anônima",

        /*
         * O backend ainda não salva
         * o segmento da resposta.
         * Não vamos aumentar o escopo
         * agora.
         */
        segment: "todos",

        campus,

        date:
          formatResponseDate(
            item.submittedAt
          ),

        answers,
      };
    }
  );
}