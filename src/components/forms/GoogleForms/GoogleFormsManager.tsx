import type { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  getAccessToken,
  googleLogout,
  googleSignIn,
  initAuth,
} from '../../../lib/googleAuth.ts';
import {
  createGoogleForm,
  deleteGoogleForm,
  getGoogleFormDetails,
  getGoogleFormResponses,
  listGoogleForms,
} from '../../../services/googleFormsService';

import type {
  FormQuestionInput,
  GoogleFormDetails,
  GoogleFormFile,
  GoogleFormResponsesData,
} from '../../../services/googleFormsService';

import { CPA_PRESET_TEMPLATES } from './data/cpaPresetTemplates';
import { GoogleFormsMainContent } from './components/GoogleFormsMainContent';
import { CreateCustomFormModal } from './modals/CreateCustomFormModal';
import { FormInspectorModal } from './modals/FormInspectorModal';
import { DeleteGoogleFormConfirmModal } from './modals/DeleteGoogleFormConfirmModal';

interface GoogleFormsManagerProps {
  onReturnToDashboard?: () => void;
}


export const GoogleFormsManager: React.FC<GoogleFormsManagerProps> = () => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forms list state
  const [formsList, setFormsList] = useState<GoogleFormFile[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Custom Form Builder state
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customQuestions, setCustomQuestions] = useState<FormQuestionInput[]>([
    {
      title: "Como você avalia a organização do curso?",
      type: "SCALE",
      required: true,
    },
  ]);

  // Selected Form Details & Inspector Modal
  const [inspectFormId, setInspectFormId] = useState<string | null>(null);
  const [inspectDetails, setInspectDetails] =
    useState<GoogleFormDetails | null>(null);
  const [inspectResponses, setInspectResponses] =
    useState<GoogleFormResponsesData | null>(null);
  const [isLoadingInspect, setIsLoadingInspect] = useState(false);

  // Delete Confirmation Dialog state
  const [deleteTarget, setDeleteTarget] = useState<GoogleFormFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, accessToken) => {
        setGoogleUser(user);
        setToken(accessToken);
        setIsLoadingAuth(false);
        fetchForms(accessToken);
      },
      () => {
        setGoogleUser(null);
        setToken(null);
        setIsLoadingAuth(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setToken(res.accessToken);
        setSuccessMsg("Conectado com sucesso ao Google Forms!");
        fetchForms(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "Falha ao conectar com o Google. Tente novamente.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleLogout();
    setGoogleUser(null);
    setToken(null);
    setFormsList([]);
    setSuccessMsg("Conta desconectada do Google.");
  };

  const fetchForms = async (currentToken?: string) => {
    const authToken = currentToken || token || getAccessToken();
    if (!authToken) return;

    setIsLoadingForms(true);
    setErrorMsg(null);
    try {
      const files = await listGoogleForms(authToken);
      setFormsList(files);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message ||
          "Erro ao buscar formulários no Google Drive. Verifique se o login está ativo.",
      );
    } finally {
      setIsLoadingForms(false);
    }
  };

  // Quick Create Preset Form
  const handleDeployPreset = async (presetId: string) => {
    const authToken = token || getAccessToken();
    if (!authToken) {
      setErrorMsg("Por favor, conecte sua conta Google primeiro.");
      return;
    }

    const template = CPA_PRESET_TEMPLATES.find((t) => t.id === presetId);
    if (!template) return;

    setIsSubmittingForm(true);
    setErrorMsg(null);
    try {
      const created = await createGoogleForm(
        authToken,
        template.title,
        template.description,
        template.questions,
      );
      setSuccessMsg(
        `Formulário "${template.title}" criado com sucesso no Google Forms!`,
      );
      fetchForms(authToken);
      if (created?.formId) {
        handleInspectForm(created.formId);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "Erro ao publicar formulário no Google Forms.",
      );
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Create Custom Form
  const handleCreateCustomForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = token || getAccessToken();
    if (!authToken) {
      setErrorMsg("Conecte ao Google Forms antes de criar.");
      return;
    }

    if (!customTitle.trim()) {
      setErrorMsg("Por favor, digite o título do formulário.");
      return;
    }

    setIsSubmittingForm(true);
    setErrorMsg(null);
    try {
      const created = await createGoogleForm(
        authToken,
        customTitle,
        customDescription,
        customQuestions,
      );
      setSuccessMsg(
        `Formulário "${customTitle}" criado com sucesso no Google Forms!`,
      );
      setIsCreateModalOpen(false);
      setCustomTitle("");
      setCustomDescription("");
      setCustomQuestions([
        {
          title: "Como você avalia a organização do curso?",
          type: "SCALE",
          required: true,
        },
      ]);
      fetchForms(authToken);
      if (created?.formId) {
        handleInspectForm(created.formId);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Erro ao criar o formulário.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Inspect Form & Fetch Responses
  const handleInspectForm = async (formId: string) => {
    const authToken = token || getAccessToken();
    if (!authToken) return;

    setInspectFormId(formId);
    setIsLoadingInspect(true);
    setInspectDetails(null);
    setInspectResponses(null);

    try {
      const [details, responses] = await Promise.all([
        getGoogleFormDetails(authToken, formId),
        getGoogleFormResponses(authToken, formId).catch(() => ({
          responses: [],
          totalResponses: 0,
        })),
      ]);
      setInspectDetails(details);
      setInspectResponses(responses);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "Erro ao buscar detalhes e respostas do formulário.",
      );
    } finally {
      setIsLoadingInspect(false);
    }
  };

  // Confirm and Delete Form
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const authToken = token || getAccessToken();
    if (!authToken) return;

    setIsDeleting(true);
    try {
      await deleteGoogleForm(authToken, deleteTarget.id);
      setSuccessMsg(
        `Formulário "${deleteTarget.name}" movido para a lixeira do Google Drive.`,
      );
      setDeleteTarget(null);
      fetchForms(authToken);
      if (inspectFormId === deleteTarget.id) {
        setInspectFormId(null);
        setInspectDetails(null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Erro ao excluir o formulário.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Form question builders handlers
  const addQuestion = () => {
    setCustomQuestions([
      ...customQuestions,
      {
        title: "",
        type: "SCALE",
        required: true,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (customQuestions.length <= 1) return;
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const updateQuestion = (
    index: number,
    field: keyof FormQuestionInput,
    value: any,
  ) => {
    const updated = [...customQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setCustomQuestions(updated);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-200">
      <GoogleFormsMainContent
        googleUser={googleUser}
        token={token}
        isLoadingAuth={isLoadingAuth}
        isLoggingIn={isLoggingIn}
        handleGoogleLogin={handleGoogleLogin}
        handleGoogleLogout={handleGoogleLogout}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        successMsg={successMsg}
        setSuccessMsg={setSuccessMsg}
        isLoadingForms={isLoadingForms}
        fetchForms={fetchForms}
        setIsCreateModalOpen={setIsCreateModalOpen}
        isSubmittingForm={isSubmittingForm}
        handleDeployPreset={handleDeployPreset}
        formsList={formsList}
        handleInspectForm={handleInspectForm}
        setDeleteTarget={setDeleteTarget}
      />

      <CreateCustomFormModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        handleCreateCustomForm={handleCreateCustomForm}
        customTitle={customTitle}
        setCustomTitle={setCustomTitle}
        customDescription={customDescription}
        setCustomDescription={setCustomDescription}
        customQuestions={customQuestions}
        addQuestion={addQuestion}
        removeQuestion={removeQuestion}
        updateQuestion={updateQuestion}
        isSubmittingForm={isSubmittingForm}
      />

      <FormInspectorModal
        inspectFormId={inspectFormId}
        setInspectFormId={setInspectFormId}
        isLoadingInspect={isLoadingInspect}
        inspectDetails={inspectDetails}
        inspectResponses={inspectResponses}
      />

      <DeleteGoogleFormConfirmModal
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        isDeleting={isDeleting}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
