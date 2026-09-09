import type { ParticipantSegment, StudentLevel, TargetAudience } from "../../../types";

// RESP-001 / seção 2 do documento de requisitos: o participante se
// autodeclara em um dos três segmentos institucionais.
export const SEGMENT_OPTIONS: {
  value: ParticipantSegment;
  label: string;
  description: string;
}[] = [
  {
    value: "discente",
    label: "Sou Aluno",
    description: "Técnico, Superior, Mestrado ou Pós-Graduação",
  },
  {
    value: "docente",
    label: "Sou Docente",
    description: "Professor(a) do IFCE",
  },
  {
    value: "tae",
    label: "Sou TAE",
    description: "Técnico(a) Administrativo em Educação",
  },
];

export const SEGMENT_TO_AUDIENCE: Record<
  ParticipantSegment,
  Exclude<TargetAudience, "todos">
> = {
  discente: "alunos",
  docente: "docentes",
  tae: "taes",
};

// Níveis de ensino exigidos pelo RESP-001, mapeados diretamente para o
// StudentLevel já usado no filtro de perguntas (SmartQuestion.studentLevel).
export const STUDENT_LEVEL_OPTIONS: {
  value: Exclude<StudentLevel, "todos">;
  label: string;
}[] = [
  { value: "tecnico", label: "Técnico" },
  { value: "graduacao", label: "Superior" },
  { value: "mestrado", label: "Mestrado" },
  { value: "pos_graduacao", label: "Pós-Graduação" },
];

const INSTITUTIONAL_EMAIL_REGEX =
  /^[^\s@]+@([a-zA-Z0-9-]+\.)*ifce\.edu\.br$/i;

// RN002 — acesso exclusivamente por e-mail institucional.
export function isInstitutionalEmail(email: string): boolean {
  return INSTITUTIONAL_EMAIL_REGEX.test(email.trim());
}

// Sugestão automática de segmento a partir do radical do e-mail
// (ex.: @aluno.ifce.edu.br, @prof.ifce.edu.br), conforme seção 2 do
// documento. É apenas uma sugestão pré-preenchida: a autodeclaração via
// botões (RESP-001) continua sendo o passo que define o segmento.
export function guessSegmentFromEmail(email: string): ParticipantSegment | null {
  const lower = email.trim().toLowerCase();
  if (lower.includes("@aluno.") || lower.includes(".aluno.")) return "discente";
  if (
    lower.includes("@prof.") ||
    lower.includes(".prof.") ||
    lower.includes("@docente.")
  )
    return "docente";
  if (
    lower.includes("@tae.") ||
    lower.includes(".tae.") ||
    lower.includes("@servidor.")
  )
    return "tae";
  return null;
}

// Hash simples (não criptográfico), usado apenas para impedir respostas
// duplicadas na mesma campanha (RN004). O e-mail em texto puro nunca é
// persistido junto da resposta — apenas este hash, isoladamente, para fins
// de deduplicação (seção 4: "Segurança e Anonimato").
export function hashEmailForDeduplication(email: string): string {
  const normalized = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash)}`;
}
