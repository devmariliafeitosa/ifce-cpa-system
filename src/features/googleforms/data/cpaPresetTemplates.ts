import { FormQuestionInput } from '../../../services/googleFormsService';

/* Templates pré-configurados de questionários CPA para publicação rápida.
 * Extraído de GoogleFormsManager.tsx. */

export const CPA_PRESET_TEMPLATES: {
  id: string;
  title: string;
  description: string;
  questions: FormQuestionInput[];
}[] = [
  {
    id: 'docente-taua',
    title: 'Avaliação Docente e Didático-Pedagógica 2025.1 - Campus Tauá',
    description:
      'Instrumento oficial da Comissão Própria de Avaliação (CPA) para avaliação do desempenho docente e metodologia pelas turmas do IFCE Campus Tauá.',
    questions: [
      {
        title: 'O(A) docente demonstra domínio do conteúdo e clareza nas explicações?',
        type: 'SCALE',
        required: true,
      },
      {
        title: 'O plano de ensino e critérios de avaliação foram apresentados no início do semestre?',
        type: 'RADIO',
        required: true,
        options: ['Sim, integralmente', 'Parcialmente', 'Não foram apresentados'],
      },
      {
        title: 'Pontualidade e assiduidade do(a) professor(a) ao longo das aulas:',
        type: 'SCALE',
        required: true,
      },
      {
        title: 'Comentários, elogios ou sugestões de melhoria pedagógica para a disciplina:',
        type: 'TEXT',
        required: false,
      },
    ],
  },
  {
    id: 'infra-taua',
    title: 'Avaliação da Infraestrutura e Biblioteca - IFCE Campus Tauá',
    description:
      'Pesquisa institucional de satisfação quanto aos laboratórios, salas de aula, conectividade Wi-Fi, acervo da biblioteca e refeitório do Campus Tauá.',
    questions: [
      {
        title: 'Qualidade do acervo e atendimento na Biblioteca do Campus Tauá:',
        type: 'SCALE',
        required: true,
      },
      {
        title: 'Condições dos laboratórios de informática e específicos para as aulas práticas:',
        type: 'SCALE',
        required: true,
      },
      {
        title: 'Quais setores necessitam de melhorias prioritárias no campus?',
        type: 'CHECKBOX',
        required: true,
        options: [
          'Wi-Fi / Conectividade',
          'Ar condicionado das salas',
          'Biblioteca e Espaço de Estudo',
          'Quadra poliesportiva',
          'Refeitório / Cantina',
        ],
      },
      {
        title: 'Sugestões de melhorias para a infraestrutura do campus:',
        type: 'TEXT',
        required: false,
      },
    ],
  },
  {
    id: 'satisfacao-discente',
    title: 'Pesquisa de Satisfação Discente e Atendimento TAE - Campus Tauá',
    description:
      'Avaliação dos serviços administrativos, secretaria acadêmica, assistência estudantil e apoio da equipe de TAEs aos alunos do IFCE Tauá.',
    questions: [
      {
        title: 'Atendimento e agilidade na Secretaria de Controle Acadêmico:',
        type: 'SCALE',
        required: true,
      },
      {
        title: 'Suporte prestado pela Assistência Estudantil e Serviço Social:',
        type: 'SCALE',
        required: true,
      },
      {
        title: 'Avaliação geral da comunicação institucional do Campus Tauá:',
        type: 'RADIO',
        required: true,
        options: ['Excelente', 'Boa', 'Regular', 'Insumiciente'],
      },
      {
        title: 'Deixe aqui sua opinião ou sugestão de melhoria:',
        type: 'TEXT',
        required: false,
      },
    ],
  },
];
