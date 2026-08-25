import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  Globe,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  Eye,
  GraduationCap,
  Building2,
  BookOpen,
  Headphones,
  Award,
  Layers,
  RefreshCw,
  Info,
  X,
  Share2,
  SlidersHorizontal,
  FolderOpen,
} from 'lucide-react';
import { NavTabId } from './Sidebar';
import { SmartForm, Participant } from '../types';
import { INITIAL_SMART_FORMS } from '../data/formsData';
import { INITIAL_PARTICIPANTS } from '../data/participantsData';
import { buildReportsFromSmartForms } from '../utils/reportConverter';
import { DashboardKpiCards } from '../features/dashboard/components/DashboardKpiCards';
import { ActiveCampaignCard } from '../features/dashboard/components/ActiveCampaignCard';
import { SegmentParticipationCard } from '../features/dashboard/components/SegmentParticipationCard';
import { AreaPerformanceCard } from '../features/dashboard/components/AreaPerformanceCard';
import { SecondaryInfoCards } from '../features/dashboard/components/SecondaryInfoCards';
import { AreaDetailModal } from '../features/dashboard/components/AreaDetailModal';
import { CampaignQuickDetailModal } from '../features/dashboard/components/CampaignQuickDetailModal';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTabId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  // 1. Data States (synchronized with localStorage)
  const [smartForms, setSmartForms] = useState<SmartForm[]>(() => {
    try {
      const saved = localStorage.getItem('cpa_smart_forms');
      return saved ? JSON.parse(saved) : INITIAL_SMART_FORMS;
    } catch {
      return INITIAL_SMART_FORMS;
    }
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem('cpa_participants');
      return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  const [lastUpdateTime, setLastUpdateTime] = useState<string>(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `hoje às ${hours}:${minutes}`;
  });

  // Secondary Collapsible Cards State (can be toggled individually)
  const [openSecondary, setOpenSecondary] = useState<Record<string, boolean>>({
    syncGoogleForms: false,
    historicoQuestionarios: false,
    calendarioCpa: false,
  });

  // Selected Detail Modal/Slide-over (for in-dashboard drill-down without navigating away)
  const [selectedAreaDetail, setSelectedAreaDetail] = useState<{
    name: string;
    icon: any;
    status: string;
    percentage: string;
    description?: string;
    dimensionKey?: string;
  } | null>(null);

  const [selectedCampaignDetail, setSelectedCampaignDetail] = useState<SmartForm | null>(null);

  // Real-time synchronization
  useEffect(() => {
    const syncData = () => {
      try {
        const savedForms = localStorage.getItem('cpa_smart_forms');
        if (savedForms) setSmartForms(JSON.parse(savedForms));

        const savedParticipants = localStorage.getItem('cpa_participants');
        if (savedParticipants) setParticipants(JSON.parse(savedParticipants));

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setLastUpdateTime(`hoje às ${hours}:${minutes}`);
      } catch (e) {
        console.error('Error syncing dashboard data', e);
      }
    };

    const handleFormsUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setSmartForms(e.detail);
      } else {
        syncData();
      }
    };

    window.addEventListener('cpa_forms_updated', handleFormsUpdated);
    window.addEventListener('cpa_participants_updated', syncData);
    window.addEventListener('storage', syncData);
    window.addEventListener('focus', syncData);

    return () => {
      window.removeEventListener('cpa_forms_updated', handleFormsUpdated);
      window.removeEventListener('cpa_participants_updated', syncData);
      window.removeEventListener('storage', syncData);
      window.removeEventListener('focus', syncData);
    };
  }, []);

  // 2. Computed Metrics & Stats
  const activeForms = useMemo(() => {
    return smartForms.filter((f) => {
      const status = String(f.status || '').toLowerCase();
      return status === 'ativa' || status === 'ativo' || status === 'em andamento';
    });
  }, [smartForms]);

  const draftForms = useMemo(() => {
    return smartForms.filter((f) => {
      const status = String(f.status || '').toLowerCase();
      return status.includes('rascunho') || status.includes('planej') || status.includes('pendente');
    });
  }, [smartForms]);

  const finishedForms = useMemo(() => {
    return smartForms.filter((f) => {
      const status = String(f.status || '').toLowerCase();
      return status.includes('encerrad') || status.includes('finalizad') || status.includes('concluíd');
    });
  }, [smartForms]);

  const activeCampaign = useMemo(() => {
    return activeForms.length > 0 ? activeForms[0] : null;
  }, [activeForms]);

  // Aggregated Responses Counts
  const totalResponses = useMemo(() => {
    return smartForms.reduce((acc, f) => acc + (f.responsesCount?.total || 0), 0);
  }, [smartForms]);

  const discentesResponses = useMemo(() => {
    return smartForms.reduce((acc, f) => acc + (f.responsesCount?.alunos || 0), 0);
  }, [smartForms]);

  const docentesResponses = useMemo(() => {
    return smartForms.reduce((acc, f) => acc + (f.responsesCount?.docentes || 0), 0);
  }, [smartForms]);

  const taesResponses = useMemo(() => {
    return smartForms.reduce((acc, f) => acc + (f.responsesCount?.taes || 0), 0);
  }, [smartForms]);

  // Universe estimates from participants
  const discentesUniverse = useMemo(() => {
    const count = participants.filter((p) => p.segment === 'discente').length;
    return count > 0 ? count : 1200;
  }, [participants]);

  const docentesUniverse = useMemo(() => {
    const count = participants.filter((p) => p.segment === 'docente').length;
    return count > 0 ? count : 80;
  }, [participants]);

  const taesUniverse = useMemo(() => {
    const count = participants.filter((p) => p.segment === 'tae').length;
    return count > 0 ? count : 50;
  }, [participants]);

  const totalUniverse = discentesUniverse + docentesUniverse + taesUniverse;

  // Participation Rates (%)
  const overallParticipationRate = useMemo(() => {
    if (totalResponses === 0) return 0;
    return Math.min(100, Math.round((totalResponses / totalUniverse) * 100));
  }, [totalResponses, totalUniverse]);

  const discentesRate = useMemo(() => {
    if (discentesResponses === 0) return 0;
    return Math.min(100, Math.round((discentesResponses / discentesUniverse) * 100));
  }, [discentesResponses, discentesUniverse]);

  const docentesRate = useMemo(() => {
    if (docentesResponses === 0) return 0;
    return Math.min(100, Math.round((docentesResponses / docentesUniverse) * 100));
  }, [docentesResponses, docentesUniverse]);

  const taesRate = useMemo(() => {
    if (taesResponses === 0) return 0;
    return Math.min(100, Math.round((taesResponses / taesUniverse) * 100));
  }, [taesResponses, taesUniverse]);

  // Active Campaign Specific Stats
  const activeCampaignResponses = activeCampaign?.responsesCount?.total || 0;
  const activeCampaignRate = useMemo(() => {
    if (!activeCampaign || activeCampaignResponses === 0) return '0%';
    const rate = Math.min(100, Math.round((activeCampaignResponses / totalUniverse) * 100));
    return `${rate}%`;
  }, [activeCampaign, activeCampaignResponses, totalUniverse]);

  // Evaluated Areas and Results Breakdown (5 core CPA dimensions)
  const evaluatedAreas = useMemo(() => {
    const baseAreas = [
      {
        name: 'Ensino & Aprendizagem',
        shortName: 'Ensino',
        icon: GraduationCap,
        categoryKey: 'Ensino',
        desc: 'Avaliação dos cursos, metodologias docentes e práticas pedagógicas.',
      },
      {
        name: 'Infraestrutura Física',
        shortName: 'Infraestrutura',
        icon: Building2,
        categoryKey: 'Infraestrutura',
        desc: 'Salas de aula, laboratórios especializados, climatização e acessibilidade.',
      },
      {
        name: 'Biblioteca & Acervo',
        shortName: 'Biblioteca',
        icon: BookOpen,
        categoryKey: 'Biblioteca',
        desc: 'Espaços de estudo individual e coletivo, acervo físico e digital.',
      },
      {
        name: 'Atendimento & Apoio ao Estudante',
        shortName: 'Atendimento',
        icon: Headphones,
        categoryKey: 'Comunicação',
        desc: 'Secretaria acadêmica, suporte pedagógico e serviços de assistência.',
      },
      {
        name: 'Gestão Institucional & Planejamento',
        shortName: 'Gestão',
        icon: Award,
        categoryKey: 'Gestão',
        desc: 'Transparência, comunicação interna e processos decisórios da direção.',
      },
    ];

    if (totalResponses === 0) {
      return baseAreas.map((area) => ({
        name: area.name,
        shortName: area.shortName,
        icon: area.icon,
        categoryKey: area.categoryKey,
        desc: area.desc,
        status: 'SEM RESPOSTAS' as const,
        percentage: '0%',
        potPct: 0,
        medPct: 0,
        fragPct: 0,
      }));
    }

    const reportCampaigns = buildReportsFromSmartForms(smartForms);
    const activeReport = reportCampaigns.find((r) => r.id === activeCampaign?.id) || reportCampaigns[0];

    return baseAreas.map((area) => {
      const dim = activeReport?.dimensions?.find(
        (d) =>
          d.dimension.toLowerCase().includes(area.shortName.toLowerCase()) ||
          d.dimension.toLowerCase().includes(area.categoryKey.toLowerCase())
      );

      if (!dim || activeReport.totalResponses === 0) {
        return {
          name: area.name,
          shortName: area.shortName,
          icon: area.icon,
          categoryKey: area.categoryKey,
          desc: area.desc,
          status: 'SEM RESPOSTAS' as const,
          percentage: '0%',
          potPct: 0,
          medPct: 0,
          fragPct: 0,
        };
      }

      let status: 'POTENCIALIDADE' | 'AVALIAÇÃO MEDIANA' | 'FRAGILIDADE' | 'SEM RESPOSTAS' = 'SEM RESPOSTAS';
      if (dim.potencialidadePct >= 60) {
        status = 'POTENCIALIDADE';
      } else if (dim.fragilidadePct >= 40) {
        status = 'FRAGILIDADE';
      } else {
        status = 'AVALIAÇÃO MEDIANA';
      }

      return {
        name: area.name,
        shortName: area.shortName,
        icon: area.icon,
        categoryKey: area.categoryKey,
        desc: area.desc,
        status,
        percentage: `${dim.potencialidadePct}%`,
        potPct: dim.potencialidadePct || 0,
        medPct: dim.medianaPct || 0,
        fragPct: dim.fragilidadePct || 0,
      };
    });
  }, [totalResponses, smartForms, activeCampaign]);

  // Situação Geral (Potencialidades, Medianas, Fragilidades)
  const situacaoGeral = useMemo(() => {
    if (totalResponses === 0) {
      return { potencialidades: 0, medianas: 0, fragilidades: 0, semRespostas: 5 };
    }

    let pot = 0;
    let med = 0;
    let frag = 0;
    let sem = 0;

    evaluatedAreas.forEach((area) => {
      if (area.status === 'POTENCIALIDADE') pot++;
      else if (area.status === 'AVALIAÇÃO MEDIANA') med++;
      else if (area.status === 'FRAGILIDADE') frag++;
      else sem++;
    });

    return { potencialidades: pot, medianas: med, fragilidades: frag, semRespostas: sem };
  }, [totalResponses, evaluatedAreas]);

  // Toggle secondary section
  const toggleSecondary = (key: string) => {
    setOpenSecondary((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full max-w-[96%] 2xl:max-w-[1440px] mx-auto px-2 sm:px-4 py-4 space-y-4 select-none">

      <div
        id="dashboard-header"
        className="bg-white border border-slate-200/90 rounded-xl px-4 py-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100/90 text-[#006837] rounded-lg shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Visão geral da CPA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="bg-emerald-50 text-[#006837] text-xs font-extrabold px-3 py-1.5 rounded-lg border border-emerald-200/80 flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#006837] animate-pulse" />
            CPA • Campus Tauá
          </span>
        </div>
      </div>

      <DashboardKpiCards
        activeFormsCount={activeForms.length}
        totalResponses={totalResponses}
        overallParticipationRate={overallParticipationRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* BLOCO ESQUERDO (7 colunas): CAMPANHA EM ANDAMENTO + PARTICIPAÇÃO DOS SEGMENTOS */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          <ActiveCampaignCard
            activeCampaign={activeCampaign}
            activeCampaignResponses={activeCampaignResponses}
            activeCampaignRate={activeCampaignRate}
            setSelectedCampaignDetail={setSelectedCampaignDetail}
            onNavigateTab={onNavigateTab}
          />

          <SegmentParticipationCard
            totalResponses={totalResponses}
            totalUniverse={totalUniverse}
            discentesResponses={discentesResponses}
            discentesUniverse={discentesUniverse}
            discentesRate={discentesRate}
            docentesResponses={docentesResponses}
            docentesUniverse={docentesUniverse}
            docentesRate={docentesRate}
            taesResponses={taesResponses}
            taesUniverse={taesUniverse}
            taesRate={taesRate}
            onNavigateTab={onNavigateTab}
          />
        </div>

        {/* BLOCO DIREITO (5 colunas): DESEMPENHO POR ÁREA */}
        <div className="lg:col-span-5 flex flex-col">
          <AreaPerformanceCard
            evaluatedAreas={evaluatedAreas}
            situacaoGeral={situacaoGeral}
            setSelectedAreaDetail={setSelectedAreaDetail}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </div>


      <SecondaryInfoCards
        openSecondary={openSecondary}
        toggleSecondary={toggleSecondary}
        lastUpdateTime={lastUpdateTime}
        smartForms={smartForms}
        onNavigateTab={onNavigateTab}
      />


      <AreaDetailModal
        area={selectedAreaDetail}
        onClose={() => setSelectedAreaDetail(null)}
        onNavigateTab={onNavigateTab}
      />

      <CampaignQuickDetailModal
        campaign={selectedCampaignDetail}
        onClose={() => setSelectedCampaignDetail(null)}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
