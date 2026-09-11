import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  CalendarX2,
  CheckCircle2,
  LinkIcon,
  ListX,
  Loader2,
} from "lucide-react";

import {
  RespondShell,
} from "../../features/respond/components/RespondShell";

import {
  StatusScreen,
} from "../../features/respond/components/StatusScreen";

import {
  EmailIdentifyStep,
} from "../../features/respond/components/EmailIdentifyStep";

import {
  SegmentSelectStep,
} from "../../features/respond/components/SegmentSelectStep";

import {
  QuestionnaireStep,
} from "../../features/respond/components/QuestionnaireStep";

import {
  SuccessStep,
} from "../../features/respond/components/SuccessStep";

import {
  getPublicFormById,
} from "../../services/forms.service";

import {
  submitPublicFormResponse,
} from "../../services/responses.service";

import {
  hasBrowserAlreadyAnswered,
  hasEmailHashAlreadyAnswered,
  saveAnonymousSubmission,
} from "../../features/respond/utils/respondStorage";

import {
  SEGMENT_TO_AUDIENCE,
  guessSegmentFromEmail,
  hashEmailForDeduplication,
} from "../../features/respond/utils/segment";

import type {
  FormParticipantAnswer,
  ParticipantSegment,
  SmartForm,
  SmartQuestion,
  StudentLevel,
} from "../../types";

type FlowStep =
  | "identify"
  | "segment"
  | "questionnaire"
  | "success";

