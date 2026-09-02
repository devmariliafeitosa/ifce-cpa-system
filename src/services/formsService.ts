import { apiRequest } from './api';

type FormFieldValue = string | number | boolean | undefined;

export interface Form {
  id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: FormFieldValue;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Question {
  id: string;
  formId: string;
  text: string;
  type: string;
  required?: boolean;
  [key: string]: FormFieldValue;
}

export interface Response {
  id: string;
  formId: string;
  questionId: string;
  answer: string;
  submittedAt?: string;
  [key: string]: FormFieldValue;
}

export const formsService = {
  async getAll(): Promise<Form[]> {
    const response = await apiRequest<ApiResponse<Form[]>>('/forms');
    return response.data;
  },

  async getById(id: string): Promise<Form> {
    const response = await apiRequest<ApiResponse<Form>>(`/forms/${id}`);
    return response.data;
  },

  async create(formData: Partial<Form>): Promise<Form> {
    const response = await apiRequest<ApiResponse<Form>>('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return response.data;
  },

  async update(id: string, formData: Partial<Form>): Promise<Form> {
    const response = await apiRequest<ApiResponse<Form>>(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/forms/${id}`, {
      method: 'DELETE',
    });
  },

  async getQuestions(formId: string): Promise<Question[]> {
    const response = await apiRequest<ApiResponse<Question[]>>(`/forms/${formId}/questions`);
    return response.data;
  },

  async getResponses(formId: string): Promise<Response[]> {
    const response = await apiRequest<ApiResponse<Response[]>>(`/forms/${formId}/responses`);
    return response.data;
  }
};