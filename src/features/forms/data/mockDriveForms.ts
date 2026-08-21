import { SmartQuestion } from '../../../types';

// Dados simulados de formulários "legados" disponíveis para importação do Google Drive.
// Extraído de FormsManagerView.tsx.

export interface DriveFormMock {
  id: string;
  name: string;
  description: string;
  modifiedTime: string;
  questionsCount: number;
  questions: SmartQuestion[];
}

export const MOCK_DRIVE_FORMS: DriveFormMock[] = [
  {
    id: 'gform-drive-1',
    name: 'Avaliação Institucional Geral 2023.2 (Google Forms - Antigo)',
    description: 'Questionário unificado antigo do Google Forms com perguntas misturadas de infraestrutura, ensino, biblioteca e PDI sem categorização por segmento.',
    modifiedTime: '10/11/2023 14:20',
    questionsCount: 7,
    questions: [
      {
        id: 'q-imp-1',
        title: 'Como você avalia os laboratórios de informática, redes e apoio didático do Campus Tauá?',
        description: 'Avalie a quantidade de equipamentos, estado de conservação e suporte técnico.',
        type: 'SCALE',
        required: true,
        category: 'Infraestrutura',
        audiences: ['todos'],
      },
      {
        id: 'q-imp-2',
        title: 'Você participou das reuniões de elaboração do Plano de Desenvolvimento Institucional (PDI)?',
        description: 'Indique o seu nível de engajamento no planejamento estratégico do IFCE.',
        type: 'RADIO',
        required: true,
        category: 'Planejamento Institucional',
        options: ['Sim, ativamente', 'Tenho conhecimento, mas não participei', 'Não soube das reuniões de elaboração'],
        audiences: ['todos'],
      },
      {
        id: 'q-imp-3',
        title: 'Como você avalia a didática, clareza e cumprimento dos planos de aula pelos professores?',
        description: 'Avaliação do processo de ensino-aprendizagem e atuação docente.',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: ['todos'],
      },
      {
        id: 'q-imp-4',
        title: 'Quais serviços da Biblioteca do IFCE você costuma utilizar com maior frequência?',
        description: 'Assinale todas as opções aplicáveis.',
        type: 'CHECKBOX',
        required: false,
        category: 'Biblioteca',
        options: [
          'Acervo Físico / Empréstimo de Livros',
          'Biblioteca Virtual (Pearson / Minha Biblioteca)',
          'Salas de Estudo Individual e em Grupo',
          'Computadores de Pesquisa da Biblioteca',
        ],
        audiences: ['todos'],
      },
      {
        id: 'q-imp-5',
        title: 'Como você avalia o suporte tecnológico, SUAP, e-mail institucional e conectividade Wi-Fi?',
        type: 'SCALE',
        required: true,
        category: 'Tecnologia',
        audiences: ['todos'],
      },
      {
        id: 'q-imp-6',
        title: 'Como você avalia os programas de assistência estudantil, bolsas e refeitório do campus?',
        type: 'SCALE',
        required: true,
        category: 'Assistência Estudantil',
        audiences: ['todos'],
      },
      {
        id: 'q-imp-7',
        title: 'Como você avalia os canais de atendimento e escuta da gestão do Campus Tauá?',
        type: 'SCALE',
        required: true,
        category: 'Gestão',
        audiences: ['todos'],
      },
    ],
  },
  {
    id: 'gform-drive-2',
    name: 'Pesquisa de Satisfação de Infraestrutura e TI (Google Forms)',
    description: 'Levantamento realizado com servidores e alunos sobre equipamentos, salas de aula e ambiente físico.',
    modifiedTime: '05/04/2024 10:15',
    questionsCount: 5,
    questions: [
      {
        id: 'q-imp-201',
        title: 'Como você avalia a conservação, iluminação e climatização das salas de aula do campus?',
        type: 'SCALE',
        required: true,
        category: 'Infraestrutura',
        audiences: ['todos'],
      },
      {
        id: 'q-imp-202',
        title: 'Qual o seu grau de satisfação com a velocidade e estabilidade da rede Wi-Fi acadêmica?',
        type: 'SCALE',
        required: true,
        category: 'Tecnologia',
        audiences: ['todos'],
      },
      {
        id: 'q-imp-203',
        title: 'Com qual frequência você encontra insumos e condições adequadas de higiene nos sanitários?',
        type: 'DROPDOWN',
        required: true,
        category: 'Infraestrutura',
        options: ['Sempre', 'Na maioria das vezes', 'Raramente', 'Nunca'],
        audiences: ['todos'],
      },
      {
        id: 'q-imp-204',
        title: 'Os equipamentos de TI e microcomputadores atendem às demandas administrativas e pedagógicas?',
        type: 'RADIO',
        required: true,
        category: 'Tecnologia',
        options: ['Atende plenamente', 'Atende parcialmente', 'Não atende às necessidades'],
        audiences: ['todos'],
      },
      {
        id: 'q-imp-205',
        title: 'Quais setores do campus necessitam de melhorias de infraestrutura com maior urgência?',
        type: 'CHECKBOX',
        required: false,
        category: 'Infraestrutura',
        options: ['Salas de aula', 'Laboratórios', 'Sanitários', 'Refeitório', 'Biblioteca'],
        audiences: ['todos'],
      },
    ],
  },
  {
    id: 'gform-drive-3',
    name: 'Questionário de Pesquisa, Extensão e Captação 2024 (Google Forms)',
    description: 'Diagnóstico sobre editais de bolsas de iniciação científica, projetos de extensão e capacitação.',
    modifiedTime: '12/09/2024 16:45',
    questionsCount: 4,
    questions: [
      {
        id: 'q-imp-301',
        title: 'Como você avalia a divulgação e clareza dos editais de bolsas PIBIC e PIBEX no campus?',
        type: 'SCALE',
        required: true,
        category: 'Pesquisa',
        audiences: ['todos'],
      },
      {
        id: 'q-imp-302',
        title: 'Você participou de algum projeto de pesquisa aplicada ou extensão no último ano letivo?',
        type: 'RADIO',
        required: true,
        category: 'Extensão',
        options: ['Sim, como bolsista', 'Sim, como voluntário', 'Não participei'],
        audiences: ['todos'],
      },
      {
        id: 'q-imp-303',
        title: 'Como você avalia o apoio da gestão aos servidores para participação em eventos científicos e capacitações?',
        type: 'SCALE',
        required: true,
        category: 'Gestão',
        audiences: ['todos'],
      },
      {
        id: 'q-imp-304',
        title: 'Como você avalia o impacto dos projetos de extensão para a comunidade externa regional?',
        type: 'SCALE',
        required: true,
        category: 'Extensão',
        audiences: ['todos'],
      },
    ],
  },
];

