import type { TargetAudience } from '../types';

export interface ParticipantResponseRow {
  id: string;
  formId: string;
  respondentName: string;
  respondentEmail: string;
  segment: TargetAudience;
  campus: string;
  date: string;
  answers: Record<string, string | number>; 
}

export const MOCK_PARTICIPANT_RESPONSES: ParticipantResponseRow[] = [
 
  {
    id: 'resp-101',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Ana Beatriz Souza',
    respondentEmail: 'ana.souza@aluno.ifce.edu.br',
    segment: 'alunos',
    campus: 'Campus Tauá',
    date: '20/06/2026',
    answers: {
      q1: 4, // Infraestrutura: Alto
      q2: 5, // Didática: Alto
      q3: 4, // Clareza prazos: Alto
      q6: 5, // Biblioteca/Wi-Fi: Alto
      q7: 'Salas de aula e climatização',
      q8: 'Os novos equipamentos de laboratório ajudaram bastante nas aulas práticas.',
    },
  },
  {
    id: 'resp-102',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Lucas Ferreira Lima',
    respondentEmail: 'lucas.lima@aluno.ifce.edu.br',
    segment: 'alunos',
    campus: 'Campus Tauá',
    date: '20/06/2026',
    answers: {
      q1: 5,
      q2: 4,
      q3: 5,
      q6: 4,
      q7: 'Laboratórios de informática',
      q8: 'A biblioteca do campus é excelente para estudos em grupo.',
    },
  },
  {
    id: 'resp-103',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Mateus Oliveira Costa',
    respondentEmail: 'mateus.costa@aluno.ifce.edu.br',
    segment: 'alunos',
    campus: 'Campus Tauá',
    date: '21/06/2026',
    answers: {
      q1: 3, // Médio
      q2: 5,
      q3: 4,
      q6: 3, // Médio
      q7: 'Refeitório / Alimentação',
      q8: 'Melhorar o sinal de Wi-Fi nos blocos distantes.',
    },
  },
  {
    id: 'resp-104',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Camila Rodrigues Alves',
    respondentEmail: 'camila.alves@aluno.ifce.edu.br',
    segment: 'alunos',
    campus: 'Campus Tauá',
    date: '21/06/2026',
    answers: {
      q1: 4,
      q2: 4,
      q3: 3,
      q6: 4,
      q7: 'Salas de aula e climatização',
      q8: 'Atendimento muito bom por parte dos professores.',
    },
  },
  {
    id: 'resp-105',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Gabriel Santos Silva',
    respondentEmail: 'gabriel.silva@aluno.ifce.edu.br',
    segment: 'alunos',
    campus: 'Campus Tauá',
    date: '22/06/2026',
    answers: {
      q1: 2, // Baixo
      q2: 5,
      q3: 4,
      q6: 2, // Baixo
      q7: 'Quadra e espaço de convivência',
      q8: 'Precisamos de mais vagas no refeitório acadêmico.',
    },
  },
  {
    id: 'resp-106',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Juliana Mendes Rocha',
    respondentEmail: 'juliana.rocha@aluno.ifce.edu.br',
    segment: 'alunos',
    campus: 'Campus Tauá',
    date: '22/06/2026',
    answers: {
      q1: 4,
      q2: 5,
      q3: 5,
      q6: 5,
      q7: 'Biblioteca e salas de estudo',
      q8: 'Excelente ano letivo.',
    },
  },

  // Docentes
  {
    id: 'resp-107',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Prof. Dr. Marcos Antonio Pereira',
    respondentEmail: 'marcos.pereira@ifce.edu.br',
    segment: 'docentes',
    campus: 'Campus Tauá',
    date: '20/06/2026',
    answers: {
      q1: 5, // Infra: Alto (85%)
      q4: 4, // Capacitação: Alto
      q5: 5, // Apoio Gestão: Alto
      q6: 4, // Biblioteca: Alto
      q7: 'Laboratórios de informática',
      q8: 'Apoio pedagógico continuo por parte da chefia de ensino.',
    },
  },
  {
    id: 'resp-108',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Profa. Dra. Patricia Cavalcante',
    respondentEmail: 'patricia.cavalcante@ifce.edu.br',
    segment: 'docentes',
    campus: 'Campus Tauá',
    date: '20/06/2026',
    answers: {
      q1: 4,
      q4: 5,
      q5: 4,
      q6: 5,
      q7: 'Salas de aula e climatização',
      q8: 'Boa infraestrutura para desenvolvimento de projetos de pesquisa.',
    },
  },
  {
    id: 'resp-109',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Prof. Me. Rodrigo Nobre',
    respondentEmail: 'rodrigo.nobre@ifce.edu.br',
    segment: 'docentes',
    campus: 'Campus Tauá',
    date: '21/06/2026',
    answers: {
      q1: 4,
      q4: 4,
      q5: 5,
      q6: 4,
      q7: 'Laboratórios de informática',
      q8: 'Prazos de editais bem definidos.',
    },
  },
  {
    id: 'resp-110',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Profa. Esp. Fernanda Duarte',
    respondentEmail: 'fernanda.duarte@ifce.edu.br',
    segment: 'docentes',
    campus: 'Campus Tauá',
    date: '22/06/2026',
    answers: {
      q1: 3, // Médio
      q4: 3, // Médio
      q5: 4,
      q6: 4,
      q7: 'Refeitório / Alimentação',
      q8: 'Aumentar insumos para aulas de laboratório.',
    },
  },

  // TAEs (Técnico-Administrativos)
  {
    id: 'resp-111',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'José Wellington Martins',
    respondentEmail: 'wellington.martins@ifce.edu.br',
    segment: 'taes',
    campus: 'Campus Tauá',
    date: '21/06/2026',
    answers: {
      q1: 2, // Infraestrutura: Baixo (55% Baixo nos TAEs)
      q4: 2, // Capacitação: Baixo
      q5: 3, // Apoio Gestão: Médio
      q6: 2, // Biblioteca/Wi-Fi: Baixo
      q7: 'Salas de aula e climatização',
      q8: 'Necessidade urgente de manutenção nos condicionadores de ar dos setores administrativos.',
    },
  },
  {
    id: 'resp-112',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Claudia Maria Vasconcelos',
    respondentEmail: 'claudia.vasconcelos@ifce.edu.br',
    segment: 'taes',
    campus: 'Campus Tauá',
    date: '21/06/2026',
    answers: {
      q1: 1, // Baixo
      q4: 2, // Baixo
      q5: 2, // Baixo
      q6: 3, // Médio
      q7: 'Laboratórios de informática',
      q8: 'Substituição de mobiliário nos guichês de atendimento ao público.',
    },
  },
  {
    id: 'resp-113',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Raimundo Nonato Araujo',
    respondentEmail: 'raimundo.araujo@ifce.edu.br',
    segment: 'taes',
    campus: 'Campus Tauá',
    date: '22/06/2026',
    answers: {
      q1: 2, // Baixo
      q4: 3, // Médio
      q5: 3, // Médio
      q6: 2, // Baixo
      q7: 'Refeitório / Alimentação',
      q8: 'Melhorar ergonomia das estações de trabalho.',
    },
  },
  {
    id: 'resp-114',
    formId: 'form-cpa-taua-2025-1',
    respondentName: 'Sonia Maria Feitosa',
    respondentEmail: 'sonia.feitosa@ifce.edu.br',
    segment: 'taes',
    campus: 'Campus Tauá',
    date: '22/06/2026',
    answers: {
      q1: 4, // Alto
      q4: 4, // Alto
      q5: 4, // Alto
      q6: 4, // Alto
      q7: 'Quadra e espaço de convivência',
      q8: 'Bom ambiente de trabalho e cooperação entre equipes.',
    },
  },
];
