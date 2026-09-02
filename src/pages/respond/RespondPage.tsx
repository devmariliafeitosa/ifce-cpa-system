import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarX2, CheckCircle2, LinkIcon, ListX } from "lucide-react";

import { RespondShell } from "../../features/respond/components/RespondShell";
import { StatusScreen } from "../../features/respond/components/StatusScreen";
import { EmailIdentifyStep } from "../../features/respond/components/EmailIdentifyStep";
import { SegmentSelectStep } from "../../features/respond/components/SegmentSelectStep";
import { QuestionnaireStep } from "../../features/respond/components/QuestionnaireStep";
import { SuccessStep } from "../../features/respond/components/SuccessStep";

import {
  getCampaignByToken,
  getFormById,
  hasBrowserAlreadyAnswered,
  hasEmailHashAlreadyAnswered,
  isCampaignOpen,
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
  SmartQuestion,
  StudentLevel,
} from "../../types";

type FlowStep = "identify" | "segment" | "questionnaire" | "success";

export const RespondPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const campaign = useMemo(
    () => (token ? getCampaignByToken(token) : null),
    [token]
  );
  const form = useMemo(
    () => (campaign ? getFormById(campaign.formId) : null),
    [campaign]
  );

  const [step, setStep] = useState<FlowStep>("identify");
  const [emailHash, setEmailHash] = useState<string | null>(null);
  const [suggestedSegment, setSuggestedSegment] =
    useState<ParticipantSegment | null>(null);
  const [segment, setSegment] = useState<ParticipantSegment | null>(null);
  const [studentLevel, setStudentLevel] = useState<
    Exclude<StudentLevel, "todos"> | undefined
  >(undefined);
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RESP-002 — filtragem inteligente: perguntas gerais ("todos") + perguntas
  // do segmento do participante, respeitando o nível de ensino no caso de
  // discentes. Declarado antes de qualquer retorno antecipado (regra dos
  // Hooks do React).
  const filteredQuestions: SmartQuestion[] = useMemo(() => {
    if (!form || !segment) return [];
    const audience = SEGMENT_TO_AUDIENCE[segment];
    return form.questions.filter((q) => {
      const matchesAudience =
        q.audiences.includes("todos") || q.audiences.includes(audience);
      if (!matchesAudience) return false;

      if (audience === "alunos" && q.studentLevel && q.studentLevel !== "todos") {
        return q.studentLevel === studentLevel;
      }
      return true;
    });
  }, [form, segment, studentLevel]);

  // Invalid link / token não encontrado.
  if (!token || !campaign || !form) {
    return (
      <RespondShell>
        <StatusScreen
          icon={LinkIcon}
          tone="warning"
          title="Link inválido"
          description="Não encontramos nenhuma campanha de avaliação associada a este link. Verifique se o endereço foi copiado corretamente ou solicite um novo link/QR Code à coordenação da CPA."
        />
      </RespondShell>
    );
  }

  // Campanha fora do período de aplicação (agendada, encerrada ou rascunho).
  if (!isCampaignOpen(campaign)) {
    return (
      <RespondShell campaignTitle={campaign.title} campus={campaign.campus}>
        <StatusScreen
          icon={CalendarX2}
          tone="neutral"
          title="Esta campanha não está aberta no momento"
          description="O período de aplicação deste questionário ainda não começou ou já foi encerrado. Consulte a coordenação da CPA do seu campus para mais informações."
        />
      </RespondShell>
    );
  }

  // RN004 — já respondeu neste navegador.
  if (hasBrowserAlreadyAnswered(campaign.id)) {
    return (
      <RespondShell campaignTitle={campaign.title} campus={campaign.campus}>
        <StatusScreen
          icon={CheckCircle2}
          tone="success"
          title="Você já respondeu a esta avaliação"
          description="Identificamos que uma resposta já foi registrada para esta campanha a partir deste dispositivo. Cada participante pode responder apenas uma vez por ciclo. Obrigado por contribuir!"
        />
      </RespondShell>
    );
  }

  const handleIdentify = (email: string) => {
    const hash = hashEmailForDeduplication(email);

    if (hasEmailHashAlreadyAnswered(campaign.id, hash)) {
      setIdentifyError(
        "Já existe uma resposta registrada para este e-mail nesta campanha."
      );
      return;
    }

    setIdentifyError(null);
    setEmailHash(hash);
    setSuggestedSegment(guessSegmentFromEmail(email));
    setStep("segment");
  };

  const handleSegmentContinue = (
    selectedSegment: ParticipantSegment,
    level?: Exclude<StudentLevel, "todos">
  ) => {
    setSegment(selectedSegment);
    setStudentLevel(level);
    setStep("questionnaire");
  };

  const handleSubmitAnswers = (answers: FormParticipantAnswer[]) => {
    if (!segment || !emailHash) return;
    setIsSubmitting(true);

    const audience = SEGMENT_TO_AUDIENCE[segment];

    // RN005 — a resposta persistida nunca carrega e-mail ou qualquer outro
    // dado que identifique o participante.
    saveAnonymousSubmission(
      {
        id: `sub-${Date.now()}`,
        formId: form.id,
        segment: audience,
        submittedAt: new Date().toISOString(),
        answers,
        campaignId: campaign.id,
        studentLevel: segment === "discente" ? studentLevel : undefined,
      },
      campaign.id,
      emailHash
    );

    setIsSubmitting(false);
    setStep("success");
  };

  const stepIndex: Record<FlowStep, number> = {
    identify: 1,
    segment: 2,
    questionnaire: 3,
    success: 4,
  };

  return (
    <RespondShell
      campaignTitle={campaign.title}
      campus={campaign.campus}
      stepIndex={stepIndex[step]}
    >
      {step === "identify" && (
        <EmailIdentifyStep
          onContinue={handleIdentify}
          errorMessage={identifyError}
        />
      )}

      {step === "segment" && (
        <SegmentSelectStep
          suggestedSegment={suggestedSegment}
          onBack={() => setStep("identify")}
          onContinue={handleSegmentContinue}
        />
      )}

      {step === "questionnaire" &&
        (filteredQuestions.length > 0 ? (
          <QuestionnaireStep
            form={form}
            questions={filteredQuestions}
            onBack={() => setStep("segment")}
            onSubmit={handleSubmitAnswers}
            isSubmitting={isSubmitting}
          />
        ) : (
          <StatusScreen
            icon={ListX}
            tone="neutral"
            title="Nenhuma pergunta disponível"
            description="Não há perguntas configuradas para o seu perfil nesta campanha. Entre em contato com a coordenação da CPA se você acredita que isso é um engano."
          />
        ))}

      {step === "success" && <SuccessStep />}
    </RespondShell>
  );
};
