import type { SmartForm } from "../types";

export const INITIAL_SMART_FORMS: SmartForm[] =
  [
    {
      id: "form-cpa-taua-2025-1",

      title:
        "Avaliação Institucional Unificada 2025.1 - Campus Tauá",

      description:
        "Formulário único da CPA com direcionamento inteligente de perguntas por público-alvo (Alunos, Docentes e TAEs). Evita que participantes respondam itens fora do seu segmento.",

      campus: "Campus Tauá",

      status: "Ativa",

      createdAt: "15/05/2025",

      updatedAt: "28/07/2025",

      startDate: "2026-08-01",

      startTime: "08:00",

      endDate: "2026-12-31",

      endTime: "23:59",

      periodo:
        "01/08/2026 08:00 - 31/12/2026 23:59",

      lastSync: "28/07/2026 15:30",

      questions: [
        {
          id: "q1",

          title:
            "Como você avalia a infraestrutura física, limpeza e segurança geral do Campus Tauá?",

          type: "SCALE",

          required: true,

          category: "Infraestrutura",

          audiences: ["todos"],
        },

        {
          id: "q2",

          title:
            "Como você avalia o domínio de conteúdo, pontualidade e didática dos professores nas disciplinas ministradas?",

          type: "SCALE",

          required: true,

          category: "Ensino",

          audiences: ["alunos"],
        },

        {
          id: "q3",

          title:
            "Como você avalia a clareza dos critérios de avaliação e prazos divulgados pelos docentes?",

          type: "SCALE",

          required: true,

          category: "Ensino",

          audiences: ["alunos"],
        },

        {
          id: "q4",

          title:
            "Como você avalia os programas de capacitação docente/técnica e condições de trabalho oferecidos pelo IFCE?",

          type: "SCALE",

          required: true,

          category: "Gestão",

          audiences: [
            "docentes",
            "taes",
          ],
        },

        {
          id: "q5",

          title:
            "Como você avalia o apoio administrativo da Direção Geral e Chefias para o cumprimento das suas funções?",

          type: "SCALE",

          required: true,

          category: "Gestão",

          audiences: [
            "docentes",
            "taes",
          ],
        },

        {
          id: "q6",

          title:
            "Como você avalia o acervo da Biblioteca e a conectividade Wi-Fi disponível no campus?",

          type: "SCALE",

          required: true,

          category: "Biblioteca",

          audiences: ["todos"],
        },

        {
          id: "q7",

          title:
            "Quais setores necessitam de intervenção ou melhorias prioritárias no Campus Tauá?",

          type: "CHECKBOX",

          required: false,

          category: "Infraestrutura",

          options: [
            "Salas de aula e climatização",
            "Laboratórios de informática",
            "Biblioteca e salas de estudo",
            "Refeitório / Alimentação",
            "Quadra e espaço de convivência",
          ],

          audiences: ["todos"],
        },

        {
          id: "q8",

          title:
            "Como você avalia a transparência e divulgação das ações de melhoria promovidas pela CPA no campus?",

          type: "SCALE",

          required: true,

          category: "Comunicação",

          audiences: ["todos"],
        },
      ],

      responsesCount: {
        total: 1420,
        alunos: 1120,
        docentes: 180,
        taes: 120,
      },
    },

    {
      id: "form-infra-2025",

      title:
        "Pesquisa de Clima Organizacional e Gestão - Campus Tauá",

      description:
        "Instrumento focado no diagnóstico das rotinas operacionais, suporte administrativo e bem-estar dos servidores docentes e técnicos.",

      campus: "Campus Tauá",

      status: "Agendada",

      createdAt: "01/06/2025",

      startDate: "2026-09-15",

      startTime: "08:00",

      endDate: "2026-09-30",

      endTime: "23:59",

      periodo:
        "15/09/2026 08:00 - 30/09/2026 23:59",

      lastSync: "28/07/2026 14:15",

      questions: [
        {
          id: "q-cli-1",

          title:
            "Como você avalia a comunicação interna entre as coordenações e a comunidade do campus?",

          type: "SCALE",

          required: true,

          category: "Comunicação",

          audiences: ["todos"],
        },

        {
          id: "q-cli-2",

          title:
            "Como você avalia o suporte de TI, equipamentos de trabalho e insumos fornecidos para suas atividades diárias?",

          type: "SCALE",

          required: true,

          category: "Tecnologia",

          audiences: [
            "docentes",
            "taes",
          ],
        },

        {
          id: "q-cli-3",

          title:
            "Como você avalia o clima de colaboração e respeito mútuo entre os setores do campus?",

          type: "SCALE",

          required: true,

          category: "Gestão",

          audiences: ["todos"],
        },
      ],

      responsesCount: {
        total: 310,
        alunos: 0,
        docentes: 190,
        taes: 120,
      },
    },

    {
      id: "form-egressos-2025",

      title:
        "Pesquisa de Acompanhamento Discente e Egressos",

      description:
        "Avaliação da satisfação discente quanto ao impacto do curso na formação profissional e inserção no mercado de trabalho.",

      campus: "Campus Tauá",

      status: "Rascunho",

      createdAt: "10/07/2025",

      periodo:
        "10/07/2025 - 30/09/2025",

      lastSync: "28/07/2026 10:00",

      questions: [
        {
          id: "q-eg-1",

          title:
            "O curso atendeu às suas expectativas de qualificação profissional?",

          type: "RADIO",

          required: true,

          category: "Ensino",

          options: [
            "Superou as expectativas",
            "Atendeu plenamente",
            "Atendeu parcialmente",
            "Não atendeu",
          ],

          audiences: ["alunos"],
        },
      ],

      responsesCount: {
        total: 0,
        alunos: 0,
        docentes: 0,
        taes: 0,
      },
    },
  ];