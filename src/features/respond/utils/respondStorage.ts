import { INITIAL_SMART_FORMS } from "../../../data/formsData";
import { getCampaignStatus } from "../../../components/FormsManagerView";
import type { Campaign, FormSubmission, SmartForm } from "../../../types";

const CAMPAIGNS_KEY = "cpa_campaigns_list";
const FORMS_KEY = "cpa_smart_forms";
const SUBMISSIONS_KEY = "cpa_form_submissions";
const ANSWERED_CAMPAIGNS_KEY = "cpa_submitted_campaign_ids";
const ANSWERED_HASHES_PREFIX = "cpa_resp_hashes_";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// O token da campanha (usado na rota pública /responder/:token e no QR
// Code) é o próprio id da campanha gerado pelo painel administrativo.
export function getCampaignByToken(token: string): Campaign | null {
  const campaigns = safeParse<Campaign[]>(
    localStorage.getItem(CAMPAIGNS_KEY),
    []
  );
  return campaigns.find((c) => c.id === token) ?? null;
}

export function getFormById(formId: string): SmartForm | null {
  const forms = safeParse<SmartForm[]>(
    localStorage.getItem(FORMS_KEY),
    INITIAL_SMART_FORMS
  );
  return forms.find((f) => f.id === formId) ?? null;
}

export function isCampaignOpen(campaign: Campaign): boolean {
  const status = getCampaignStatus(
    campaign.startDate,
    campaign.startTime,
    campaign.endDate,
    campaign.endTime,
    campaign.status
  );
  return status === "Ativa";
}

// RN004 — cada usuário só pode responder uma vez por campanha/ciclo.
// Verificação primária: já existe um registro (anônimo) desta campanha
// neste navegador.
export function hasBrowserAlreadyAnswered(campaignId: string): boolean {
  const ids = safeParse<string[]>(
    localStorage.getItem(ANSWERED_CAMPAIGNS_KEY),
    []
  );
  return ids.includes(campaignId);
}

function markBrowserAsAnswered(campaignId: string): void {
  const ids = safeParse<string[]>(
    localStorage.getItem(ANSWERED_CAMPAIGNS_KEY),
    []
  );
  if (!ids.includes(campaignId)) {
    localStorage.setItem(
      ANSWERED_CAMPAIGNS_KEY,
      JSON.stringify([...ids, campaignId])
    );
  }
}

// Verificação secundária, por hash do e-mail institucional informado
// (permite detectar duplicidade mesmo em outro navegador/dispositivo).
export function hasEmailHashAlreadyAnswered(
  campaignId: string,
  emailHash: string
): boolean {
  const hashes = safeParse<string[]>(
    localStorage.getItem(`${ANSWERED_HASHES_PREFIX}${campaignId}`),
    []
  );
  return hashes.includes(emailHash);
}

function markEmailHashAsAnswered(campaignId: string, emailHash: string): void {
  const key = `${ANSWERED_HASHES_PREFIX}${campaignId}`;
  const hashes = safeParse<string[]>(localStorage.getItem(key), []);
  if (!hashes.includes(emailHash)) {
    localStorage.setItem(key, JSON.stringify([...hashes, emailHash]));
  }
}

function incrementFormResponseCount(
  formId: string,
  segment: "alunos" | "docentes" | "taes"
): void {
  const forms = safeParse<SmartForm[]>(
    localStorage.getItem(FORMS_KEY),
    INITIAL_SMART_FORMS
  );
  const updated = forms.map((f) =>
    f.id === formId
      ? {
          ...f,
          responsesCount: {
            total: (f.responsesCount?.total ?? 0) + 1,
            alunos: (f.responsesCount?.alunos ?? 0) + (segment === "alunos" ? 1 : 0),
            docentes:
              (f.responsesCount?.docentes ?? 0) + (segment === "docentes" ? 1 : 0),
            taes: (f.responsesCount?.taes ?? 0) + (segment === "taes" ? 1 : 0),
          },
        }
      : f
  );
  localStorage.setItem(FORMS_KEY, JSON.stringify(updated));
}

// Persiste uma resposta anônima (RN005): o payload nunca carrega e-mail,
// nome ou qualquer outro dado capaz de associar a resposta a uma pessoa —
// apenas segmento, nível (não identificador) e as respostas em si. O hash
// do e-mail é gravado à parte, só para controle de duplicidade (RN004).
export function saveAnonymousSubmission(
  submission: FormSubmission,
  campaignId: string,
  emailHash: string
): void {
  const submissions = safeParse<FormSubmission[]>(
    localStorage.getItem(SUBMISSIONS_KEY),
    []
  );
  localStorage.setItem(
    SUBMISSIONS_KEY,
    JSON.stringify([...submissions, submission])
  );

  incrementFormResponseCount(submission.formId, submission.segment);
  markBrowserAsAnswered(campaignId);
  markEmailHashAsAnswered(campaignId, emailHash);
}
