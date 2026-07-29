export interface GoogleFormFile {
  id: string;
  name: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  iconLink?: string;
}

export interface QuestionOption {
  value: string;
}

export interface FormQuestionInput {
  title: string;
  type: 'RADIO' | 'CHECKBOX' | 'TEXT' | 'SCALE' | 'SHORT_TEXT' | 'LONG_TEXT' | 'DROPDOWN' | 'YES_NO';
  required?: boolean;
  options?: string[];
}

export interface GoogleFormItem {
  itemId: string;
  title: string;
  description?: string;
  questionItem?: {
    question: {
      questionId: string;
      required?: boolean;
      choiceQuestion?: {
        type: 'RADIO' | 'CHECKBOX' | 'DROP_DOWN';
        options: { value: string }[];
      };
      textQuestion?: {
        paragraph?: boolean;
      };
      scaleQuestion?: {
        low: number;
        high: number;
        lowLabel?: string;
        highLabel?: string;
      };
    };
  };
}

export interface GoogleFormDetails {
  formId: string;
  info: {
    title: string;
    description?: string;
    documentTitle?: string;
  };
  settings?: any;
  items?: GoogleFormItem[];
  responderUri?: string;
}

export interface GoogleFormAnswer {
  questionId: string;
  textAnswers?: {
    answers: { value: string }[];
  };
}

export interface GoogleFormResponseItem {
  responseId: string;
  createTime: string;
  lastSubmittedTime?: string;
  respondentEmail?: string;
  answers?: Record<string, GoogleFormAnswer>;
}

export interface GoogleFormResponsesData {
  responses?: GoogleFormResponseItem[];
  totalResponses?: number;
}

/**
 * List Google Forms stored in the user's Google Drive
 */
export async function listGoogleForms(accessToken: string): Promise<GoogleFormFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.form' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,createdTime,modifiedTime,iconLink)&pageSize=30&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Erro ao buscar formulários do Google Drive (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Get details and questions of a specific Google Form
 */
export async function getGoogleFormDetails(
  accessToken: string,
  formId: string
): Promise<GoogleFormDetails> {
  const url = `https://forms.googleapis.com/v1/forms/${formId}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Erro ao carregar detalhes do formulário (${response.status})`);
  }

  return await response.json();
}

/**
 * Get responses submitted to a Google Form
 */
export async function getGoogleFormResponses(
  accessToken: string,
  formId: string
): Promise<GoogleFormResponsesData> {
  const url = `https://forms.googleapis.com/v1/forms/${formId}/responses`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    // Note: If no responses have been submitted yet, it might return empty or 200 with empty responses array
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Erro ao carregar respostas do formulário (${response.status})`);
  }

  const data = await response.json();
  return {
    responses: data.responses || [],
    totalResponses: (data.responses || []).length,
  };
}

/**
 * Create a new Google Form with custom questions for CPA Campus Tauá
 */
export async function createGoogleForm(
  accessToken: string,
  title: string,
  description: string,
  questions: FormQuestionInput[]
): Promise<GoogleFormDetails> {
  // Step 1: Create initial empty form
  const createUrl = 'https://forms.googleapis.com/v1/forms';
  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: title || 'Avaliação CPA - IFCE Campus Tauá',
        documentTitle: title || 'Avaliação CPA Tauá',
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Erro ao criar formulário no Google Forms');
  }

  const newForm: GoogleFormDetails = await createRes.json();
  const formId = newForm.formId;

  // Step 2: Batch update to set description and add items/questions
  const requests: any[] = [];

  // Update description if provided
  if (description) {
    requests.push({
      updateFormInfo: {
        info: {
          description: description,
        },
        updateMask: 'description',
      },
    });
  }

  // Add questions
  questions.forEach((q, index) => {
    let questionTypeObj: any = {};

    if (q.type === 'RADIO' || q.type === 'CHECKBOX' || q.type === 'DROPDOWN') {
      const gType = q.type === 'DROPDOWN' ? 'DROP_DOWN' : q.type;
      questionTypeObj = {
        choiceQuestion: {
          type: gType,
          options: (q.options && q.options.length > 0 ? q.options : ['Opção 1', 'Opção 2']).map(
            (opt) => ({ value: opt })
          ),
        },
      };
    } else if (q.type === 'SCALE') {
      questionTypeObj = {
        scaleQuestion: {
          low: 1,
          high: 5,
          lowLabel: 'Péssimo / Discordo Totalmente',
          highLabel: 'Excelente / Concordo Totalmente',
        },
      };
    } else {
      questionTypeObj = {
        textQuestion: {
          paragraph: q.type === 'LONG_TEXT' || q.type === 'TEXT',
        },
      };
    }

    requests.push({
      createItem: {
        item: {
          title: q.title,
          questionItem: {
            question: {
              required: q.required ?? true,
              ...questionTypeObj,
            },
          },
        },
        location: {
          index: index,
        },
      },
    });
  });

  if (requests.length > 0) {
    const batchUrl = `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`;
    const batchRes = await fetch(batchUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });

    if (!batchRes.ok) {
      const err = await batchRes.json().catch(() => ({}));
      throw new Error(err?.error?.message || 'Erro ao adicionar perguntas ao Google Form');
    }
  }

  // Return updated details
  return getGoogleFormDetails(accessToken, formId);
}

/**
 * Trash/Delete a Google Form file from Google Drive
 */
export async function deleteGoogleForm(accessToken: string, formId: string): Promise<void> {
  const url = `https://www.googleapis.com/drive/v3/files/${formId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok && response.status !== 204) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Erro ao excluir o formulário no Google Drive');
  }
}
