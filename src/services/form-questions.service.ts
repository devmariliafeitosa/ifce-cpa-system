import { apiRequest } from "./api";

export interface QuestionFormRelation {
  id?: string;
  formId: string;
  questionId: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionFormRelationPayload {
  formId: string;
  questionId: string;
  order?: number;
}

export async function linkQuestionToForm(
  formId: string,
  questionId: string,
  order?: number,
): Promise<QuestionFormRelation> {
  return apiRequest<QuestionFormRelation>(
    "/form-questions",
    {
      method: "POST",
      body: JSON.stringify({
        formId,
        questionId,
        ...(order !== undefined ? { order } : {}),
      }),
    },
  );
}

export async function getQuestionRelationsForForm(
  formId: string,
): Promise<QuestionFormRelation[]> {
  return apiRequest<QuestionFormRelation[]>(
    `/form-questions/form/${encodeURIComponent(formId)}`,
  );
}
