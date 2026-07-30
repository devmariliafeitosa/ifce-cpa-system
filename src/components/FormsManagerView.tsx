import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileSpreadsheet,
  CheckSquare,
  Users,
  GraduationCap,
  UserCheck,
  Briefcase,
  Eye,
  Edit3,
  Trash2,
  BarChart2,
  Send,
  Sparkles,
  Clock,
  ArrowRight,
  Filter,
  Search,
  ListFilter,
  CheckCircle2,
  HelpCircle,
  X,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Layers,
  Sparkle,
  MoreVertical,
  MoreHorizontal,
  Table,
  Grid,
  Calendar,
  BookOpen,
  Building2,
  FlaskConical,
  PlusCircle,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Tag,
  Mail,
  Link2,
  ShieldCheck,
  Info,
  Settings,
  Save,
  FileText,
  Globe,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import { SmartForm, SmartQuestion, TargetAudience, FormSubmission, QuestionCategory, Campaign } from '../types';
import { INITIAL_SMART_FORMS } from '../data/formsData';
import { createGoogleForm, listGoogleForms, getGoogleFormDetails, GoogleFormFile } from '../services/googleFormsService';
import { getAccessToken, googleSignIn } from '../lib/googleAuth';

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

interface FormsManagerViewProps {
  onReturnToDashboard?: () => void;
  onSelectTab?: (tab: string) => void;
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  'Planejamento Institucional',
  'Ensino',
  'Pesquisa',
  'Extensão',
  'Infraestrutura',
  'Biblioteca',
  'Tecnologia',
  'Comunicação',
  'Assistência Estudantil',
  'Gestão',
  'Sustentabilidade',
  'Outros',
];

export interface CPATemplateItem {
  id: string;
  title: string;
  categoryTag: string;
  badge: string;
  description: string;
  defaultCategory: QuestionCategory;
  questions: SmartQuestion[];
}

export const CPA_TEMPLATES_DATA: CPATemplateItem[] = [
  {
    id: 'tpl-docente',
    title: 'Avaliação Docente',
    categoryTag: 'Ensino',
    badge: 'Modelo Oficial CPA • Didática e Metodologia',
    description: 'Avaliação da atuação dos professores, didática, cumprimento dos planos de aula, pontualidade e clareza dos critérios de avaliação.',
    defaultCategory: 'Ensino',
    questions: [
      {
        id: 'q-doc-1',
        title: 'O professor demonstra clareza e domínio do conteúdo ministrado nas aulas?',
        description: 'Avalie a didática, clareza expositiva e conhecimento técnico do docente.',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: ['alunos'],
      },
      {
        id: 'q-doc-2',
        title: 'O plano de ensino e cronograma da disciplina foram cumpridos conforme apresentado?',
        description: 'Considere o cumprimento dos tópicos da ementa e prazos informados.',
        type: 'RADIO',
        required: true,
        category: 'Ensino',
        options: ['Sim, integralmente', 'Parcialmente', 'Não foi cumprido'],
        audiences: ['alunos'],
      },
      {
        id: 'q-doc-3',
        title: 'Os critérios de avaliação adotados foram claros e condizentes com o conteúdo?',
        description: 'Avalie a transparência e pontualidade na divulgação das notas.',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: ['alunos'],
      },
      {
        id: 'q-doc-4',
        title: 'O professor demonstrou receptividade para tirar dúvidas e atendimento aos estudantes?',
        description: 'Avalie a disponibilidade do docente para apoio extracurricular.',
        type: 'YES_NO',
        required: true,
        category: 'Ensino',
        options: ['Sim', 'Não'],
        audiences: ['alunos'],
      },
    ],
  },
  {
    id: 'tpl-discente',
    title: 'Avaliação Discente',
    categoryTag: 'Ensino / Autoavaliação',
    badge: 'Modelo Oficial CPA • Compromisso e Estudos',
    description: 'Autoavaliação do engajamento do estudante, frequência, rotina de estudos extraclasse e aproveitamento dos recursos institucionais.',
    defaultCategory: 'Ensino',
    questions: [
      {
        id: 'q-dis-1',
        title: 'Como você avalia sua assiduidade, pontualidade e participação nas aulas do curso?',
        description: 'Autoavaliação da sua presença e dedicação ao aprendizado.',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: ['alunos'],
      },
      {
        id: 'q-dis-2',
        title: 'Quantas horas semanais você dedica aos estudos extraclasse?',
        description: 'Horas investidas em leitura, pesquisas e trabalhos fora da sala de aula.',
        type: 'DROPDOWN',
        required: true,
        category: 'Ensino',
        options: ['Menos de 2 horas', 'De 2 a 5 horas', 'De 5 a 10 horas', 'Mais de 10 horas'],
        audiences: ['alunos'],
      },
      {
        id: 'q-dis-3',
        title: 'Quais recursos do IFCE você utiliza com maior frequência para apoiar seus estudos?',
        description: 'Selecione todas as opções que se aplicam ao seu cotidiano.',
        type: 'CHECKBOX',
        required: false,
        category: 'Tecnologia',
        options: [
          'Biblioteca Física do Campus',
          'Biblioteca Virtual IFCE (Pearson/Minha Biblioteca)',
          'Ambiente Virtual Moodle / SUAP',
          'Salas de Estudo em Grupo',
        ],
        audiences: ['alunos'],
      },
      {
        id: 'q-dis-4',
        title: 'A infraestrutura do campus atende às necessidades para o seu rendimento acadêmico?',
        description: 'Suas respostas orientarão ações pedagógicas e de assistência estudantil.',
        type: 'RADIO',
        required: true,
        category: 'Assistência Estudantil',
        options: ['Atende plenamente', 'Atende parcialmente', 'Não atende'],
        audiences: ['alunos'],
      },
    ],
  },
  {
    id: 'tpl-taes',
    title: 'Avaliação TAEs',
    categoryTag: 'Gestão & Servidores',
    badge: 'Modelo Oficial CPA • Processos e Suporte',
    description: 'Avaliação do ambiente de trabalho, processos administrativos, infraestrutura de TI e qualificação profissional dos servidores TAEs.',
    defaultCategory: 'Gestão',
    questions: [
      {
        id: 'q-tae-1',
        title: 'Como você avalia o suporte tecnológico, sistemas institucionais e equipamentos dos setores?',
        description: 'Avalie o SUAP, e-mail e computadores colocados à disposição.',
        type: 'SCALE',
        required: true,
        category: 'Tecnologia',
        audiences: ['taes', 'docentes'],
      },
      {
        id: 'q-tae-2',
        title: 'Como você avalia o ambiente de trabalho e o relacionamento interpessoal no seu setor?',
        description: 'Integração, respeito e clima organizacional entre colegas e gestão.',
        type: 'SCALE',
        required: true,
        category: 'Gestão',
        audiences: ['taes'],
      },
      {
        id: 'q-tae-3',
        title: 'Quais temas de capacitação profissional são prioritários para a sua rotina de trabalho?',
        description: 'Demandas para o Plano de Capacitação dos Servidores.',
        type: 'CHECKBOX',
        required: false,
        category: 'Gestão',
        options: [
          'Processos no SUAP e Redação Oficial',
          'Atendimento Inclusivo e Acessibilidade',
          'Saúde Ocupacional e Qualidade de Vida',
          'Ferramentas de Tecnologia e Automação',
        ],
        audiences: ['taes'],
      },
      {
        id: 'q-tae-4',
        title: 'Como você avalia a padronização e clareza dos processos administrativos do campus?',
        description: 'Avaliação da rotina e suporte das chefias.',
        type: 'SCALE',
        required: true,
        category: 'Gestão',
        audiences: ['taes'],
      },
    ],
  },
  {
    id: 'tpl-infra',
    title: 'Infraestrutura',
    categoryTag: 'Infraestrutura Física',
    badge: 'Modelo Oficial CPA • Instalações Físicas',
    description: 'Avaliação das salas de aula, laboratórios, sanitários, climatização, limpeza, acessibilidade e espaços de convivência.',
    defaultCategory: 'Infraestrutura',
    questions: [
      {
        id: 'q-inf-1',
        title: 'Como você avalia a estrutura das salas de aula (climatização, iluminação e mobiliário)?',
        description: 'Avalie o conforto e a manutenção das instalações de ensino.',
        type: 'SCALE',
        required: true,
        category: 'Infraestrutura',
        audiences: ['todos'],
      },
      {
        id: 'q-inf-2',
        title: 'Como você avalia a limpeza e conservação dos banheiros e espaços comuns do campus?',
        description: 'Higiene, reposição de insumos e conservação predial.',
        type: 'SCALE',
        required: true,
        category: 'Infraestrutura',
        audiences: ['todos'],
      },
      {
        id: 'q-inf-3',
        title: 'Como você avalia as condições de acessibilidade para pessoas com deficiência no campus?',
        description: 'Rampas, sinalização tátil e sanitários adaptados.',
        type: 'SCALE',
        required: true,
        category: 'Infraestrutura',
        audiences: ['todos'],
      },
      {
        id: 'q-inf-4',
        title: 'Em quais setores do campus você percebe maior necessidade de melhorias de infraestrutura?',
        description: 'Marque todos os locais que necessitam de intervenção prioritária.',
        type: 'CHECKBOX',
        required: false,
        category: 'Infraestrutura',
        options: [
          'Laboratórios de Informática',
          'Laboratórios Específicos/Técnicos',
          'Refeitório / Cantina',
          'Áreas de Convivência e Lazer',
          'Quadra e Espaço Esportivo',
        ],
        audiences: ['todos'],
      },
    ],
  },
  {
    id: 'tpl-biblioteca',
    title: 'Biblioteca',
    categoryTag: 'Biblioteca & Acervo',
    badge: 'Modelo Oficial CPA • Recursos de Informação',
    description: 'Avaliação do acervo físico e digital, qualidade do atendimento da equipe, espaço de estudos e facilidades de empréstimo.',
    defaultCategory: 'Biblioteca',
    questions: [
      {
        id: 'q-bib-1',
        title: 'Como você avalia a qualidade e presteza do atendimento prestado pela equipe da Biblioteca?',
        description: 'Atenção, orientação na pesquisa e auxílio com empréstimos.',
        type: 'SCALE',
        required: true,
        category: 'Biblioteca',
        audiences: ['todos'],
      },
      {
        id: 'q-bib-2',
        title: 'O acervo físico e as plataformas digitais atendem às necessidades das suas disciplinas?',
        description: 'Disponibilidade de títulos das bibliografias básica e complementar.',
        type: 'SCALE',
        required: true,
        category: 'Biblioteca',
        audiences: ['todos'],
      },
      {
        id: 'q-bib-3',
        title: 'Com qual frequência você utiliza o espaço físico ou virtual da Biblioteca do campus?',
        description: 'Frequência de utilização dos serviços de leitura e estudo.',
        type: 'DROPDOWN',
        required: true,
        category: 'Biblioteca',
        options: ['Diariamente', 'Semanalmente', 'Quinzenalmente / Mensalmente', 'Raramente ou Nunca'],
        audiences: ['todos'],
      },
      {
        id: 'q-bib-4',
        title: 'Como você avalia a atualização do acervo e espaço físico da Biblioteca do campus?',
        description: 'Avaliação da relevância do acervo e conforto das instalações.',
        type: 'SCALE',
        required: true,
        category: 'Biblioteca',
        audiences: ['todos'],
      },
    ],
  },
  {
    id: 'tpl-pesquisa',
    title: 'Pesquisa Institucional',
    categoryTag: 'Pesquisa & Inovação',
    badge: 'Modelo Oficial CPA • Ciência e Tecnologia',
    description: 'Diagnóstico das políticas de fomento à pesquisa, edital de bolsas PIBIC/PIBITI, laboratórios de pesquisa e publicações.',
    defaultCategory: 'Pesquisa',
    questions: [
      {
        id: 'q-pes-1',
        title: 'Como você avalia os editais institucionais de concessão de bolsas de Iniciação Científica?',
        description: 'Clareza dos editais, prazos e transparência nas seleções.',
        type: 'SCALE',
        required: true,
        category: 'Pesquisa',
        audiences: ['docentes', 'alunos'],
      },
      {
        id: 'q-pes-2',
        title: 'Os laboratórios de pesquisa contam com insumos e equipamentos adequados para os projetos?',
        description: 'Condições materiais para desenvolvimento dos projetos científicos.',
        type: 'SCALE',
        required: true,
        category: 'Pesquisa',
        audiences: ['docentes'],
      },
      {
        id: 'q-pes-3',
        title: 'Em quais linhas ou modalidades de pesquisa você atua atualmente no IFCE?',
        description: 'Áreas de atuação em inovação e produção científica.',
        type: 'CHECKBOX',
        required: false,
        category: 'Pesquisa',
        options: [
          'Iniciação Científica Júnior / Graduação',
          'Pesquisa Aplicada e Desenvolvimento Tecnológico',
          'Inovação e Parcerias com Empresas',
          'Patentes e Propriedade Intelectual',
        ],
        audiences: ['docentes', 'alunos'],
      },
      {
        id: 'q-pes-4',
        title: 'Como você avalia os incentivos e fomento do campus para publicação e difusão científica?',
        description: 'Apoio institucional para participação em congressos e periódicos.',
        type: 'SCALE',
        required: true,
        category: 'Pesquisa',
        audiences: ['docentes', 'alunos'],
      },
    ],
  },
];

export const IFCE_CAMPUSES = [
  'IFCE Campus Tauá',
  'IFCE Campus Fortaleza',
  'IFCE Campus Juazeiro do Norte',
  'IFCE Campus Sobral',
  'IFCE Campus Crato',
  'IFCE Campus Iguatu',
  'IFCE Campus Cedro',
  'IFCE Campus Maracanaú',
  'IFCE Campus Quixadá',
  'IFCE Campus Canindé',
  'IFCE Campus Crateús',
  'IFCE Campus Limoeiro do Norte',
  'IFCE Campus Tianguá',
  'IFCE Campus Baturité',
  'IFCE Campus Caucaia',
  'IFCE Campus Aracati',
  'Todos os Campi do IFCE',
];