export const RespondPage:
  React.FC = () => {

  /*
   * Apesar do parâmetro ainda se chamar
   * token, agora ele é o ID real do formulário.
   */
  const { token } =
    useParams<{
      token: string;
    }>();

  const [form, setForm] =
    useState<SmartForm | null>(
      null
    );

  const [
    isLoadingForm,
    setIsLoadingForm
  ] = useState(true);

  const [
    loadError,
    setLoadError
  ] = useState<string | null>(
    null
  );

  const [step, setStep] =
    useState<FlowStep>(
      "identify"
    );

  const [
    emailHash,
    setEmailHash
  ] = useState<
    string | null
  >(null);

  const [
    suggestedSegment,
    setSuggestedSegment
  ] = useState<
    ParticipantSegment | null
  >(null);

  const [
    segment,
    setSegment
  ] = useState<
    ParticipantSegment | null
  >(null);

  const [
    studentLevel,
    setStudentLevel
  ] = useState<
    | Exclude<
        StudentLevel,
        "todos"
      >
    | undefined
  >(undefined);

  const [
    identifyError,
    setIdentifyError
  ] = useState<
    string | null
  >(null);

  const [
    isSubmitting,
    setIsSubmitting
  ] = useState(false);

  /*
   * Busca formulário REAL no backend.
   */
  useEffect(() => {
    let active = true;

    async function load() {
      if (!token) {
        setIsLoadingForm(false);
        return;
      }

      try {
        const result =
          await getPublicFormById(
            token
          );

        if (!active) {
          return;
        }

        setForm(result);
        setLoadError(null);
      } catch (error) {
        console.error(
          "Erro ao carregar formulário público:",
          error
        );

        if (!active) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o formulário."
        );
      } finally {
        if (active) {
          setIsLoadingForm(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [token]);

  /*
   * Filtra perguntas de acordo
   * com Aluno / Docente / TAE.
   */
  const filteredQuestions:
    SmartQuestion[] =
    useMemo(() => {
      if (
        !form ||
        !segment
      ) {
        return [];
      }

      const audience =
        SEGMENT_TO_AUDIENCE[
          segment
        ];

      return form.questions.filter(
        (question) => {
          const matchesAudience =
            question.audiences.includes(
              "todos"
            ) ||
            question.audiences.includes(
              audience
            );

          if (!matchesAudience) {
            return false;
          }

          if (
            audience ===
              "alunos" &&
            question.studentLevel &&
            question.studentLevel !==
              "todos"
          ) {
            return (
              question.studentLevel ===
              studentLevel
            );
          }

          return true;
        }
      );
    }, [
      form,
      segment,
      studentLevel,
    ]);

  if (isLoadingForm) {
    return (
      <RespondShell>
        <StatusScreen
          icon={Loader2}
          tone="neutral"
          title="Carregando questionário"
          description="Aguarde enquanto buscamos o formulário da avaliação."
        />
      </RespondShell>
    );
  }

  if (
    !token ||
    loadError ||
    !form
  ) {
    return (
      <RespondShell>
        <StatusScreen
          icon={LinkIcon}
          tone="warning"
          title="Link inválido"
          description={
            loadError ||
            "Não encontramos o formulário associado a este QR Code."
          }
        />
      </RespondShell>
    );
  }

  /*
   * Para a apresentação:
   * basta estar publicado/ativo.
   *
   * Não vamos complicar agora
   * verificando datas.
   */
  if (
    form.status !== "Ativo" &&
    form.status !== "Ativa"
  ) {
    return (
      <RespondShell
        campaignTitle={
          form.title
        }
        campus={form.campus}
      >
        <StatusScreen
          icon={CalendarX2}
          tone="neutral"
          title="Este formulário não está aberto"
          description="Este questionário ainda não está disponível para respostas."
        />
      </RespondShell>
    );
  }

  /*
   * Controle local simples
   * contra resposta repetida.
   */
  if (
    hasBrowserAlreadyAnswered(
      form.id
    )
  ) {
    return (
      <RespondShell
        campaignTitle={
          form.title
        }
        campus={form.campus}
      >
        <StatusScreen
          icon={CheckCircle2}
          tone="success"
          title="Você já respondeu a esta avaliação"
          description="Uma resposta deste dispositivo já foi registrada para este formulário."
        />
      </RespondShell>
    );
  }

  const handleIdentify = (
    email: string
  ) => {
    const hash =
      hashEmailForDeduplication(
        email
      );

    if (
      hasEmailHashAlreadyAnswered(
        form.id,
        hash
      )
    ) {
      setIdentifyError(
        "Já existe uma resposta registrada para este e-mail neste formulário."
      );

      return;
    }

    setIdentifyError(null);

    setEmailHash(hash);

    setSuggestedSegment(
      guessSegmentFromEmail(
        email
      )
    );

    setStep("segment");
  };

  const handleSegmentContinue = (
    selectedSegment:
      ParticipantSegment,

    level?:
      Exclude<
        StudentLevel,
        "todos"
      >
  ) => {
    setSegment(
      selectedSegment
    );

    setStudentLevel(level);

    setStep(
      "questionnaire"
    );
  };

  const handleSubmitAnswers =
    async (
      answers:
        FormParticipantAnswer[]
    ) => {
      if (
        !segment ||
        !emailHash
      ) {
        return;
      }

      setIsSubmitting(true);

      try {
        /*
         * Salva no BACKEND.
         */
        await submitPublicFormResponse(
          form.id,
          emailHash,
          answers
        );

        const audience =
          SEGMENT_TO_AUDIENCE[
            segment
          ];

        /*
         * Mantemos o armazenamento
         * local somente para marcar
         * que este navegador/e-mail
         * já respondeu.
         */
        saveAnonymousSubmission(
          {
            id:
              `sub-${Date.now()}`,

            formId:
              form.id,

            segment:
              audience,

            submittedAt:
              new Date()
                .toISOString(),

            answers,

            campaignId:
              form.id,

            studentLevel:
              segment ===
                "discente"
                ? studentLevel
                : undefined,
          },
          form.id,
          emailHash
        );

        setStep(
          "success"
        );
      } catch (error) {
        console.error(
          "Erro ao enviar resposta:",
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "Não foi possível enviar a resposta."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const stepIndex =
    step === "identify"
      ? 1
      : step === "segment"
        ? 2
        : step ===
            "questionnaire"
          ? 3
          : 4;

  return (
    <RespondShell
      campaignTitle={
        form.title
      }
      campus={form.campus}
      stepIndex={stepIndex}
    >
      {step ===
        "identify" && (
        <EmailIdentifyStep
          onContinue={
            handleIdentify
          }
          errorMessage={
            identifyError
          }
        />
      )}

      {step ===
        "segment" && (
        <SegmentSelectStep
          suggestedSegment={
            suggestedSegment
          }
          onBack={() =>
            setStep(
              "identify"
            )
          }
          onContinue={
            handleSegmentContinue
          }
        />
      )}

      {step ===
        "questionnaire" &&
        (
          filteredQuestions.length >
          0
            ? (
              <QuestionnaireStep
                form={form}
                questions={
                  filteredQuestions
                }
                onBack={() =>
                  setStep(
                    "segment"
                  )
                }
                onSubmit={
                  handleSubmitAnswers
                }
                isSubmitting={
                  isSubmitting
                }
              />
            )
            : (
              <StatusScreen
                icon={ListX}
                tone="neutral"
                title="Nenhuma pergunta disponível"
                description="Não há perguntas configuradas para o seu perfil."
              />
            )
        )}

      {step ===
        "success" && (
        <SuccessStep />
      )}
    </RespondShell>
  );
};