export const WIZARD_STEPS = [
  { id: 1, label: 'Informações', icon: Info },
  { id: 2, label: 'Perguntas Gerais', icon: HelpCircle },
  { id: 3, label: 'Escolha de Segmento', icon: Users },
  { id: 4, label: 'Perguntas do Segmento', icon: CheckSquare },
  { id: 5, label: 'Revisão e Finalização', icon: CheckCircle2 },
];

/* Componente de Menu de Ações Contextual Inteligente (Drop-up / Drop-down) */
interface FormRowActionButtonProps {
  form: SmartForm;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  handleStartResponding: (form: SmartForm) => void;
  handleOpenGoogleFormsLink: (form: SmartForm) => void;
  setViewingMetricsForm: (form: SmartForm) => void;
  handleOpenEditModal: (form: SmartForm) => void;
  handleDuplicateForm: (form: SmartForm) => void;
  handleSendCampaign: (form: SmartForm) => void;
  handleToggleCampaignStatus: (form: SmartForm) => void;
  setDeletingForm: (form: SmartForm) => void;
}

export const FormRowActionButton: React.FC<FormRowActionButtonProps> = ({
  form,
  isOpen,
  onToggle,
  onClose,
  handleStartResponding,
  handleOpenGoogleFormsLink,
  setViewingMetricsForm,
  handleOpenEditModal,
  handleDuplicateForm,
  handleSendCampaign,
  handleToggleCampaignStatus,
  setDeletingForm,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    right: number;
    openUp: boolean;
    maxHeight: number;
  }>({
    right: 16,
    openUp: false,
    maxHeight: 380,
  });

  const calculatePosition = React.useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Altura estimada do menu contextual completo ~320px
    const menuHeightEstimate = 320;
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;

    // Abre para cima (drop-up) se o espaço abaixo for insuficiente e o espaço acima for maior
    const shouldOpenUp = spaceBelow < menuHeightEstimate && spaceAbove > spaceBelow;

    // Alinha a borda direita do menu com a borda direita do botão de 3 pontos
    const rightOffset = Math.max(12, vw - rect.right);

    if (shouldOpenUp) {
      const bottomPos = Math.max(12, vh - rect.top + 8);
      const availHeight = Math.min(spaceAbove - 16, 450);
      setCoords({
        bottom: bottomPos,
        right: rightOffset,
        openUp: true,
        maxHeight: Math.max(220, availHeight),
      });
    } else {
      const topPos = Math.min(vh - 220, rect.bottom + 8);
      const availHeight = Math.min(spaceBelow - 16, 450);
      setCoords({
        top: topPos,
        right: rightOffset,
        openUp: false,
        maxHeight: Math.max(220, availHeight),
      });
    }
  }, []);

  React.useLayoutEffect(() => {
    if (!isOpen) return;
    calculatePosition();

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, calculatePosition]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border transition-all cursor-pointer ${
          isOpen
            ? 'bg-slate-200 text-slate-900 border-slate-300 shadow-xs'
            : 'bg-slate-50 border-slate-200'
        }`}
        title="Mais Opções"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay transparente para fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-[9980]"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />

          {/* Menu Dropdown / Dropup flutuante inteligente */}
          <div
            style={{
              position: 'fixed',
              top: coords.openUp ? 'auto' : `${coords.top}px`,
              bottom: coords.openUp ? `${coords.bottom}px` : 'auto',
              right: `${coords.right}px`,
              maxHeight: `${coords.maxHeight}px`,
            }}
            className={`z-[9999] w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 overflow-y-auto text-left flex flex-col space-y-1 ${
              coords.openUp
                ? 'animate-in fade-in slide-in-from-bottom-2 duration-150'
                : 'animate-in fade-in slide-in-from-top-2 duration-150'
            }`}
          >
            {/* GRUPO 1: VISUALIZAÇÃO */}
            <div className="px-2.5 pt-1.5 pb-0.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Visualização
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleStartResponding(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#006837]" />
              <span>Visualizar / Responder</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleOpenGoogleFormsLink(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Abrir no Google Forms</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                setViewingMetricsForm(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-purple-600" />
              <span>Ver Respostas</span>
            </button>

            <div className="border-t border-slate-100 my-1" />

            {/* GRUPO 2: EDIÇÃO */}
            <div className="px-2.5 pt-1.5 pb-0.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Edição
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleOpenEditModal(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span>Editar Estrutura</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleDuplicateForm(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4 text-indigo-600" />
              <span>Duplicar Formulário</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleSendCampaign(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-600" />
              <span>Enviar Campanha</span>
            </button>

            <div className="border-t border-slate-100 my-1" />

            {/* GRUPO 3: GERENCIAMENTO */}
            <div className="px-2.5 pt-1.5 pb-0.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Gerenciamento
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleToggleCampaignStatus(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              {form.status === 'Ativo' ? (
                <>
                  <PauseCircle className="w-4 h-4 text-orange-600" />
                  <span>Encerrar Campanha</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 text-emerald-600" />
                  <span>Reativar Campanha</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                setDeletingForm(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Excluir Formulário</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* Componente de Wizard Modal do Envio de Campanha (5 Etapas) */
interface SendCampaignWizardModalProps {
  form: SmartForm;
  onClose: () => void;
  onLaunchCampaign: (campaign: Campaign) => void;
  onSaveProgressDraft?: (campaign: Campaign) => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const SendCampaignWizardModal: React.FC<SendCampaignWizardModalProps> = ({
  form,
  onClose,
  onLaunchCampaign,
  onSaveProgressDraft,
  showNotification,
}) => {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState(
    `Campanha de Avaliação Institucional 2026.2 - ${form.title}`
  );
  const [campus, setCampus] = useState(form.campus || 'Campus Tauá');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  });

  const [segments, setSegments] = useState<{
    discentes: boolean;
    docentes: boolean;
    taes: boolean;
  }>({
    discentes: true,
    docentes: true,
    taes: true,
  });

  const DEFAULT_MESSAGE = `Prezado(a) {{Nome}},\n\nA Comissão Própria de Avaliação (CPA) do IFCE convida você a responder à "{{Título}}" do {{Campus}}.\n\nSua opinião é fundamental para orientar as melhorias no ensino, na infraestrutura e na gestão da nossa instituição.\n\nPrazo de preenchimento: até {{Prazo}}.\n\nAtenciosamente,\nCoordenação da CPA - IFCE.`;

  const [customMessage, setCustomMessage] = useState(DEFAULT_MESSAGE);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Participant estimated count calculation
  const countDiscentes = segments.discentes ? 1250 : 0;
  const countDocentes = segments.docentes ? 84 : 0;
  const countTAEs = segments.taes ? 56 : 0;
  const totalRecipients = countDiscentes + countDocentes + countTAEs;

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handleInsertVariable = (variableTag: string) => {
    setCustomMessage((prev) => prev + ` ${variableTag}`);
  };

  const handleRestoreDefaultMessage = () => {
    setCustomMessage(DEFAULT_MESSAGE);
    showNotification('info', 'Modelo de e-mail padrão restaurado.');
  };

  const handleSaveProgress = () => {
    const draftCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      formId: form.id,
      formTitle: form.title,
      title: title.trim() || `Rascunho de Campanha - ${form.title}`,
      campus,
      segment:
        segments.discentes && segments.docentes && segments.taes
          ? 'todos'
          : segments.discentes
          ? 'alunos'
          : segments.docentes
          ? 'docentes'
          : 'taes',
      startDate: formatDateBR(startDate),
      endDate: formatDateBR(endDate),
      customMessage,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'Rascunho',
      sentEmailsCount: totalRecipients,
      uniqueTokenUrl: `https://cpa.ifce.edu.br/avaliacao/${form.id}?token=draft-${Date.now()}`,
    };

    if (onSaveProgressDraft) {
      onSaveProgressDraft(draftCampaign);
    }
    showNotification('success', 'Progresso da campanha salvo como rascunho com sucesso!');
  };

  const handleFinalSubmit = () => {
    if (!title.trim()) {
      showNotification('error', 'Por favor, informe o título da campanha.');
      setStep(1);
      setShowConfirmModal(false);
      return;
    }

    if (!segments.discentes && !segments.docentes && !segments.taes) {
      showNotification('error', 'Selecione pelo menos um segmento de destinatários.');
      setStep(2);
      setShowConfirmModal(false);
      return;
    }

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      formId: form.id,
      formTitle: form.title,
      title,
      campus,
      segment:
        segments.discentes && segments.docentes && segments.taes
          ? 'todos'
          : segments.discentes
          ? 'alunos'
          : segments.docentes
          ? 'docentes'
          : 'taes',
      startDate: formatDateBR(startDate),
      endDate: formatDateBR(endDate),
      customMessage,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativa',
      sentEmailsCount: totalRecipients,
      uniqueTokenUrl: `https://cpa.ifce.edu.br/avaliacao/${form.id}?token=suap-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
    };

    onLaunchCampaign(newCampaign);
    setShowConfirmModal(false);
    onClose();
  };

  const formatPreviewText = (text: string) => {
    return text
      .replaceAll('{{Nome}}', 'João Silva')
      .replaceAll('{{Campus}}', campus)
      .replaceAll('{{Título}}', form.title)
      .replaceAll('{{Prazo}}', formatDateBR(endDate))
      .replaceAll('{{Link}}', 'https://cpa.ifce.edu.br/avaliacao/token-suap-883921');
  };

  const STEPS = [
    { id: 1, label: 'Campanha', icon: Calendar },
    { id: 2, label: 'Destinatários', icon: Users },
    { id: 3, label: 'Mensagem', icon: Mail },
    { id: 4, label: 'Pré-visualização', icon: Eye },
    { id: 5, label: 'Enviar', icon: Send },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-[850px] w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 my-auto overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-white space-y-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-[#006837]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Enviar Formulário / Campanha
                </h3>
                <p className="text-xs text-slate-500">
                  Assistente de configuração de convocação de participantes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006837] text-xs font-bold truncate max-w-[260px]">
                Formulário: {form.title}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="pt-1">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {STEPS.map((s) => {
                const IconComp = s.icon;
                const isCurrent = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`py-2 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#006837] text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50 text-[#006837] border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <IconComp className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="hidden md:inline truncate">{s.label}</span>
                    <span className="md:hidden">{s.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#006837] transition-all duration-300 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Body (Scrollable if needed) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Campanha */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-[#006837]" />
                <span>Etapa 1 — Informações da Campanha</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">
                    Título da Campanha <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex: Campanha de Avaliação Institucional 2026.2 - Campus Tauá"
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837] font-medium"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Campus</label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Campus Tauá">Campus Tauá</option>
                    <option value="Campus Crateús">Campus Crateús</option>
                    <option value="Campus Canindé">Campus Canindé</option>
                    <option value="Campus Cedro">Campus Cedro</option>
                    <option value="Campus Fortaleza">Campus Fortaleza</option>
                    <option value="Campus Iguatu">Campus Iguatu</option>
                    <option value="Campus Juazeiro do Norte">Campus Juazeiro do Norte</option>
                    <option value="Campus Limoeiro do Norte">Campus Limoeiro do Norte</option>
                    <option value="Campus Sobral">Campus Sobral</option>
                    <option value="Todos os Campi do IFCE">Todos os Campi do IFCE</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Data Inicial</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Data Final</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Destinatários */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#006837]" />
                <span>Etapa 2 — Destinatários</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">
                    Campus Selecionado
                  </span>
                  <span className="font-bold text-slate-900">{campus}</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-[#006837] rounded-full font-bold text-[11px]">
                  Filtro Institucional SUAP
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Segmentos Convocados</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      segments.discentes
                        ? 'bg-emerald-50/80 border-[#006837] text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={segments.discentes}
                      onChange={(e) =>
                        setSegments({ ...segments, discentes: e.target.checked })
                      }
                      className="accent-[#006837] w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">Discentes</span>
                      <span className="text-[10px] text-slate-500">Alunos regularmente matriculados</span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      segments.docentes
                        ? 'bg-emerald-50/80 border-[#006837] text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={segments.docentes}
                      onChange={(e) =>
                        setSegments({ ...segments, docentes: e.target.checked })
                      }
                      className="accent-[#006837] w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">Docentes</span>
                      <span className="text-[10px] text-slate-500">Professores e corpo docente</span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      segments.taes
                        ? 'bg-emerald-50/80 border-[#006837] text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={segments.taes}
                      onChange={(e) => setSegments({ ...segments, taes: e.target.checked })}
                      className="accent-[#006837] w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">Técnicos Adm.</span>
                      <span className="text-[10px] text-slate-500">Servidores técnico-administrativos</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quantidade estimada de destinatários */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  Quantidade Estimada de Destinatários
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase block">Discentes</span>
                    <strong className="text-sm font-black text-indigo-950 block pt-0.5">
                      {countDiscentes.toLocaleString('pt-BR')} participantes
                    </strong>
                  </div>

                  <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">Docentes</span>
                    <strong className="text-sm font-black text-emerald-950 block pt-0.5">
                      {countDocentes.toLocaleString('pt-BR')} participantes
                    </strong>
                  </div>

                  <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-amber-700 uppercase block">TAEs</span>
                    <strong className="text-sm font-black text-amber-950 block pt-0.5">
                      {countTAEs.toLocaleString('pt-BR')} participantes
                    </strong>
                  </div>

                  <div className="p-3 bg-[#006837] text-white rounded-xl text-center shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-200 uppercase block">Total</span>
                    <strong className="text-sm font-black text-white block pt-0.5">
                      {totalRecipients.toLocaleString('pt-BR')} destinatários
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Mensagem */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <Mail className="w-4 h-4 text-[#006837]" />
                <span>Etapa 3 — Mensagem</span>
              </div>

              {/* Dynamic Variables Pills */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Variáveis Dinâmicas (Clique para inserir no texto):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tag: '{{Nome}}', label: 'Nome do Participante' },
                    { tag: '{{Campus}}', label: 'Campus' },
                    { tag: '{{Título}}', label: 'Título do Formulário' },
                    { tag: '{{Prazo}}', label: 'Prazo Final' },
                    { tag: '{{Link}}', label: 'Link do SUAP' },
                  ].map((v) => (
                    <button
                      type="button"
                      key={v.tag}
                      onClick={() => handleInsertVariable(v.tag)}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-[#006837] shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      title={v.label}
                    >
                      <span>{v.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Conteúdo do E-mail de Convocação
                </label>
                <textarea
                  rows={6}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Digite a mensagem que os participantes receberão no e-mail institucional..."
                  className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837] font-sans leading-relaxed text-slate-800"
                />
              </div>

              {/* Restore Default Template Button */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={handleRestoreDefaultMessage}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#006837]" />
                  <span>Restaurar modelo padrão</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Pré-visualização */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#006837]" />
                  <span>Etapa 4 — Pré-visualização</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Simulação exata de recebimento no e-mail
                </span>
              </div>

              {/* Clean White Email Card (Gmail/Outlook style) */}
              <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5 text-slate-800 text-xs sm:text-sm">
                  {/* Email Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#006837] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-xs shrink-0">
                        IFCE
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">CPA IFCE</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Avaliação Institucional</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#006837] border border-emerald-200">
                      E-mail Institucional
                    </span>
                  </div>

                  {/* Email Body */}
                  <div className="space-y-3.5 leading-relaxed text-slate-700">
                    <p className="font-bold text-slate-900 text-sm">Olá, João!</p>
                    <p className="text-slate-600">
                      Você foi convidado para participar da Avaliação Institucional do IFCE.
                    </p>
                    <p className="text-slate-700 font-medium whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs leading-relaxed">
                      {formatPreviewText(customMessage)}
                    </p>
                    <p className="text-xs text-slate-600 font-semibold">
                      Sua participação é muito importante.
                    </p>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                      <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#006837] shrink-0" />
                        <div className="text-[11px]">
                          <span className="text-slate-400 block font-medium">📅 Período</span>
                          <strong className="text-emerald-950 font-bold">
                            {formatDateBR(startDate)} até {formatDateBR(endDate)}
                          </strong>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="text-[11px]">
                          <span className="text-slate-400 block font-medium">🎓 Campus</span>
                          <strong className="text-blue-950 font-bold">{campus}</strong>
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600 shrink-0" />
                        <div className="text-[11px]">
                          <span className="text-slate-400 block font-medium">👥 Segmento</span>
                          <strong className="text-purple-950 font-bold">
                            {Object.entries(segments)
                              .filter(([_, active]) => active)
                              .map(([k]) => (k === 'discentes' ? 'Discente' : k === 'docentes' ? 'Docente' : 'TAE'))
                              .join(', ') || 'Nenhum'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2 text-center sm:text-left">
                      <span className="px-6 py-3 bg-[#006837] text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2">
                        <span>Responder Avaliação</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Email Footer */}
                  <div className="border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400 font-medium">
                    Caso tenha dúvidas entre em contato com a Coordenação da CPA.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Enviar (Confirmação) */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <Send className="w-4 h-4 text-[#006837]" />
                <span>Etapa 5 — Confirmação e Disparo</span>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Resumo Geral da Campanha
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Campanha
                    </span>
                    <strong className="text-slate-900 font-bold text-sm block leading-snug">
                      {title}
                    </strong>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Campus Alvo
                    </span>
                    <strong className="text-slate-900 font-bold text-sm block">
                      {campus}
                    </strong>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Segmentos Convocados
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {segments.discentes && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-bold">
                          Discentes
                        </span>
                      )}
                      {segments.docentes && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                          Docentes
                        </span>
                      )}
                      {segments.taes && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                          TAEs
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Quantidade de Destinatários
                    </span>
                    <strong className="text-[#006837] font-extrabold text-sm block">
                      {totalRecipients.toLocaleString('pt-BR')} destinatários
                    </strong>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Período de Realização
                    </span>
                    <strong className="text-slate-900 font-bold text-xs block">
                      {formatDateBR(startDate)} até {formatDateBR(endDate)}
                    </strong>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Quantidade de Perguntas
                    </span>
                    <strong className="text-slate-900 font-bold text-xs block">
                      {form.questions.length} perguntas vinculadas
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#006837] hover:bg-[#045C2D] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Convites</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Fixed at bottom) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSaveProgress}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4 text-[#006837]" />
            <span>Salvar progresso</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1 transition-all ${
                step === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-200 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Seguinte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Convites</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-emerald-100 text-[#006837] rounded-xl shrink-0">
                <Send className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Deseja realmente enviar esta campanha?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Após o envio, todos os participantes receberão um e-mail institucional com o link personalizado para responder à avaliação.
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FormsManagerView: React.FC<FormsManagerViewProps> = ({
  onReturnToDashboard,
  onSelectTab,
}) => {
  // Main Forms State
  const [forms, setForms] = useState<SmartForm[]>(() => {
    const saved = localStorage.getItem('cpa_smart_forms');
    return saved ? JSON.parse(saved) : INITIAL_SMART_FORMS;
  });

  useEffect(() => {
    localStorage.setItem('cpa_smart_forms', JSON.stringify(forms));
  }, [forms]);

  // Notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Ativo' | 'Rascunho' | 'Encerrado'>('todos');
  const [audienceFilter, setAudienceFilter] = useState<'todos' | 'alunos' | 'docentes' | 'taes'>('todos');
  const [campusFilter, setCampusFilter] = useState<string>('todos');
  const [periodFilter, setPeriodFilter] = useState<string>('todos');

  // Import Google Form Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSearchTerm, setImportSearchTerm] = useState('');
  const [isFetchingDriveForms, setIsFetchingDriveForms] = useState(false);
  const [googleDriveFiles, setGoogleDriveFiles] = useState<GoogleFormFile[]>([]);

  // Classificação das Perguntas Screen State
  const [classifyingForm, setClassifyingForm] = useState<SmartForm | null>(null);

  // Filters for Classification Screen
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [classCategoryFilter, setClassCategoryFilter] = useState<string>('todas');
  const [classAudienceFilter, setClassAudienceFilter] = useState<string>('todos');
  const [classRequiredFilter, setClassRequiredFilter] = useState<string>('todas');
  const [classTypeFilter, setClassTypeFilter] = useState<string>('todos');

  // "Visualizar como" Profile Preview Role ('none' | 'alunos' | 'docentes' | 'taes')
  const [previewRole, setPreviewRole] = useState<'none' | 'alunos' | 'docentes' | 'taes'>('none');

  // Fetch real Google Forms if connected
  const handleFetchDriveForms = async () => {
    setIsFetchingDriveForms(true);
    try {
      let token = getAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes?.accessToken || null;
      }
      if (token) {
        const files = await listGoogleForms(token);
        setGoogleDriveFiles(files);
        showNotification('success', `${files.length} formulários encontrados no seu Google Drive.`);
      }
    } catch (err: any) {
      console.warn('Google Drive integration notice:', err);
      showNotification('info', 'Exibindo formulários disponíveis no repositório Google Forms.');
    } finally {
      setIsFetchingDriveForms(false);
    }
  };

  // Import Selected Form Handler
  const handleImportForm = (mockItem: DriveFormMock) => {
    const newForm: SmartForm = {
      id: `form-imp-${Date.now()}`,
      title: `${mockItem.name} (Importado)`,
      description: mockItem.description,
      campus: 'Campus Tauá',
      status: 'Rascunho',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      periodo: '15/08/2026 - 30/12/2026',
      lastSync: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      googleFormId: mockItem.id,
      questions: mockItem.questions.map((q, idx) => ({
        ...q,
        id: `q-imp-${Date.now()}-${idx}`,
        category: q.category || 'Outros',
        audiences: q.audiences || ['todos'],
      })),
      responsesCount: { total: 0, alunos: 0, docentes: 0, taes: 0 },
    };

    setForms([newForm, ...forms]);
    setIsImportModalOpen(false);

    // Transition directly to Classification Screen!
    setClassifyingForm(newForm);
    setPreviewRole('none');
    showNotification(
      'success',
      `Formulário "${newForm.title}" importado com sucesso! Classifique as categorias e públicos das perguntas abaixo.`
    );
  };

  // Classification Screen Handlers
  const handleToggleAudienceInClassifying = (questionId: string, target: TargetAudience) => {
    if (!classifyingForm) return;

    const updatedQuestions = classifyingForm.questions.map((q) => {
      if (q.id !== questionId) return q;

      let newAudiences = [...q.audiences];

      if (target === 'todos') {
        if (newAudiences.includes('todos')) {
          newAudiences = ['alunos'];
        } else {
          newAudiences = ['todos'];
        }
      } else {
        if (newAudiences.includes('todos')) {
          newAudiences = newAudiences.filter((a) => a !== 'todos');
        }

        if (newAudiences.includes(target)) {
          newAudiences = newAudiences.filter((a) => a !== target);
          if (newAudiences.length === 0) newAudiences = ['todos'];
        } else {
          newAudiences.push(target);
        }
      }

      return { ...q, audiences: newAudiences };
    });

    setClassifyingForm({
      ...classifyingForm,
      questions: updatedQuestions,
    });
  };

  const handleUpdateCategoryInClassifying = (questionId: string, category: QuestionCategory) => {
    if (!classifyingForm) return;

    const updatedQuestions = classifyingForm.questions.map((q) => {
      if (q.id !== questionId) return q;
      return { ...q, category };
    });

    setClassifyingForm({
      ...classifyingForm,
      questions: updatedQuestions,
    });
  };

  const handleSaveClassification = () => {
    if (!classifyingForm) return;

    setForms((prevForms) =>
      prevForms.map((f) => (f.id === classifyingForm.id ? classifyingForm : f))
    );

    showNotification(
      'success',
      `Classificação das perguntas para "${classifyingForm.title}" salva com sucesso!`
    );
    setClassifyingForm(null);
    setPreviewRole('none');
  };

  // Question filtering logic for Classification screen
  const getFilteredQuestionsForClassification = (): SmartQuestion[] => {
    if (!classifyingForm) return [];

    return classifyingForm.questions.filter((q) => {
      // 1. Text search
      if (classSearchTerm.trim()) {
        const term = classSearchTerm.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(term);
        const matchesDesc = (q.description || '').toLowerCase().includes(term);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Category filter
      if (classCategoryFilter !== 'todas' && q.category !== classCategoryFilter) {
        return false;
      }

      // 3. Audience filter
      if (classAudienceFilter === 'todos_only') {
        if (!q.audiences.includes('todos')) return false;
      } else if (classAudienceFilter === 'alunos') {
        if (!q.audiences.includes('alunos')) return false;
      } else if (classAudienceFilter === 'docentes') {
        if (!q.audiences.includes('docentes')) return false;
      } else if (classAudienceFilter === 'taes') {
        if (!q.audiences.includes('taes')) return false;
      }

      // 4. Required filter
      if (classRequiredFilter === 'required' && !q.required) return false;
      if (classRequiredFilter === 'optional' && q.required) return false;

      // 5. Type filter
      if (classTypeFilter !== 'todos' && q.type !== classTypeFilter) return false;

      return true;
    });
  };

  // Wizard State (Steps 1 to 5)
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<SmartForm | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<'alunos' | 'docentes' | 'taes'>('alunos');
  const [completedSegments, setCompletedSegments] = useState<string[]>([]);
  const [publishStatus, setPublishStatus] = useState<'Ativo' | 'Rascunho'>('Ativo');

  // Form Builder Inputs
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCampus, setFormCampus] = useState('IFCE Campus Tauá');
  const [formPeriodo, setFormPeriodo] = useState('2026.2');
  const [formCategory, setFormCategory] = useState<string>('Autoavaliação Institucional');
  const [formStartDate, setFormStartDate] = useState('2026-08-15');
  const [formEndDate, setFormEndDate] = useState('2026-12-30');
  const [formAnonymous, setFormAnonymous] = useState(true);
  const [formAudiences, setFormAudiences] = useState<TargetAudience[]>(['alunos', 'docentes', 'taes']);
  const [formEixos, setFormEixos] = useState<string[]>([
    'Eixo 1: Planejamento e Avaliação',
    'Eixo 3: Políticas Acadêmicas',
    'Eixo 5: Infraestrutura Física',
  ]);
  const [formQuestions, setFormQuestions] = useState<SmartQuestion[]>([]);

  // Open Create Wizard
  const handleOpenCreateModal = () => {
    setEditingForm(null);
    setWizardStep(1);
    setFormTitle('');
    setFormDescription('');
    setFormCampus('IFCE Campus Tauá');
    setFormPeriodo('2026.2');
    setFormCategory('Autoavaliação Institucional');
    setFormStartDate('2026-08-15');
    setFormEndDate('2026-12-30');
    setFormAnonymous(true);
    setFormAudiences(['alunos', 'docentes', 'taes']);
    setSelectedSegment('alunos');
    setCompletedSegments([]);
    setPublishStatus('Ativo');
    setFormEixos([
      'Eixo 1: Planejamento e Avaliação',
      'Eixo 3: Políticas Acadêmicas',
      'Eixo 5: Infraestrutura Física',
    ]);
    setFormQuestions([
      {
        id: `q-${Date.now()}-1`,
        title: 'Como você avalia o apoio acadêmico e as instalações gerais do campus?',
        description: 'Estas perguntas serão exibidas para todos os participantes da avaliação.',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: ['todos'],
        options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
      },
    ]);
    setIsCreateModalOpen(true);
  };

  // Open Edit Wizard
  const handleOpenEditModal = (form: SmartForm) => {
    setEditingForm(form);
    setWizardStep(1);
    setFormTitle(form.title);
    setFormDescription(form.description);
    setFormCampus(form.campus || 'IFCE Campus Tauá');
    setFormPeriodo(form.periodo || '2026.2');
    setFormQuestions(form.questions || []);
    setPublishStatus(form.status === 'Ativo' ? 'Ativo' : 'Rascunho');
    setSelectedSegment('alunos');
    const existingSegs: string[] = [];
    if (form.questions?.some((q) => q.audiences.includes('alunos') && !q.audiences.includes('todos'))) existingSegs.push('alunos');
    if (form.questions?.some((q) => q.audiences.includes('docentes') && !q.audiences.includes('todos'))) existingSegs.push('docentes');
    if (form.questions?.some((q) => q.audiences.includes('taes') && !q.audiences.includes('todos'))) existingSegs.push('taes');
    setCompletedSegments(existingSegs);
    setIsCreateModalOpen(true);
  };

  // Save Progress as Draft (Botão "Salvar progresso")
  const handleSaveProgressDraft = () => {
    const titleToSave = formTitle.trim() || 'Novo Formulário';
    const questionsToSave =
      formQuestions.length > 0
        ? formQuestions
        : [
            {
              id: `q-${Date.now()}-1`,
              title: 'Como você avalia a qualidade geral das instalações do campus?',
              type: 'SCALE',
              required: true,
              category: 'Ensino',
              audiences: ['todos'],
              options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
            },
          ];

    if (editingForm) {
      const updated: SmartForm = {
        ...editingForm,
        title: titleToSave,
        description: formDescription,
        campus: formCampus,
        periodo: formPeriodo,
        questions: questionsToSave,
        updatedAt: new Date().toLocaleDateString('pt-BR'),
        status: 'Rascunho',
      };
      setForms(forms.map((f) => (f.id === editingForm.id ? updated : f)));
      showNotification('success', `Progresso salvo! Formulário "${titleToSave}" mantido em Rascunho.`);
    } else {
      const newForm: SmartForm = {
        id: `form-smart-${Date.now()}`,
        title: titleToSave,
        description: formDescription,
        campus: formCampus,
        periodo: formPeriodo,
        status: 'Rascunho',
        createdAt: new Date().toLocaleDateString('pt-BR'),
        questions: questionsToSave,
        responsesCount: { total: 0, alunos: 0, docentes: 0, taes: 0 },
      };
      setForms([newForm, ...forms]);
      showNotification('success', `Progresso salvo! Novo formulário "${titleToSave}" armazenado em Rascunho.`);
    }

    setIsCreateModalOpen(false);
  };

  // Finalize / Publicar Form
  const handleFinalizeForm = () => {
    const titleToSave = formTitle.trim() || 'Avaliação Institucional CPA';
    const questionsToSave =
      formQuestions.length > 0
        ? formQuestions
        : [
            {
              id: `q-${Date.now()}-1`,
              title: 'Como você avalia as condições de apoio acadêmico e infraestrutura do campus?',
              type: 'SCALE',
              required: true,
              category: 'Ensino',
              audiences: ['todos'],
              options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
            },
          ];

    if (editingForm) {
      const updated: SmartForm = {
        ...editingForm,
        title: titleToSave,
        description: formDescription,
        campus: formCampus,
        periodo: formPeriodo,
        questions: questionsToSave,
        updatedAt: new Date().toLocaleDateString('pt-BR'),
        status: publishStatus,
      };
      setForms(forms.map((f) => (f.id === editingForm.id ? updated : f)));
      showNotification(
        'success',
        `Formulário "${titleToSave}" atualizado e ${publishStatus === 'Ativo' ? 'PUBLICADO com status Ativo' : 'salvo como Rascunho'}!`
      );
    } else {
      const newForm: SmartForm = {
        id: `form-smart-${Date.now()}`,
        title: titleToSave,
        description: formDescription,
        campus: formCampus,
        periodo: formPeriodo,
        status: publishStatus,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        questions: questionsToSave,
        responsesCount: { total: 0, alunos: 0, docentes: 0, taes: 0 },
      };
      setForms([newForm, ...forms]);
      showNotification(
        'success',
        `Formulário "${titleToSave}" cadastrado e ${publishStatus === 'Ativo' ? 'PUBLICADO com status Ativo' : 'salvo como Rascunho'}!`
      );
    }

    setIsCreateModalOpen(false);
  };

  // Question Manipulation Helpers for Steps 2 and 4
  const handleAddGeneralQuestion = () => {
    setFormQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: '',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: ['todos'],
        options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
      },
    ]);
  };

  const handleAddSegmentQuestion = (seg: 'alunos' | 'docentes' | 'taes') => {
    setFormQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: '',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: [seg],
        options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
      },
    ]);
  };

  const handleRemoveWizardQuestion = (id: string) => {
    setFormQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleMoveWizardQuestion = (id: string, direction: 'up' | 'down') => {
    setFormQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const newArr = [...prev];
      const temp = newArr[idx];
      newArr[idx] = newArr[targetIdx];
      newArr[targetIdx] = temp;
      return newArr;
    });
  };

  const handleUpdateWizardQuestionField = (id: string, field: keyof SmartQuestion, value: any) => {
    setFormQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (field === 'type') {
            let options: string[] | undefined = undefined;
            if (value === 'SCALE') {
              options = ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'];
            } else if (value === 'YES_NO') {
              options = ['Sim', 'Não'];
            } else if (['RADIO', 'CHECKBOX'].includes(value)) {
              options = q.options && q.options.length > 0 ? q.options : ['Opção 1', 'Opção 2'];
            }
            return { ...q, type: value, options };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const handleChooseNextSegment = () => {
    if (!completedSegments.includes(selectedSegment)) {
      setCompletedSegments((prev) => [...prev, selectedSegment]);
    }
    setWizardStep(3);
    showNotification('info', `Perguntas salvas! Escolha o próximo segmento ou avance para a revisão.`);
  };

  // Helper to load CPA template items into current questions
  const handleLoadCPATemplate = (template: CPATemplateItem) => {
    if (!formTitle.trim()) {
      setFormTitle(`${template.title} - ${new Date().getFullYear()}`);
    }
    if (!formDescription.trim()) {
      setFormDescription(template.description);
    }
    setFormQuestions(
      template.questions.map((q) => ({
        ...q,
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      }))
    );
    showNotification('success', `Perguntas do modelo "${template.title}" carregadas no formulário!`);
  };

  // Participant Responder Mode ("Visão do Participante")
  const [respondingForm, setRespondingForm] = useState<SmartForm | null>(null);
  const [participantSegment, setParticipantSegment] = useState<'alunos' | 'docentes' | 'taes' | null>(null);
  const [participantAnswers, setParticipantAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseSubmitted, setResponseSubmitted] = useState(false);

  // Metrics & Analytics Viewer
  const [viewingMetricsForm, setViewingMetricsForm] = useState<SmartForm | null>(null);

  // Delete Confirmation State
  const [deletingForm, setDeletingForm] = useState<SmartForm | null>(null);

  // Publishing to Google Forms State
  const [publishingFormId, setPublishingFormId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // View Mode: 'table' (default requested) or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Campaign Configuration State
  const [campaignModalForm, setCampaignModalForm] = useState<SmartForm | null>(null);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignCampus, setCampaignCampus] = useState('Campus Tauá');
  const [campaignSegment, setCampaignSegment] = useState<TargetAudience>('todos');
  const [campaignStartDate, setCampaignStartDate] = useState('2026-08-15');
  const [campaignEndDate, setCampaignEndDate] = useState('2026-12-30');
  const [campaignCustomMessage, setCampaignCustomMessage] = useState('');

  const [campaignsList, setCampaignsList] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('cpa_campaigns_list');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'camp-1',
        formId: 'form-smart-1',
        formTitle: 'Avaliação Docente e das Disciplinas - 2026.2',
        title: 'Campanha de Avaliação Institucional 2026.2 - Campus Tauá',
        campus: 'Campus Tauá',
        segment: 'todos',
        startDate: '15/08/2026',
        endDate: '30/12/2026',
        customMessage:
          'Prezado(a) integrante da comunidade acadêmica, a Comissão Própria de Avaliação (CPA) convida você a participar da Avaliação Institucional do IFCE. Sua contribuição é fundamental para o aprimoramento dos serviços, infraestrutura e ensino.',
        createdAt: '15/08/2026',
        status: 'Ativa',
        sentEmailsCount: 2450,
        uniqueTokenUrl: 'https://cpa.ifce.edu.br/avaliacao/form-smart-1?token=suap-taua-883921',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('cpa_campaigns_list', JSON.stringify(campaignsList));
  }, [campaignsList]);

  // Open Campaign Configuration Modal
  const handleOpenCampaignModal = (form: SmartForm) => {
    setCampaignModalForm(form);
    setCampaignTitle(`Campanha de Avaliação Institucional 2026.2 - ${form.title}`);
    setCampaignCampus(form.campus || 'Campus Tauá');
    setCampaignSegment('todos');
    setCampaignStartDate(new Date().toISOString().split('T')[0]);
    const future = new Date();
    future.setDate(future.getDate() + 90);
    setCampaignEndDate(future.toISOString().split('T')[0]);
    setCampaignCustomMessage(
      `Prezado(a) participante,\n\nA Comissão Própria de Avaliação (CPA) do IFCE convida você a responder à "${form.title}".\n\nSua opinião é fundamental para orientar as melhorias de ensino, infraestrutura, biblioteca e gestão no campus. O preenchimento leva cerca de 3 a 5 minutos.\n\nAtenciosamente,\nCoordenação da CPA - IFCE.`
    );
    setOpenActionMenuId(null);
  };

  // Launch / Save Campaign
  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignModalForm) return;
    if (!campaignTitle.trim()) {
      showNotification('error', 'Por favor, informe o título da campanha.');
      return;
    }

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      formId: campaignModalForm.id,
      formTitle: campaignModalForm.title,
      title: campaignTitle,
      campus: campaignCampus,
      segment: campaignSegment,
      startDate: campaignStartDate,
      endDate: campaignEndDate,
      customMessage: campaignCustomMessage,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativa',
      sentEmailsCount:
        campaignSegment === 'todos'
          ? 2450
          : campaignSegment === 'alunos'
          ? 1800
          : campaignSegment === 'docentes'
          ? 350
          : 300,
      uniqueTokenUrl: `https://cpa.ifce.edu.br/avaliacao/${campaignModalForm.id}?token=suap-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
    };

    setCampaignsList([newCampaign, ...campaignsList]);
    setForms(forms.map((f) => (f.id === campaignModalForm.id ? { ...f, status: 'Ativo' } : f)));
    showNotification(
      'success',
      `Campanha "${campaignTitle}" configurada e ativada com sucesso! Convocação disparada para o e-mail institucional.`
    );
    setCampaignModalForm(null);
  };

  // Action Menu Handlers
  const handleDuplicateForm = (form: SmartForm) => {
    const duplicated: SmartForm = {
      ...form,
      id: `form-smart-${Date.now()}`,
      title: `${form.title} (Cópia)`,
      status: 'Rascunho',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      periodo: form.periodo || '15/08/2026 - 30/12/2026',
      lastSync: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      responsesCount: { total: 0, alunos: 0, docentes: 0, taes: 0 },
      googleFormId: undefined,
      googleFormLink: undefined,
    };
    setForms([duplicated, ...forms]);
    showNotification('success', `Formulário "${form.title}" duplicado como rascunho com sucesso!`);
    setOpenActionMenuId(null);
  };

  const handleSendCampaign = (form: SmartForm) => {
    handleOpenCampaignModal(form);
  };

  const handleToggleCampaignStatus = (form: SmartForm) => {
    const newStatus = form.status === 'Ativo' ? 'Encerrado' : 'Ativo';
    setForms(forms.map((f) => (f.id === form.id ? { ...f, status: newStatus } : f)));
    showNotification(
      'info',
      `O status do formulário "${form.title}" foi alterado para "${newStatus}".`
    );
    setOpenActionMenuId(null);
  };

  const handleOpenGoogleFormsLink = (form: SmartForm) => {
    setOpenActionMenuId(null);
    if (form.googleFormLink) {
      window.open(form.googleFormLink, '_blank', 'noopener,noreferrer');
    } else {
      handlePublishToGoogleForms(form);
    }
  };

  // Save Created or Edited Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showNotification('error', 'Por favor, informe o título do formulário.');
      return;
    }

    if (formQuestions.length === 0) {
      showNotification('error', 'Adicione pelo menos uma pergunta ao formulário.');
      return;
    }

    if (editingForm) {
      // Update
      const updated: SmartForm = {
        ...editingForm,
        title: formTitle,
        description: formDescription,
        campus: formCampus,
        questions: formQuestions,
        updatedAt: new Date().toLocaleDateString('pt-BR'),
      };
      setForms(forms.map((f) => (f.id === editingForm.id ? updated : f)));
      showNotification('success', `Formulário "${formTitle}" atualizado com sucesso!`);
    } else {
      // Create New
      const newForm: SmartForm = {
        id: `form-smart-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        campus: formCampus,
        status: 'Rascunho',
        createdAt: new Date().toLocaleDateString('pt-BR'),
        questions: formQuestions,
        responsesCount: {
          total: 0,
          alunos: 0,
          docentes: 0,
          taes: 0,
        },
      };
      setForms([newForm, ...forms]);
      showNotification('success', `Novo Formulário "${formTitle}" salvo em rascunho com sucesso!`);
    }

    setIsCreateModalOpen(false);
  };

  // Question manipulation helpers
  const handleAddQuestion = () => {
    setFormQuestions([
      ...formQuestions,
      {
        id: `q-${Date.now()}`,
        title: '',
        type: 'SCALE',
        required: true,
        audiences: ['todos'],
      },
    ]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (formQuestions.length <= 1) {
      showNotification('info', 'O formulário deve ter no mínimo uma pergunta.');
      return;
    }
    setFormQuestions(formQuestions.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (id: string, field: keyof SmartQuestion, value: any) => {
    setFormQuestions(
      formQuestions.map((q) => {
        if (q.id === id) {
          if (field === 'type' && value === 'YES_NO') {
            return { ...q, type: 'YES_NO', options: ['Sim', 'Não'] };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  // Question option manipulation helpers
  const handleAddQuestionOption = (questionId: string) => {
    setFormQuestions(
      formQuestions.map((q) => {
        if (q.id !== questionId) return q;
        const opts = q.options && q.options.length > 0 ? [...q.options] : ['Opção 1', 'Opção 2'];
        return { ...q, options: [...opts, `Opção ${opts.length + 1}`] };
      })
    );
  };

  const handleUpdateQuestionOption = (questionId: string, optionIdx: number, value: string) => {
    setFormQuestions(
      formQuestions.map((q) => {
        if (q.id !== questionId) return q;
        const opts = [...(q.options || [])];
        opts[optionIdx] = value;
        return { ...q, options: opts };
      })
    );
  };

  const handleRemoveQuestionOption = (questionId: string, optionIdx: number) => {
    setFormQuestions(
      formQuestions.map((q) => {
        if (q.id !== questionId) return q;
        const opts = (q.options || []).filter((_, idx) => idx !== optionIdx);
        return { ...q, options: opts };
      })
    );
  };

  const handleToggleAudience = (questionId: string, target: TargetAudience) => {
    setFormQuestions(
      formQuestions.map((q) => {
        if (q.id !== questionId) return q;

        let newAudiences = [...q.audiences];

        if (target === 'todos') {
          // If toggled 'todos'
          if (newAudiences.includes('todos')) {
            newAudiences = ['alunos']; // fallback
          } else {
            newAudiences = ['todos'];
          }
        } else {
          // If 'todos' was checked, remove 'todos' first
          if (newAudiences.includes('todos')) {
            newAudiences = newAudiences.filter((a) => a !== 'todos');
          }

          if (newAudiences.includes(target)) {
            newAudiences = newAudiences.filter((a) => a !== target);
            if (newAudiences.length === 0) newAudiences = ['todos'];
          } else {
            newAudiences.push(target);
          }
        }

        return { ...q, audiences: newAudiences };
      })
    );
  };

  // Participant Mode Actions
  const handleStartResponding = (form: SmartForm) => {
    setRespondingForm(form);
    setParticipantSegment(null);
    setParticipantAnswers({});
    setResponseSubmitted(false);
  };

  // Filter questions for current participant segment
  const getFilteredQuestionsForParticipant = (): SmartQuestion[] => {
    if (!respondingForm || !participantSegment) return [];
    return respondingForm.questions.filter((q) => {
      if (q.audiences.includes('todos')) return true;
      return q.audiences.includes(participantSegment);
    });
  };

  // Submit Participant Answer
  const handleSubmitParticipantResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingForm || !participantSegment) return;

    setIsSubmittingResponse(true);
    setTimeout(() => {
      // Increment response count
      setForms((prevForms) =>
        prevForms.map((f) => {
          if (f.id === respondingForm.id) {
            return {
              ...f,
              responsesCount: {
                ...f.responsesCount,
                total: f.responsesCount.total + 1,
                [participantSegment]: f.responsesCount[participantSegment] + 1,
              },
            };
          }
          return f;
        })
      );

      setIsSubmittingResponse(false);
      setResponseSubmitted(true);
      showNotification(
        'success',
        `Resposta enviada com sucesso para o segmento ${
          participantSegment === 'alunos'
            ? 'Aluno'
            : participantSegment === 'docentes'
            ? 'Docente'
            : 'TAE'
        }!`
      );
    }, 600);
  };

  // Sync / Publish Smart Form to Google Forms API
  const handlePublishToGoogleForms = async (form: SmartForm) => {
    setPublishingFormId(form.id);
    try {
      let accessToken = getAccessToken();
      if (!accessToken) {
        const res = await googleSignIn();
        if (res) accessToken = res.accessToken;
      }

      if (!accessToken) {
        showNotification('error', 'Conexão com Google necessária. Faça login na sua conta Google.');
        return;
      }

      // Convert questions for Google Forms API
      const questionsInput = form.questions.map((q) => ({
        title: `${q.title} [Público: ${
          q.audiences.includes('todos')
            ? 'Todos'
            : q.audiences
                .map((a) => (a === 'alunos' ? 'Alunos' : a === 'docentes' ? 'Docentes' : 'TAEs'))
                .join(', ')
        }]`,
        type: q.type,
        required: q.required,
        options: q.options,
      }));

      const created = await createGoogleForm(
        accessToken,
        form.title,
        form.description,
        questionsInput
      );

      // Update form with Google link
      const updatedForm: SmartForm = {
        ...form,
        googleFormId: created.formId,
        googleFormLink: created.responderUri || `https://docs.google.com/forms/d/${created.formId}/viewform`,
      };

      setForms(forms.map((f) => (f.id === form.id ? updatedForm : f)));
      showNotification('success', `Formulário gerado e publicado no Google Forms com sucesso!`);
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Erro ao publicar no Google Forms.');
    } finally {
      setPublishingFormId(null);
    }
  };

  // Delete Form
  const handleDeleteForm = () => {
    if (!deletingForm) return;
    setForms(forms.filter((f) => f.id !== deletingForm.id));
    showNotification('success', `Formulário "${deletingForm.title}" excluído.`);
    setDeletingForm(null);
  };

  // Filtered forms list for table and grid
  const filteredForms = forms.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || f.status === statusFilter;
    const matchesAudience =
      audienceFilter === 'todos' ||
      f.questions.some(
        (q) => q.audiences.includes('todos') || q.audiences.includes(audienceFilter as any)
      );
    const matchesCampus = campusFilter === 'todos' || f.campus === campusFilter;
    const matchesPeriod =
      periodFilter === 'todos' || (f.periodo && f.periodo.toLowerCase().includes(periodFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesAudience && matchesCampus && matchesPeriod;
  });

  // Render Classificação das Perguntas Screen if active
  if (classifyingForm) {
    const filteredClassQuestions = getFilteredQuestionsForClassification();

    // If profile preview role is active (e.g. Aluno), filter questions as seen by that role
    const previewQuestions =
      previewRole === 'none'
        ? filteredClassQuestions
        : classifyingForm.questions.filter(
            (q) => q.audiences.includes('todos') || q.audiences.includes(previewRole)
          );

    return (
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-200">
        {/* Header Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setClassifyingForm(null);
                    setPreviewRole('none');
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer mr-1"
                  title="Voltar para Lista de Formulários"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">Classificação das Perguntas</h1>
                <span className="bg-emerald-50 text-[#006837] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Google Forms Importado
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-8">
                Formulário: <span className="font-bold text-slate-800">{classifyingForm.title}</span>
              </p>
            </div>

            {/* Controls: "Visualizar como" & "Salvar Classificação" */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Button "Visualizar como" */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-700">
                <span className="px-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  Visualizar como:
                </span>
                <button
                  onClick={() => setPreviewRole('none')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewRole === 'none'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  ⚙️ Edição
                </button>
                <button
                  onClick={() => setPreviewRole('alunos')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewRole === 'alunos'
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  🎓 Aluno
                </button>
                <button
                  onClick={() => setPreviewRole('docentes')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewRole === 'docentes'
                      ? 'bg-[#006837] text-white font-bold shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  👨‍🏫 Docente
                </button>
                <button
                  onClick={() => setPreviewRole('taes')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewRole === 'taes'
                      ? 'bg-amber-600 text-white font-bold shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  💼 TAE
                </button>
              </div>

              {/* Save Classification Button */}
              <button
                onClick={handleSaveClassification}
                className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Salvar & Concluir Classificação</span>
              </button>
            </div>
          </div>

          {/* Educational Instruction Banner */}
          {previewRole === 'none' ? (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Como os formulários antigos do Google Forms possuem todas as perguntas misturadas, utilize os controles em cada card para classificar rapidamente a <strong className="font-bold">Categoria CPA</strong> e o <strong className="font-bold">Público-Alvo (Segmento)</strong>. A edição é salva instantaneamente no card sem precisar abrir outras telas.
              </p>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Modo de Visualização do Perfil:{' '}
                  <strong className="font-bold uppercase text-indigo-700">
                    {previewRole === 'alunos'
                      ? 'Aluno (Discente)'
                      : previewRole === 'docentes'
                      ? 'Docente (Professor)'
                      : 'Técnico Administrativo (TAE)'}
                  </strong>{' '}
                  — O sistema oculta automaticamente todas as perguntas destinadas exclusivamente a outros públicos. Exibindo{' '}
                  <strong className="font-bold">{previewQuestions.length} de {classifyingForm.questions.length}</strong> perguntas visíveis.
                </span>
              </div>
              <button
                onClick={() => setPreviewRole('none')}
                className="px-3 py-1 bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                Voltar para Edição
              </button>
            </div>
          )}
        </div>

        {/* Filter and Search Bar for Questions (Only in classification mode) */}
        {previewRole === 'none' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              {/* Search text */}
              <div className="relative w-full lg:w-72">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por texto no enunciado..."
                  value={classSearchTerm}
                  onChange={(e) => setClassSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837]"
                />
              </div>

              {/* Select Filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto text-xs">
                {/* Category filter */}
                <select
                  value={classCategoryFilter}
                  onChange={(e) => setClassCategoryFilter(e.target.value)}
                  className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="todas">Todas as Categorias ({classifyingForm.questions.length})</option>
                  {QUESTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      Categoria: {cat}
                    </option>
                  ))}
                </select>

                {/* Audience / Segment filter */}
                <select
                  value={classAudienceFilter}
                  onChange={(e) => setClassAudienceFilter(e.target.value)}
                  className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="todos">Todos os Segmentos</option>
                  <option value="todos_only">Somente '☑ Todos'</option>
                  <option value="alunos">Público: Alunos</option>
                  <option value="docentes">Público: Docentes</option>
                  <option value="taes">Público: TAEs</option>
                </select>

                {/* Required filter */}
                <select
                  value={classRequiredFilter}
                  onChange={(e) => setClassRequiredFilter(e.target.value)}
                  className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="todas">Todas as Obrigatoriedades</option>
                  <option value="required">Somente Obrigatórias (*)</option>
                  <option value="optional">Somente Opcionais</option>
                </select>

                {/* Type filter */}
                <select
                  value={classTypeFilter}
                  onChange={(e) => setClassTypeFilter(e.target.value)}
                  className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="SCALE">Escala Likert (1 a 5)</option>
                  <option value="RADIO">Múltipla Escolha (Única)</option>
                  <option value="CHECKBOX">Caixas de Seleção</option>
                  <option value="DROPDOWN">Lista Suspensa</option>
                  <option value="SHORT_TEXT">Texto Curto</option>
                  <option value="LONG_TEXT">Texto Longo</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              <span>
                Exibindo <strong className="text-slate-800">{previewQuestions.length}</strong> de <strong className="text-slate-800">{classifyingForm.questions.length}</strong> perguntas
              </span>
              <button
                onClick={() => {
                  setClassSearchTerm('');
                  setClassCategoryFilter('todas');
                  setClassAudienceFilter('todos');
                  setClassRequiredFilter('todas');
                  setClassTypeFilter('todos');
                }}
                className="text-[#006837] font-bold hover:underline cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Cards List */}
        <div className="space-y-4">
          {previewQuestions.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Nenhuma pergunta encontrada com os filtros selecionados.</p>
              <button
                onClick={() => {
                  setClassSearchTerm('');
                  setClassCategoryFilter('todas');
                  setClassAudienceFilter('todos');
                  setClassRequiredFilter('todas');
                  setClassTypeFilter('todos');
                }}
                className="text-xs font-bold text-[#006837] underline cursor-pointer"
              >
                Resetar todos os filtros
              </button>
            </div>
          ) : (
            previewQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-emerald-300 transition-all"
              >
                {/* Header of question card */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#006837] text-xs">#{idx + 1}</span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {q.title || 'Pergunta sem título'}
                        {q.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                      </h4>
                    </div>
                    {q.description && (
                      <p className="text-xs text-slate-500 font-normal">{q.description}</p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                      {q.type === 'SCALE'
                        ? 'Escala (1 a 5)'
                        : q.type === 'RADIO'
                        ? 'Múltipla Escolha'
                        : q.type === 'CHECKBOX'
                        ? 'Caixa de Seleção'
                        : q.type === 'DROPDOWN'
                        ? 'Lista Suspensa'
                        : q.type === 'SHORT_TEXT'
                        ? 'Texto Curto'
                        : 'Texto Longo'}
                    </span>
                    {q.required ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                        Obrigatória
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                        Opcional
                      </span>
                    )}
                  </div>
                </div>

                {/* If in Classification Mode: Show Fast Inline Selectors for Category & Público */}
                {previewRole === 'none' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    {/* Categoria Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#006837]" />
                        <span>Categoria CPA:</span>
                      </label>
                      <select
                        value={q.category || 'Outros'}
                        onChange={(e) =>
                          handleUpdateCategoryInClassifying(q.id, e.target.value as QuestionCategory)
                        }
                        className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] shadow-2xs cursor-pointer"
                      >
                        {QUESTION_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Público Target Checkboxes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Público-Alvo (Segmento):</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 text-xs font-medium">
                        {/* Todos */}
                        <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#006837]">
                          <input
                            type="checkbox"
                            checked={q.audiences.includes('todos')}
                            onChange={() => handleToggleAudienceInClassifying(q.id, 'todos')}
                            className="accent-[#006837] rounded"
                          />
                          <span>Todos</span>
                        </label>

                        {/* Alunos */}
                        <label className="flex items-center gap-1.5 cursor-pointer text-indigo-900 font-semibold">
                          <input
                            type="checkbox"
                            checked={
                              q.audiences.includes('todos') || q.audiences.includes('alunos')
                            }
                            disabled={q.audiences.includes('todos')}
                            onChange={() => handleToggleAudienceInClassifying(q.id, 'alunos')}
                            className="accent-indigo-600 rounded"
                          />
                          <span>Alunos</span>
                        </label>

                        {/* Docentes */}
                        <label className="flex items-center gap-1.5 cursor-pointer text-emerald-900 font-semibold">
                          <input
                            type="checkbox"
                            checked={
                              q.audiences.includes('todos') || q.audiences.includes('docentes')
                            }
                            disabled={q.audiences.includes('todos')}
                            onChange={() => handleToggleAudienceInClassifying(q.id, 'docentes')}
                            className="accent-emerald-600 rounded"
                          />
                          <span>Docentes</span>
                        </label>

                        {/* TAEs */}
                        <label className="flex items-center gap-1.5 cursor-pointer text-amber-900 font-semibold">
                          <input
                            type="checkbox"
                            checked={
                              q.audiences.includes('todos') || q.audiences.includes('taes')
                            }
                            disabled={q.audiences.includes('todos')}
                            onChange={() => handleToggleAudienceInClassifying(q.id, 'taes')}
                            className="accent-amber-600 rounded"
                          />
                          <span>TAEs</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Profile Preview Question Interactive Component */
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#006837] bg-emerald-50 px-2 py-0.5 rounded-md">
                        {q.category || 'Outros'}
                      </span>
                    </div>

                    {/* Scale Question */}
                    {q.type === 'SCALE' && (
                      <div className="grid grid-cols-5 gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <div
                            key={val}
                            className="p-2.5 rounded-xl border border-slate-200 text-center bg-slate-50 text-xs font-bold text-slate-700"
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Options if Radio or Checkbox */}
                    {(q.type === 'RADIO' || q.type === 'CHECKBOX') && (
                      <div className="space-y-2 pt-1">
                        {(q.options || ['Opção 1', 'Opção 2']).map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium flex items-center gap-2"
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white inline-block shrink-0" />
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Short Text */}
                    {q.type === 'SHORT_TEXT' && (
                      <input
                        disabled
                        type="text"
                        placeholder="Resposta do participante..."
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    )}

                    {/* Long Text */}
                    {(q.type === 'LONG_TEXT' || q.type === 'TEXT') && (
                      <textarea
                        disabled
                        rows={2}
                        placeholder="Resposta detalhada do participante..."
                        className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Header exact requirements:
          Título: Formulários
          Descrição: Gerencie todas as avaliações institucionais da CPA.
          Botão: Novo Formulário
      */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Formulários</h1>
            <span className="bg-[#E8F5EE] text-[#006837] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#006837]/10">
              Módulo CPA • Campus Tauá
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Gerencie todas as avaliações institucionais da CPA.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-[#006837] border border-[#006837]/30 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#006837]" />
            <span>Importar Formulário</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Formulário</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-2xs animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : notification.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Indicators Bar (Apenas 3 indicadores) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Formulários Ativos */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-4.5 shadow-2xs space-y-1 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Formulários Ativos</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#006837] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {forms.filter((f) => f.status === 'Ativo').length}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">Em andamento na CPA</p>
        </div>

        {/* Card 2: Respostas Recebidas */}
        <div className="bg-white rounded-2xl border border-indigo-100 p-4.5 shadow-2xs space-y-1 bg-indigo-50/20">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Respostas Recebidas</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-indigo-950">
            {forms.reduce((acc, f) => acc + (f.responsesCount?.total || 0), 0).toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-indigo-600 font-medium">Consolidadas para relatórios</p>
        </div>

        {/* Card 3: Última Sincronização */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4.5 shadow-2xs space-y-1 bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Última Sincronização</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-bold text-slate-900 truncate mt-1">
            {forms.find((f) => f.lastSync)?.lastSync || 'Hoje, 11:45'}
          </p>
          <p className="text-[11px] text-amber-700 font-medium">Integração Google Forms ativa</p>
        </div>
      </div>

      {/* Single Horizontal Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Horizontal Filters Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 w-full xl:w-auto flex-1">
          {/* 1. Pesquisa */}
          <div className="relative min-w-[160px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white"
            />
          </div>

          {/* 2. Campus */}
          <div className="relative">
            <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
            >
              <option value="todos">Todos os Campi</option>
              <option value="Campus Tauá">Campus Tauá</option>
              <option value="Campus Crateús">Campus Crateús</option>
              <option value="Campus Canindé">Campus Canindé</option>
              <option value="Campus Fortaleza">Campus Fortaleza</option>
            </select>
          </div>

          {/* 3. Status */}
          <div className="relative">
            <ListFilter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
            >
              <option value="todos">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Rascunho">Rascunho</option>
              <option value="Encerrado">Encerrado</option>
            </select>
          </div>

          {/* 4. Segmento */}
          <div className="relative">
            <Users className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value as any)}
              className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
            >
              <option value="todos">Todos os Segmentos</option>
              <option value="alunos">Alunos</option>
              <option value="docentes">Docentes</option>
              <option value="taes">TAEs</option>
            </select>
          </div>

          {/* 5. Período */}
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
            >
              <option value="todos">Todos os Períodos</option>
              <option value="2026.2">Semestre 2026.2</option>
              <option value="2026.1">Semestre 2026.1</option>
              <option value="2025.2">Semestre 2025.2</option>
              <option value="2025.1">Semestre 2025.1</option>
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 shrink-0">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tabela</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grade</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Table View (Default) or Grid View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 min-w-[240px]">Título</th>
                  <th className="py-3.5 px-4">Campus</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Período</th>
                  <th className="py-3.5 px-4">Quantidade de respostas</th>
                  <th className="py-3.5 px-4">Última sincronização</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredForms.map((form) => (
                  <tr key={form.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Column 1: Título */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 hover:text-[#006837] transition-colors leading-snug">
                          {form.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm font-normal">
                          {form.description}
                        </p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {form.questions.length} perguntas
                          </span>
                          {form.googleFormLink && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                              <FileSpreadsheet className="w-3 h-3 text-[#006837]" /> Google Forms OK
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Campus */}
                    <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                      {form.campus}
                    </td>

                    {/* Column 3: Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          form.status === 'Ativo'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : form.status === 'Rascunho'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        ● {form.status}
                      </span>
                    </td>

                    {/* Column 4: Período */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{form.periodo || '15/05/2025 - 30/11/2025'}</span>
                      </div>
                    </td>

                    {/* Column 5: Quantidade de respostas */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">
                          {form.responsesCount.total.toLocaleString('pt-BR')} respostas
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Alunos: {form.responsesCount.alunos} • Docentes: {form.responsesCount.docentes} • TAEs: {form.responsesCount.taes}
                        </p>
                      </div>
                    </td>

                    {/* Column 6: Última sincronização */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                      {form.lastSync || '28/07/2026 15:30'}
                    </td>

                    {/* Column 7: Ações (Olho, Avião e 3 Pontos) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* 1. Ícone do Olho: Visualizar / Responder */}
                        <button
                          onClick={() => handleStartResponding(form)}
                          className="p-1.5 text-[#006837] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-emerald-200/80"
                          title="Visualizar / Responder"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* 2. Ícone de Avião: Lançar Formulário / Enviar Campanha */}
                        <button
                          onClick={() => handleSendCampaign(form)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer border border-amber-200/80"
                          title="Lançar Formulário / Enviar Campanha"
                        >
                          <Send className="w-4 h-4" />
                        </button>

                        {/* 3. Ícone de 3 Pontos: Menu de Mais Opções Inteligente (Drop-up/Drop-down) */}
                        <FormRowActionButton
                          form={form}
                          isOpen={openActionMenuId === form.id}
                          onToggle={() => setOpenActionMenuId(openActionMenuId === form.id ? null : form.id)}
                          onClose={() => setOpenActionMenuId(null)}
                          handleStartResponding={handleStartResponding}
                          handleOpenGoogleFormsLink={handleOpenGoogleFormsLink}
                          setViewingMetricsForm={setViewingMetricsForm}
                          handleOpenEditModal={handleOpenEditModal}
                          handleDuplicateForm={handleDuplicateForm}
                          handleSendCampaign={handleSendCampaign}
                          handleToggleCampaignStatus={handleToggleCampaignStatus}
                          setDeletingForm={setDeletingForm}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Forms Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => {
            const questionsForAlunos = form.questions.filter(
              (q) => q.audiences.includes('todos') || q.audiences.includes('alunos')
            ).length;
            const questionsForDocentes = form.questions.filter(
              (q) => q.audiences.includes('todos') || q.audiences.includes('docentes')
            ).length;
            const questionsForTaes = form.questions.filter(
              (q) => q.audiences.includes('todos') || q.audiences.includes('taes')
            ).length;

            return (
              <div
                key={form.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        form.status === 'Ativo'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : form.status === 'Rascunho'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      ● {form.status}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400">
                      {form.campus}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 group-hover:text-[#006837] transition-colors leading-snug">
                    {form.title}
                  </h2>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {form.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                    <span>Perguntas por Público-Alvo:</span>
                    <span className="text-slate-400">{form.questions.length} total</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-1.5 bg-indigo-50/80 rounded-lg border border-indigo-100">
                      <p className="text-[10px] text-indigo-600 font-medium">Alunos</p>
                      <p className="text-xs font-bold text-indigo-900">{questionsForAlunos} q</p>
                    </div>
                    <div className="p-1.5 bg-emerald-50/80 rounded-lg border border-emerald-100">
                      <p className="text-[10px] text-emerald-700 font-medium">Docentes</p>
                      <p className="text-xs font-bold text-emerald-900">{questionsForDocentes} q</p>
                    </div>
                    <div className="p-1.5 bg-amber-50/80 rounded-lg border border-amber-100">
                      <p className="text-[10px] text-amber-700 font-medium">TAEs</p>
                      <p className="text-xs font-bold text-amber-900">{questionsForTaes} q</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Respostas Recebidas:</span>
                    <span className="font-bold text-slate-800">{form.responsesCount.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        width: `${
                          form.responsesCount.total > 0
                            ? (form.responsesCount.alunos / form.responsesCount.total) * 100
                            : 0
                        }%`,
                      }}
                      className="bg-indigo-500"
                      title={`Alunos: ${form.responsesCount.alunos}`}
                    />
                    <div
                      style={{
                        width: `${
                          form.responsesCount.total > 0
                            ? (form.responsesCount.docentes / form.responsesCount.total) * 100
                            : 0
                        }%`,
                      }}
                      className="bg-[#006837]"
                      title={`Docentes: ${form.responsesCount.docentes}`}
                    />
                    <div
                      style={{
                        width: `${
                          form.responsesCount.total > 0
                            ? (form.responsesCount.taes / form.responsesCount.total) * 100
                            : 0
                        }%`,
                      }}
                      className="bg-amber-500"
                      title={`TAEs: ${form.responsesCount.taes}`}
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleStartResponding(form)}
                    className="w-full py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-98"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Visualizar (Preenchimento)</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(form)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleOpenGoogleFormsLink(form)}
                      className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006837] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Forms</span>
                    </button>

                    <button
                      onClick={() => setViewingMetricsForm(form)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Ver Métricas"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeletingForm(form)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Wizard de Criação de Formulários (CPA IFCE) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]">
            
            {/* CABEÇALHO DO WIZARD */}
            <div className="bg-slate-50 border-b border-slate-200/80 p-5 sm:p-6 space-y-4">
              {/* Header Top Row: Title & Close */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006837] text-[10px] font-black uppercase tracking-wider border border-emerald-200/80">
                      Assistente de Criação • CPA IFCE
                    </span>
                    {editingForm && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                        Edição de Formulário
                      </span>
                    )}
                  </div>

                  {/* Realtime Dynamic Header Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate tracking-tight">
                    {formTitle.trim() ? formTitle : 'Novo Formulário'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                  title="Fechar assistente"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Counter */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#006837]" />
                  Etapa {wizardStep} de {WIZARD_STEPS.length}
                </span>
                <span className="text-[#006837] font-black">
                  {wizardStep * 20}% concluído
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#006837] transition-all duration-300 rounded-full"
                  style={{ width: `${wizardStep * 20}%` }}
                />
              </div>

              {/* STEPPER INDICATOR */}
              <div className="grid grid-cols-5 gap-1 pt-1">
                {WIZARD_STEPS.map((step) => {
                  const isActive = wizardStep === step.id;
                  const isCompleted = wizardStep > step.id;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setWizardStep(step.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer text-center group ${
                        isActive
                          ? 'bg-white shadow-xs border border-emerald-200 text-[#006837]'
                          : isCompleted
                          ? 'text-emerald-700 hover:bg-emerald-50/50'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all mb-1 ${
                          isActive
                            ? 'bg-[#006837] text-white shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-100 text-[#006837]'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                      </div>
                      <span className="text-[10px] font-bold line-clamp-1">
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CORPO DO WIZARD (CONTEÚDO DAS ETAPAS) */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

              {/* ETAPA 1 — INFORMAÇÕES DO FORMULÁRIO */}
              {wizardStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#006837]" />
                      Etapa 1: Informações do Formulário
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informe o título, a apresentação e o campus do IFCE para onde este instrumento será direcionado.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Campo 1: Título do Formulário */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>Título do Formulário</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Avaliação Institucional CPA 2026.2"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium transition-all"
                      />
                      <p className="text-[11px] text-slate-400 italic">
                        O título digitado aqui é atualizado automaticamente no cabeçalho do assistente.
                      </p>
                    </div>

                    {/* Campo 2: Descrição */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        Descrição / Apresentação Institucional
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Descreva os objetivos do formulário e orientações para os participantes..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium transition-all"
                      />
                    </div>

                    {/* Campo 3: Campus (Seletor com lista de todos os campi do IFCE) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#006837]" />
                        <span>Campus do IFCE</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formCampus}
                        onChange={(e) => setFormCampus(e.target.value)}
                        className="w-full h-11 px-3.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-semibold text-slate-800 transition-all cursor-pointer"
                      >
                        {IFCE_CAMPUSES.map((campusName) => (
                          <option key={campusName} value={campusName}>
                            {campusName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 2 — PERGUNTAS GERAIS */}
              {wizardStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-[#006837]" />
                        Perguntas Gerais
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Estas perguntas serão exibidas para todos os participantes da avaliação.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddGeneralQuestion}
                      className="px-3.5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Pergunta Geral</span>
                    </button>
                  </div>

                  {/* Informational Alert Box */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                    <Info className="w-4 h-4 text-[#006837] shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                      Todas as perguntas criadas nesta etapa são classificadas automaticamente como <strong>"Todos"</strong> e serão aplicadas sem distinção de público.
                    </p>
                  </div>

                  {/* Questions List (Filtered for 'todos') */}
                  {formQuestions.filter((q) => q.audiences.includes('todos')).length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/50">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">Nenhuma pergunta geral cadastrada</p>
                        <p className="text-[11px] text-slate-400">Clique no botão acima para adicionar a primeira pergunta aberta a todos os segmentos.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddGeneralQuestion}
                        className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Pergunta</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {formQuestions
                        .filter((q) => q.audiences.includes('todos'))
                        .map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-[#006837]/40 transition-all space-y-3"
                          >
                            {/* Question Header Row */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-[#006837] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                  {qIdx + 1}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                                  Público: Todos
                                </span>
                              </div>

                              {/* Order & Remove Actions */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveWizardQuestion(q.id, 'up')}
                                  disabled={qIdx === 0}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
                                  title="Mover para cima"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveWizardQuestion(q.id, 'down')}
                                  disabled={qIdx === formQuestions.filter((item) => item.audiences.includes('todos')).length - 1}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
                                  title="Mover para baixo"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveWizardQuestion(q.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Excluir pergunta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Enunciado da Pergunta */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-700">Enunciado da Pergunta</label>
                              <input
                                type="text"
                                value={q.title}
                                onChange={(e) => handleUpdateWizardQuestionField(q.id, 'title', e.target.value)}
                                placeholder="Ex: Como você avalia a infraestrutura física dos laboratórios do campus?"
                                className="w-full h-10 px-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                              />
                            </div>

                            {/* Tipo, Categoria e Obrigatoriedade */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Tipo de Pergunta</label>
                                <select
                                  value={q.type}
                                  onChange={(e) => handleUpdateWizardQuestionField(q.id, 'type', e.target.value as any)}
                                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                >
                                  <option value="SCALE">Escala CPA (Ótimo, Regular, Ruim...)</option>
                                  <option value="YES_NO">Sim / Não</option>
                                  <option value="RADIO">Múltipla Escolha (Única opção)</option>
                                  <option value="CHECKBOX">Caixa de Seleção (Múltiplas opções)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Categoria</label>
                                <select
                                  value={q.category || 'Ensino'}
                                  onChange={(e) => handleUpdateWizardQuestionField(q.id, 'category', e.target.value as any)}
                                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                >
                                  {QUESTION_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex items-center pt-5">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={q.required ?? true}
                                    onChange={(e) => handleUpdateWizardQuestionField(q.id, 'required', e.target.checked)}
                                    className="accent-[#006837] w-4 h-4 cursor-pointer"
                                  />
                                  <span>Resposta Obrigatória</span>
                                </label>
                              </div>
                            </div>

                            {/* Alternativas Padrão para Escala CPA */}
                            {q.type === 'SCALE' && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Alternativas Padrão da Escala CPA:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'].map((opt) => (
                                    <span
                                      key={opt}
                                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold shadow-2xs"
                                    >
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Alternativas para Sim / Não */}
                            {q.type === 'YES_NO' && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Opções de Resposta:
                                </span>
                                <div className="flex gap-2">
                                  <span className="px-3 py-1 rounded-lg bg-emerald-100 text-[#006837] text-xs font-bold">Sim</span>
                                  <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold">Não</span>
                                </div>
                              </div>
                            )}

                            {/* Opções Editáveis para RADIO e CHECKBOX */}
                            {['RADIO', 'CHECKBOX'].includes(q.type) && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Opções da Pergunta:
                                </span>
                                <div className="space-y-1.5">
                                  {(q.options || ['Opção 1', 'Opção 2']).map((opt, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => handleUpdateQuestionOption(q.id, oIdx, e.target.value)}
                                        className="flex-1 h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveQuestionOption(q.id, oIdx)}
                                        className="text-slate-400 hover:text-rose-600 p-1"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => handleAddQuestionOption(q.id)}
                                    className="text-xs font-bold text-[#006837] hover:underline pt-1 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Adicionar mais uma opção</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 3 — ESCOLHA DO SEGMENTO */}
              {wizardStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#006837]" />
                      Segmentos Específicos
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Agora selecione qual segmento deseja configurar.
                    </p>
                  </div>

                  {/* 3 CARDS GRANDES DE SEGMENTO */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* CARD 1: DISCENTES */}
                    {(() => {
                      const qCount = formQuestions.filter((q) => q.audiences.includes('alunos') && !q.audiences.includes('todos')).length;
                      const isDone = qCount > 0 || completedSegments.includes('alunos');

                      return (
                        <div
                          onClick={() => {
                            setSelectedSegment('alunos');
                            setWizardStep(4);
                          }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                            selectedSegment === 'alunos'
                              ? 'border-[#006837] bg-emerald-50/50 shadow-md ring-2 ring-[#006837]/20'
                              : isDone
                              ? 'border-emerald-200 bg-white hover:border-[#006837]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                              🎓
                            </div>

                            {isDone ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#006837] text-[11px] font-extrabold flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Concluído
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                                Pendente
                              </span>
                            )}
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#006837] transition-colors">
                              Discentes
                            </h5>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Estudantes de cursos técnicos, graduação e pós-graduação.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600">
                              {qCount} {qCount === 1 ? 'pergunta' : 'perguntas'}
                            </span>
                            <span className="text-[#006837] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Configurar <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* CARD 2: DOCENTES */}
                    {(() => {
                      const qCount = formQuestions.filter((q) => q.audiences.includes('docentes') && !q.audiences.includes('todos')).length;
                      const isDone = qCount > 0 || completedSegments.includes('docentes');

                      return (
                        <div
                          onClick={() => {
                            setSelectedSegment('docentes');
                            setWizardStep(4);
                          }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                            selectedSegment === 'docentes'
                              ? 'border-[#006837] bg-emerald-50/50 shadow-md ring-2 ring-[#006837]/20'
                              : isDone
                              ? 'border-emerald-200 bg-white hover:border-[#006837]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006837] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                              👨‍🏫
                            </div>

                            {isDone ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#006837] text-[11px] font-extrabold flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Concluído
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                                Pendente
                              </span>
                            )}
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#006837] transition-colors">
                              Docentes
                            </h5>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Professores efetivos, substitutos e visitantes do IFCE.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600">
                              {qCount} {qCount === 1 ? 'pergunta' : 'perguntas'}
                            </span>
                            <span className="text-[#006837] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Configurar <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* CARD 3: TAES */}
                    {(() => {
                      const qCount = formQuestions.filter((q) => q.audiences.includes('taes') && !q.audiences.includes('todos')).length;
                      const isDone = qCount > 0 || completedSegments.includes('taes');

                      return (
                        <div
                          onClick={() => {
                            setSelectedSegment('taes');
                            setWizardStep(4);
                          }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                            selectedSegment === 'taes'
                              ? 'border-[#006837] bg-emerald-50/50 shadow-md ring-2 ring-[#006837]/20'
                              : isDone
                              ? 'border-emerald-200 bg-white hover:border-[#006837]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                              👨‍💼
                            </div>

                            {isDone ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#006837] text-[11px] font-extrabold flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Concluído
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                                Pendente
                              </span>
                            )}
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#006837] transition-colors">
                              Técnicos Administrativos (TAEs)
                            </h5>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Corpo técnico-administrativo em educação.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600">
                              {qCount} {qCount === 1 ? 'pergunta' : 'perguntas'}
                            </span>
                            <span className="text-[#006837] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Configurar <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <p className="text-xs text-slate-500 text-center italic">
                    Ao selecionar um segmento acima, você será direcionado para cadastrar as perguntas exclusivas desse grupo.
                  </p>
                </div>
              )}

              {/* ETAPA 4 — PERGUNTAS DO SEGMENTO */}
              {wizardStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Destaque do Segmento em Configuração */}
                  <div className="p-4 rounded-2xl bg-[#006837] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                        {selectedSegment === 'alunos'
                          ? '🎓'
                          : selectedSegment === 'docentes'
                          ? '👨‍🏫'
                          : '👨‍💼'}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-200">
                          Segmento em Configuração
                        </span>
                        <h4 className="text-base font-bold">
                          {selectedSegment === 'alunos'
                            ? 'Perguntas para Discentes'
                            : selectedSegment === 'docentes'
                            ? 'Perguntas para Docentes'
                            : 'Perguntas para Técnicos Administrativos (TAEs)'}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddSegmentQuestion(selectedSegment)}
                        className="px-3.5 py-2 bg-white text-[#006837] hover:bg-emerald-50 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Pergunta</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleChooseNextSegment}
                        className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl border border-emerald-400/30 transition-all cursor-pointer"
                        title="Salvar segmento e voltar para escolha de segmentos"
                      >
                        <span>Escolher próximo segmento</span>
                      </button>
                    </div>
                  </div>

                  {/* Filtered questions list for selectedSegment */}
                  {formQuestions.filter((q) => q.audiences.includes(selectedSegment) && !q.audiences.includes('todos')).length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/50">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          Nenhuma pergunta específica cadastrada para {selectedSegment === 'alunos' ? 'Discentes' : selectedSegment === 'docentes' ? 'Docentes' : 'TAEs'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Estas perguntas serão exibidas somente no questionário deste segmento.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddSegmentQuestion(selectedSegment)}
                        className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Primeira Pergunta</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {formQuestions
                        .filter((q) => q.audiences.includes(selectedSegment) && !q.audiences.includes('todos'))
                        .map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-[#006837]/40 transition-all space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-[#006837] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                  {qIdx + 1}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#006837] text-[10px] font-bold uppercase">
                                  Público: {selectedSegment === 'alunos' ? 'Discentes' : selectedSegment === 'docentes' ? 'Docentes' : 'TAEs'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveWizardQuestion(q.id, 'up')}
                                  disabled={qIdx === 0}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
                                  title="Mover para cima"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveWizardQuestion(q.id, 'down')}
                                  disabled={qIdx === formQuestions.filter((item) => item.audiences.includes(selectedSegment) && !item.audiences.includes('todos')).length - 1}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
                                  title="Mover para baixo"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveWizardQuestion(q.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Excluir pergunta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-700">Enunciado da Pergunta</label>
                              <input
                                type="text"
                                value={q.title}
                                onChange={(e) => handleUpdateWizardQuestionField(q.id, 'title', e.target.value)}
                                placeholder="Digite a pergunta específica..."
                                className="w-full h-10 px-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Tipo de Pergunta</label>
                                <select
                                  value={q.type}
                                  onChange={(e) => handleUpdateWizardQuestionField(q.id, 'type', e.target.value as any)}
                                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                >
                                  <option value="SCALE">Escala CPA (Ótimo, Regular, Ruim...)</option>
                                  <option value="YES_NO">Sim / Não</option>
                                  <option value="RADIO">Múltipla Escolha (Única opção)</option>
                                  <option value="CHECKBOX">Caixa de Seleção (Múltiplas opções)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Categoria</label>
                                <select
                                  value={q.category || 'Ensino'}
                                  onChange={(e) => handleUpdateWizardQuestionField(q.id, 'category', e.target.value as any)}
                                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                >
                                  {QUESTION_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex items-center pt-5">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={q.required ?? true}
                                    onChange={(e) => handleUpdateWizardQuestionField(q.id, 'required', e.target.checked)}
                                    className="accent-[#006837] w-4 h-4 cursor-pointer"
                                  />
                                  <span>Resposta Obrigatória</span>
                                </label>
                              </div>
                            </div>

                            {q.type === 'SCALE' && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Alternativas Padrão da Escala CPA:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'].map((opt) => (
                                    <span
                                      key={opt}
                                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold shadow-2xs"
                                    >
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {q.type === 'YES_NO' && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Opções de Resposta:
                                </span>
                                <div className="flex gap-2">
                                  <span className="px-3 py-1 rounded-lg bg-emerald-100 text-[#006837] text-xs font-bold">Sim</span>
                                  <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold">Não</span>
                                </div>
                              </div>
                            )}

                            {['RADIO', 'CHECKBOX'].includes(q.type) && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Opções da Pergunta:
                                </span>
                                <div className="space-y-1.5">
                                  {(q.options || ['Opção 1', 'Opção 2']).map((opt, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => handleUpdateQuestionOption(q.id, oIdx, e.target.value)}
                                        className="flex-1 h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveQuestionOption(q.id, oIdx)}
                                        className="text-slate-400 hover:text-rose-600 p-1"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => handleAddQuestionOption(q.id)}
                                    className="text-xs font-bold text-[#006837] hover:underline pt-1 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Adicionar mais uma opção</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 5 — REVISÃO E FINALIZAÇÃO */}
              {wizardStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#006837]" />
                      Revisão e Finalização
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Confira o resumo completo do formulário antes de publicar.
                    </p>
                  </div>

                  {/* Card Ficha Resumo */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-[#006837] text-[10px] font-bold">
                        {formCampus}
                      </span>
                      <h5 className="text-base font-bold text-slate-900">
                        {formTitle.trim() ? formTitle : 'Novo Formulário sem título'}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {formDescription.trim() ? formDescription : 'Sem descrição cadastrada.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Período Letivo:</span>
                        <span className="font-bold text-slate-800">{formPeriodo}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Categoria:</span>
                        <span className="font-bold text-slate-800">{formCategory}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Total de Questões:</span>
                        <span className="font-bold text-[#006837]">{formQuestions.length} perguntas</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Anonimato:</span>
                        <span className="font-bold text-emerald-700">
                          {formAnonymous ? 'Garantido (SINAES)' : 'Desativado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resumo Quantitativo de Perguntas por Segmento */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-800">
                      Distribuição do Questionário por Público
                    </h5>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Gerais */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Perguntas Gerais</span>
                        <p className="text-lg font-black text-slate-900">
                          {formQuestions.filter((q) => q.audiences.includes('todos')).length}
                        </p>
                        <span className="text-[10px] text-slate-400">Todos os Públicos</span>
                      </div>

                      {/* Discentes */}
                      <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase">Discentes</span>
                        <p className="text-lg font-black text-indigo-950">
                          {formQuestions.filter((q) => q.audiences.includes('alunos') && !q.audiences.includes('todos')).length}
                        </p>
                        <span className="text-[10px] text-indigo-600">Exclusivas Alunos</span>
                      </div>

                      {/* Docentes */}
                      <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                        <span className="text-[10px] font-bold text-[#006837] uppercase">Docentes</span>
                        <p className="text-lg font-black text-emerald-950">
                          {formQuestions.filter((q) => q.audiences.includes('docentes') && !q.audiences.includes('todos')).length}
                        </p>
                        <span className="text-[10px] text-[#006837]">Exclusivas Professores</span>
                      </div>

                      {/* TAEs */}
                      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 uppercase">Técnicos (TAEs)</span>
                        <p className="text-lg font-black text-amber-950">
                          {formQuestions.filter((q) => q.audiences.includes('taes') && !q.audiences.includes('todos')).length}
                        </p>
                        <span className="text-[10px] text-amber-700">Exclusivas Servidores</span>
                      </div>
                    </div>
                  </div>

                  {/* Escolha do Status de Publicação */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      Status Inicial do Formulário
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        onClick={() => setPublishStatus('Ativo')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          publishStatus === 'Ativo'
                            ? 'border-[#006837] bg-emerald-50/80 text-emerald-950 font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="publishStatus"
                          checked={publishStatus === 'Ativo'}
                          onChange={() => setPublishStatus('Ativo')}
                          className="accent-[#006837] w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold">🟢 Publicar como Ativo</p>
                          <p className="text-[10px] text-slate-500 font-normal">
                            Disponível para receber respostas da comunidade.
                          </p>
                        </div>
                      </label>

                      <label
                        onClick={() => setPublishStatus('Rascunho')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          publishStatus === 'Rascunho'
                            ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="publishStatus"
                          checked={publishStatus === 'Rascunho'}
                          onChange={() => setPublishStatus('Rascunho')}
                          className="accent-amber-600 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold">🟡 Manter em Rascunho</p>
                          <p className="text-[10px] text-slate-500 font-normal">
                            Permanece salvo para edições posteriores.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RODAPÉ DO WIZARD (TODAS AS ETAPAS POSSUEM) */}
            <div className="bg-slate-50 border-t border-slate-200/80 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
              {/* Esquerda: Cancelar */}
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              {/* Direita: Voltar, Salvar progresso, Seguinte / Finalizar */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Botão Voltar (Desabilitado na Etapa 1) */}
                <button
                  type="button"
                  disabled={wizardStep === 1}
                  onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    wizardStep === 1
                      ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200 bg-slate-100'
                      : 'text-slate-700 border-slate-300 bg-white hover:bg-slate-100'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>

                {/* Botão Salvar Progresso (Permanece como Rascunho) */}
                <button
                  type="button"
                  onClick={handleSaveProgressDraft}
                  className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200/80 border border-emerald-300/80 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Salvar como Rascunho para continuar depois"
                >
                  <Save className="w-3.5 h-3.5 text-[#006837]" />
                  <span>Salvar progresso</span>
                </button>

                {/* Botão Seguinte / Finalizar */}
                {wizardStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((prev) => Math.min(5, prev + 1))}
                    className="px-5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Seguinte</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalizeForm}
                    className="px-5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finalizar Formulário</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Participant Responder Experience ("Visão do Participante") */}
      {respondingForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#006837]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Preenchimento Inteligente do Formulário
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Simulação do participante no IFCE Campus Tauá
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRespondingForm(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Select Segment */}
            {!participantSegment ? (
              <div className="space-y-6 py-2">
                <div className="text-center space-y-2">
                  <h4 className="text-base font-bold text-slate-800">
                    Selecione o seu segmento no IFCE
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    O formulário apresentará instantaneamente apenas as perguntas vinculadas ao seu público.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Aluno Button */}
                  <button
                    onClick={() => setParticipantSegment('alunos')}
                    className="p-5 rounded-2xl border-2 border-indigo-100 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer group text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-900">Sou Aluno(a)</p>
                      <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Discente</p>
                    </div>
                  </button>

                  {/* Docente Button */}
                  <button
                    onClick={() => setParticipantSegment('docentes')}
                    className="p-5 rounded-2xl border-2 border-emerald-100 hover:border-[#006837] bg-emerald-50/40 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer group text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006837] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-950">Sou Docente</p>
                      <p className="text-[11px] text-[#006837] font-medium mt-0.5">Professor(a)</p>
                    </div>
                  </button>

                  {/* TAE Button */}
                  <button
                    onClick={() => setParticipantSegment('taes')}
                    className="p-5 rounded-2xl border-2 border-amber-100 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50 transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer group text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-950">Sou TAE</p>
                      <p className="text-[11px] text-amber-700 font-medium mt-0.5">Técnico Admin.</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : responseSubmitted ? (
              /* Success Confirmation */
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#006837] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-800">Obrigado pela sua participação!</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Sua resposta para o formulário "{respondingForm.title}" foi registrada com sucesso pela CPA do IFCE Campus Tauá.
                  </p>
                </div>
                <button
                  onClick={() => setRespondingForm(null)}
                  className="px-5 py-2.5 bg-[#006837] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            ) : (
              /* Step 2: Answer Filtered Questions */
              <form onSubmit={handleSubmitParticipantResponse} className="space-y-6">
                {/* Active Segment Banner */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                    <span className="font-bold">Segmento Ativo:</span>
                    <span className="px-2 py-0.5 rounded-md bg-white text-[#006837] font-bold shadow-2xs uppercase">
                      {participantSegment === 'alunos'
                        ? 'Aluno (Discente)'
                        : participantSegment === 'docentes'
                        ? 'Docente (Professor)'
                        : 'Técnico Administrativo (TAE)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setParticipantSegment(null)}
                    className="text-xs text-[#006837] underline font-semibold cursor-pointer"
                  >
                    Alterar
                  </button>
                </div>

                {/* Info Note: How Filtering Helped */}
                <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  💡 <strong>Filtro Inteligente Ativado:</strong> Exibindo apenas as{' '}
                  {getFilteredQuestionsForParticipant().length} perguntas destinadas a "Todos" ou ao
                  público {participantSegment.toUpperCase()}. As perguntas dos outros públicos não aparecem para você!
                </p>

                {/* Filtered Questions List */}
                <div className="space-y-6 max-h-96 overflow-y-auto pr-1">
                  {getFilteredQuestionsForParticipant().map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-[#006837] text-xs mt-0.5">#{idx + 1}</span>
                        <div className="space-y-0.5 flex-1">
                          <p className="text-xs font-bold text-slate-800 leading-relaxed">
                            {q.title} {q.required && <span className="text-rose-500">*</span>}
                          </p>
                          {q.description && (
                            <p className="text-[11px] text-slate-500 font-normal">
                              {q.description}
                            </p>
                          )}
                          {q.category && (
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 mt-0.5">
                              {q.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Scale Question (1 to 5) */}
                      {q.type === 'SCALE' && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                            <span>1 - Discordo Totalmente</span>
                            <span>5 - Concordo Totalmente</span>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                type="button"
                                key={num}
                                onClick={() =>
                                  setParticipantAnswers({
                                    ...participantAnswers,
                                    [q.id]: String(num),
                                  })
                                }
                                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  participantAnswers[q.id] === String(num)
                                    ? 'bg-[#006837] text-white shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Yes/No Question */}
                      {q.type === 'YES_NO' && (
                        <div className="flex items-center gap-3 pt-1">
                          {['Sim', 'Não'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setParticipantAnswers({
                                  ...participantAnswers,
                                  [q.id]: opt,
                                })
                              }
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                participantAnswers[q.id] === opt
                                  ? 'bg-[#006837] text-white border-[#006837] shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Radio Question (Multiple Choice Single) */}
                      {q.type === 'RADIO' && (
                        <div className="space-y-2 pt-1">
                          {(q.options && q.options.length > 0
                            ? q.options
                            : ['Excelente', 'Bom', 'Regular', 'Ruim']
                          ).map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-medium cursor-pointer hover:border-[#006837]"
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={participantAnswers[q.id] === opt}
                                onChange={() =>
                                  setParticipantAnswers({
                                    ...participantAnswers,
                                    [q.id]: opt,
                                  })
                                }
                                className="accent-[#006837]"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Checkbox Question (Multiple Choice Multi) */}
                      {q.type === 'CHECKBOX' && (
                        <div className="space-y-2 pt-1">
                          {(q.options && q.options.length > 0
                            ? q.options
                            : ['Opção 1', 'Opção 2', 'Opção 3']
                          ).map((opt, oIdx) => {
                            const currentList = Array.isArray(participantAnswers[q.id])
                              ? (participantAnswers[q.id] as string[])
                              : [];
                            const isChecked = currentList.includes(opt);
                            return (
                              <label
                                key={oIdx}
                                className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-medium cursor-pointer hover:border-[#006837]"
                              >
                                <input
                                  type="checkbox"
                                  value={opt}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setParticipantAnswers({
                                        ...participantAnswers,
                                        [q.id]: [...currentList, opt],
                                      });
                                    } else {
                                      setParticipantAnswers({
                                        ...participantAnswers,
                                        [q.id]: currentList.filter((item) => item !== opt),
                                      });
                                    }
                                  }}
                                  className="accent-[#006837]"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Dropdown Question */}
                      {q.type === 'DROPDOWN' && (
                        <select
                          value={(participantAnswers[q.id] as string) || ''}
                          onChange={(e) =>
                            setParticipantAnswers({
                              ...participantAnswers,
                              [q.id]: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                        >
                          <option value="">-- Selecione uma opção --</option>
                          {(q.options && q.options.length > 0
                            ? q.options
                            : ['Opção 1', 'Opção 2', 'Opção 3']
                          ).map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRespondingForm(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingResponse}
                    className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    {isSubmittingResponse ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Resposta</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: View Metrics by Target Audience Segment */}
      {viewingMetricsForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#006837]" />
                <h3 className="text-base font-bold text-slate-900">
                  Métricas por Público-Alvo • CPA Tauá
                </h3>
              </div>
              <button
                onClick={() => setViewingMetricsForm(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">{viewingMetricsForm.title}</h4>

              {/* Stat summary cards */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Total</p>
                  <p className="text-base font-bold text-slate-900">
                    {viewingMetricsForm.responsesCount.total}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-indigo-600 font-semibold uppercase">Alunos</p>
                  <p className="text-base font-bold text-indigo-900">
                    {viewingMetricsForm.responsesCount.alunos}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-700 font-semibold uppercase">Docentes</p>
                  <p className="text-base font-bold text-emerald-900">
                    {viewingMetricsForm.responsesCount.docentes}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-semibold uppercase">TAEs</p>
                  <p className="text-base font-bold text-amber-900">
                    {viewingMetricsForm.responsesCount.taes}
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Distribuição de Perguntas por Público
                </h5>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {viewingMetricsForm.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between gap-3"
                    >
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        #{idx + 1}. {q.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {q.audiences.includes('todos') ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Todos
                          </span>
                        ) : (
                          q.audiences.map((aud) => (
                            <span
                              key={aud}
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                aud === 'alunos'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : aud === 'docentes'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {aud === 'alunos' ? 'Alunos' : aud === 'docentes' ? 'Docentes' : 'TAEs'}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewingMetricsForm(null)}
                className="px-5 py-2 bg-[#006837] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Confirmation Dialog */}
      {deletingForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Excluir Formulário</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tem certeza de que deseja excluir o formulário{' '}
                  <strong className="text-slate-800">"{deletingForm.title}"</strong>? Esta ação
                  não poderá ser desfeita.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingForm(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteForm}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
              >
                Excluir Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Importar Formulário do Google Drive */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-[#006837]">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Importar Formulário do Google Drive</h3>
                  <p className="text-xs text-slate-500">
                    Selecione um formulário do Google Forms para importar título, descrição e todas as perguntas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sync Drive status & Refresh button */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Integração Google Drive Ativa
                </span>
                <p className="text-[11px] text-slate-500">
                  Importação automática de Título, Descrição, Perguntas, Alternativas e Obrigatoriedade.
                </p>
              </div>

              <button
                onClick={handleFetchDriveForms}
                disabled={isFetchingDriveForms}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#006837] ${isFetchingDriveForms ? 'animate-spin' : ''}`} />
                <span>{isFetchingDriveForms ? 'Sincronizando...' : 'Sincronizar Google Drive'}</span>
              </button>
            </div>

            {/* Search Input for Importable Forms */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome do formulário..."
                value={importSearchTerm}
                onChange={(e) => setImportSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837]"
              />
            </div>

            {/* Available Forms List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Formulários Disponíveis no Google Forms
              </p>

              {MOCK_DRIVE_FORMS.filter((f) =>
                f.name.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
                f.description.toLowerCase().includes(importSearchTerm.toLowerCase())
              ).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#006837] transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#006837] border border-emerald-200">
                        {item.questionsCount} Perguntas
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> Modificado em: {item.modifiedTime}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleImportForm(item)}
                    className="px-4 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                  >
                    <span>Importar & Classificar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Após importar, a tela <strong className="text-slate-800">Classificação das Perguntas</strong> será aberta automaticamente.
              </span>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Criar e Configurar Campanha de Avaliação (Envio - Wizard de 5 Etapas) */}
      {campaignModalForm && (
        <SendCampaignWizardModal
          form={campaignModalForm}
          onClose={() => setCampaignModalForm(null)}
          onLaunchCampaign={(newCampaign) => {
            setCampaignsList((prev) => [newCampaign, ...prev]);
            setCampaignModalForm(null);
            showNotification(
              'success',
              `Campanha "${newCampaign.title}" criada e enviada com sucesso!`
            );
          }}
          onSaveProgressDraft={(draftCampaign) => {
            setCampaignsList((prev) => [draftCampaign, ...prev]);
            showNotification(
              'info',
              `Rascunho da campanha "${draftCampaign.title}" salvo com sucesso!`
            );
          }}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};
