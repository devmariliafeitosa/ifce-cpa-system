import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Eye,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  Headphones,
  Layers,
  PlusCircle,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";

import React, { useEffect, useMemo, useState } from "react";

import { INITIAL_SMART_FORMS } from "../data/formsData";
import { INITIAL_PARTICIPANTS } from "../data/participantsData";

import type { Participant, SmartForm } from "../types";

import { buildReportsFromSmartForms } from "../utils/reportConverter";

import type { NavTabId } from "./navigation/navigationTypes";

interface DashboardViewProps {
  onNavigateTab: (tab: NavTabId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
}) => {
  /*
   * ============================================================
   * 1. ESTADOS DOS DADOS
   * ============================================================
   */

  const [smartForms, setSmartForms] = useState<SmartForm[]>(() => {
    try {
      const saved = localStorage.getItem("cpa_smart_forms");

      if (!saved) {
        return INITIAL_SMART_FORMS;
      }

      const parsed = JSON.parse(saved) as SmartForm[];

      return Array.isArray(parsed)
        ? parsed
        : INITIAL_SMART_FORMS;
    } catch {
      return INITIAL_SMART_FORMS;
    }
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem("cpa_participants");

      if (!saved) {
        return INITIAL_PARTICIPANTS;
      }

      const parsed = JSON.parse(saved) as Participant[];

      return Array.isArray(parsed)
        ? parsed
        : INITIAL_PARTICIPANTS;
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  const [lastUpdateTime, setLastUpdateTime] = useState<string>(() => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");

    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `hoje às ${hours}:${minutes}`;
  });

  /*
   * Cards complementares
   */

  const [openSecondary, setOpenSecondary] = useState<Record<string, boolean>>({
    syncGoogleForms: false,
    historicoQuestionarios: false,
    calendarioCpa: false,
  });

  /*
   * Modal de detalhes da área
   */

  const [selectedAreaDetail, setSelectedAreaDetail] = useState<{
    name: string;
    icon: React.ElementType;
    status: string;
    percentage: string;
    desc?: string;
    categoryKey?: string;
  } | null>(null);

  /*
   * Modal de detalhes da campanha
   */

  const [selectedCampaignDetail, setSelectedCampaignDetail] =
    useState<SmartForm | null>(null);

  /*
   * ============================================================
   * SINCRONIZAÇÃO DOS DADOS
   * ============================================================
   */

  useEffect(() => {
    const syncData = () => {
      try {
        const savedForms = localStorage.getItem("cpa_smart_forms");

        if (savedForms) {
          setSmartForms(JSON.parse(savedForms));
        }

        const savedParticipants = localStorage.getItem("cpa_participants");

        if (savedParticipants) {
          setParticipants(JSON.parse(savedParticipants));
        }

        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");

        const minutes = String(now.getMinutes()).padStart(2, "0");

        setLastUpdateTime(`hoje às ${hours}:${minutes}`);
      } catch (error) {
        console.error("Erro ao sincronizar dados do dashboard", error);
      }
    };

    const handleFormsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<SmartForm[]>;

      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setSmartForms(customEvent.detail);
      } else {
        syncData();
      }
    };

    window.addEventListener("cpa_forms_updated", handleFormsUpdated);

    window.addEventListener("cpa_participants_updated", syncData);

    window.addEventListener("storage", syncData);

    window.addEventListener("focus", syncData);

    return () => {
      window.removeEventListener("cpa_forms_updated", handleFormsUpdated);

      window.removeEventListener("cpa_participants_updated", syncData);

      window.removeEventListener("storage", syncData);

      window.removeEventListener("focus", syncData);
    };
  }, []);

  /*
   * ============================================================
   * 2. MÉTRICAS DO DASHBOARD
   * ============================================================
   */

  const activeForms = useMemo(() => {
    return smartForms.filter((form) => {
      const status = String(form.status || "").toLowerCase();

      return (
        status === "ativa" || status === "ativo" || status === "em andamento"
      );
    });
  }, [smartForms]);

  const activeCampaign = useMemo(() => {
    return activeForms.length > 0 ? activeForms[0] : null;
  }, [activeForms]);

  /*
   * Total de respostas
   */

  const totalResponses = useMemo(() => {
    return smartForms.reduce(
      (accumulator, form) => accumulator + (form.responsesCount?.total || 0),
      0,
    );
  }, [smartForms]);

  const discentesResponses = useMemo(() => {
    return smartForms.reduce(
      (accumulator, form) => accumulator + (form.responsesCount?.alunos || 0),
      0,
    );
  }, [smartForms]);

  const docentesResponses = useMemo(() => {
    return smartForms.reduce(
      (accumulator, form) => accumulator + (form.responsesCount?.docentes || 0),
      0,
    );
  }, [smartForms]);

  const taesResponses = useMemo(() => {
    return smartForms.reduce(
      (accumulator, form) => accumulator + (form.responsesCount?.taes || 0),
      0,
    );
  }, [smartForms]);

  /*
   * Universo estimado
   */

  const discentesUniverse = useMemo(() => {
    const count = participants.filter(
      (participant) => participant.segment === "discente",
    ).length;

    return count > 0 ? count : 1200;
  }, [participants]);

  const docentesUniverse = useMemo(() => {
    const count = participants.filter(
      (participant) => participant.segment === "docente",
    ).length;

    return count > 0 ? count : 80;
  }, [participants]);

  const taesUniverse = useMemo(() => {
    const count = participants.filter(
      (participant) => participant.segment === "tae",
    ).length;

    return count > 0 ? count : 50;
  }, [participants]);

  const totalUniverse = discentesUniverse + docentesUniverse + taesUniverse;

  /*
   * Taxas de participação
   */

  const overallParticipationRate = useMemo(() => {
    if (totalResponses === 0) {
      return 0;
    }

    return Math.min(100, Math.round((totalResponses / totalUniverse) * 100));
  }, [totalResponses, totalUniverse]);

  const discentesRate = useMemo(() => {
    if (discentesResponses === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((discentesResponses / discentesUniverse) * 100),
    );
  }, [discentesResponses, discentesUniverse]);

  const docentesRate = useMemo(() => {
    if (docentesResponses === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((docentesResponses / docentesUniverse) * 100),
    );
  }, [docentesResponses, docentesUniverse]);

  const taesRate = useMemo(() => {
    if (taesResponses === 0) {
      return 0;
    }

    return Math.min(100, Math.round((taesResponses / taesUniverse) * 100));
  }, [taesResponses, taesUniverse]);

  /*
   * Métricas da campanha ativa
   */

  const activeCampaignResponses = activeCampaign?.responsesCount?.total || 0;

  const activeCampaignRate = useMemo(() => {
    if (!activeCampaign || activeCampaignResponses === 0) {
      return "0%";
    }

    const rate = Math.min(
      100,
      Math.round((activeCampaignResponses / totalUniverse) * 100),
    );

    return `${rate}%`;
  }, [activeCampaign, activeCampaignResponses, totalUniverse]);

  /*
   * ============================================================
   * ÁREAS AVALIADAS
   * ============================================================
   */

  const evaluatedAreas = useMemo(() => {
    const baseAreas = [
      {
        name: "Ensino & Aprendizagem",
        shortName: "Ensino",
        icon: GraduationCap,
        categoryKey: "Ensino",
        desc: "Avaliação dos cursos, metodologias docentes e práticas pedagógicas.",
      },
      {
        name: "Infraestrutura Física",
        shortName: "Infraestrutura",
        icon: Building2,
        categoryKey: "Infraestrutura",
        desc: "Salas de aula, laboratórios especializados, climatização e acessibilidade.",
      },
      {
        name: "Biblioteca & Acervo",
        shortName: "Biblioteca",
        icon: BookOpen,
        categoryKey: "Biblioteca",
        desc: "Espaços de estudo individual e coletivo, acervo físico e digital.",
      },
      {
        name: "Atendimento & Apoio ao Estudante",
        shortName: "Atendimento",
        icon: Headphones,
        categoryKey: "Comunicação",
        desc: "Secretaria acadêmica, suporte pedagógico e serviços de assistência.",
      },
      {
        name: "Gestão Institucional & Planejamento",
        shortName: "Gestão",
        icon: Award,
        categoryKey: "Gestão",
        desc: "Transparência, comunicação interna e processos decisórios da direção.",
      },
    ];

    if (totalResponses === 0) {
      return baseAreas.map((area) => ({
        name: area.name,
        shortName: area.shortName,
        icon: area.icon,
        categoryKey: area.categoryKey,
        desc: area.desc,
        status: "SEM RESPOSTAS" as const,
        percentage: "0%",
        potPct: 0,
        medPct: 0,
        fragPct: 0,
      }));
    }

    const reportCampaigns = buildReportsFromSmartForms(smartForms);

    const activeReport =
      reportCampaigns.find(
        (report: { id: string }) => report.id === activeCampaign?.id,
      ) || reportCampaigns[0];

    return baseAreas.map((area) => {
      const dimension = activeReport?.dimensions?.find(
        (item: { dimension: string }) =>
          item.dimension.toLowerCase().includes(area.shortName.toLowerCase()) ||
          item.dimension.toLowerCase().includes(area.categoryKey.toLowerCase()),
      );

      if (!dimension || !activeReport || activeReport.totalResponses === 0) {
        return {
          name: area.name,
          shortName: area.shortName,
          icon: area.icon,
          categoryKey: area.categoryKey,
          desc: area.desc,
          status: "SEM RESPOSTAS" as const,
          percentage: "0%",
          potPct: 0,
          medPct: 0,
          fragPct: 0,
        };
      }

      let status:
        | "POTENCIALIDADE"
        | "AVALIAÇÃO MEDIANA"
        | "FRAGILIDADE"
        | "SEM RESPOSTAS";

      if (dimension.potencialidadePct >= 60) {
        status = "POTENCIALIDADE";
      } else if (dimension.fragilidadePct >= 40) {
        status = "FRAGILIDADE";
      } else {
        status = "AVALIAÇÃO MEDIANA";
      }

      return {
        name: area.name,
        shortName: area.shortName,
        icon: area.icon,
        categoryKey: area.categoryKey,
        desc: area.desc,
        status,
        percentage: `${dimension.potencialidadePct}%`,
        potPct: dimension.potencialidadePct || 0,
        medPct: dimension.medianaPct || 0,
        fragPct: dimension.fragilidadePct || 0,
      };
    });
  }, [totalResponses, smartForms, activeCampaign]);

  /*
   * Situação geral
   */

  const situacaoGeral = useMemo(() => {
    if (totalResponses === 0) {
      return {
        potencialidades: 0,
        medianas: 0,
        fragilidades: 0,
        semRespostas: 5,
      };
    }

    let potencialidades = 0;
    let medianas = 0;
    let fragilidades = 0;
    let semRespostas = 0;

    evaluatedAreas.forEach((area) => {
      if (area.status === "POTENCIALIDADE") {
        potencialidades += 1;
      } else if (area.status === "AVALIAÇÃO MEDIANA") {
        medianas += 1;
      } else if (area.status === "FRAGILIDADE") {
        fragilidades += 1;
      } else {
        semRespostas += 1;
      }
    });

    return {
      potencialidades,
      medianas,
      fragilidades,
      semRespostas,
    };
  }, [totalResponses, evaluatedAreas]);

  const toggleSecondary = (key: string) => {
    setOpenSecondary((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <div className="w-full max-w-[96%] 2xl:max-w-[1440px] mx-auto px-2 sm:px-4 py-4 space-y-4 select-none">
      {/* =====================================================
          INDICADORES PRINCIPAIS
      ===================================================== */}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Questionários */}

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Questionários Ativos
            </span>

            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {activeForms.length}
            </span>

            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Em andamento
            </p>
          </div>

          <div className="p-2.5 bg-emerald-50 text-[#006837] rounded-xl shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Respostas */}

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Respostas Recebidas
            </span>

            <span className="text-2xl font-black text-[#006837] tracking-tight leading-none mt-1 block">
              {totalResponses.toLocaleString("pt-BR")}
            </span>

            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Consolidadas no sistema
            </p>
          </div>

          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* Participação */}

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Taxa Média de Participação
            </span>

            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {totalResponses > 0 ? `${overallParticipationRate}%` : "0%"}
            </span>

            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Adesão institucional
            </p>
          </div>

          <div className="p-2.5 bg-emerald-50 text-[#006837] rounded-xl shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Campanhas */}

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Campanhas em Andamento
            </span>

            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {activeForms.length}
            </span>

            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Ciclos avaliativos abertos
            </p>
          </div>

          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* Campanha */}

          <section className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-[#006837] rounded-md">
                  <Calendar className="w-4 h-4" />
                </div>

                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  Campanha em andamento
                </h2>
              </div>

              {activeCampaign && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006837] border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006837] animate-pulse" />
                  ATIVA
                </span>
              )}
            </div>

            {activeCampaign ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3
                      className="text-sm font-bold text-slate-900 hover:text-[#006837] transition-colors cursor-pointer"
                      onClick={() => setSelectedCampaignDetail(activeCampaign)}
                    >
                      {activeCampaign.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {activeCampaign.campus || "Campus Tauá"} • Discentes,
                      Docentes e TAEs
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCampaignDetail(activeCampaign)}
                    className="self-start sm:self-auto px-2.5 py-1 text-xs font-bold text-[#006837] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detalhes rápidos</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      Período de Vigência
                    </span>

                    <span className="font-bold text-slate-800 text-[11px] block mt-0.5">
                      {activeCampaign.periodo || "Período não informado"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      Respostas
                    </span>

                    <span className="font-extrabold text-slate-900 text-[11px] block mt-0.5">
                      {activeCampaignResponses.toLocaleString("pt-BR")}{" "}
                      respostas
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      Adesão
                    </span>

                    <span className="font-black text-[#006837] text-[11px] block mt-0.5">
                      {activeCampaignRate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigateTab("formularios")}
                    className="h-8 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#006837]" />

                    <span>Criar Novo Questionário</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateTab("formularios")}
                    className="h-8 px-3.5 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <span>Ver na Gestão de Questionários</span>

                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                  Não há nenhuma campanha em andamento no momento.
                </p>

                <button
                  type="button"
                  onClick={() => onNavigateTab("formularios")}
                  className="px-3.5 py-1.5 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />

                  <span>Criar Novo Questionário</span>
                </button>
              </div>
            )}
          </section>

          {/* Participação */}

          <section className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                    <Users className="w-4 h-4" />
                  </div>

                  <h2 className="text-sm font-black text-slate-900 tracking-tight">
                    Participação dos segmentos
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab("participantes")}
                  className="text-xs font-bold text-[#006837] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>Gerenciar participantes</span>

                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3.5 pt-3">
                {/* Discentes */}

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <GraduationCap className="w-4 h-4 text-[#006837]" />
                      <span>Discentes (Alunos)</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">
                        {discentesResponses.toLocaleString("pt-BR")} de ~
                        {discentesUniverse}
                      </span>

                      <span className="font-extrabold text-slate-900 min-w-[36px] text-right">
                        {totalResponses > 0 ? `${discentesRate}%` : "0%"}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${totalResponses > 0 ? discentesRate : 0}%`,
                      }}
                      className="h-full bg-[#006837] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Docentes */}

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>Docentes (Professores)</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">
                        {docentesResponses.toLocaleString("pt-BR")} de ~
                        {docentesUniverse}
                      </span>

                      <span className="font-extrabold text-slate-900 min-w-[36px] text-right">
                        {totalResponses > 0 ? `${docentesRate}%` : "0%"}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${totalResponses > 0 ? docentesRate : 0}%`,
                      }}
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* TAEs */}

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Building2 className="w-4 h-4 text-amber-600" />

                      <span>Técnico-Administrativos (TAEs)</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">
                        {taesResponses.toLocaleString("pt-BR")} de ~
                        {taesUniverse}
                      </span>

                      <span className="font-extrabold text-slate-900 min-w-[36px] text-right">
                        {totalResponses > 0 ? `${taesRate}%` : "0%"}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${totalResponses > 0 ? taesRate : 0}%`,
                      }}
                      className="h-full bg-amber-600 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Universo Total Estimado:{" "}
                <strong className="text-slate-700">
                  ~{totalUniverse} participantes
                </strong>
              </span>

              <span className="text-slate-400">
                Dados baseados no censo local
              </span>
            </div>
          </section>
        </div>

        {/* Desempenho */}

        <div className="lg:col-span-5 space-y-4 flex flex-col">
          <section className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 text-[#006837] rounded-md">
                    <Layers className="w-4 h-4" />
                  </div>

                  <h2 className="text-sm font-black text-slate-900 tracking-tight">
                    Desempenho geral por área
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab("relatorios")}
                  className="text-xs font-bold text-[#006837] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>Ver relatórios</span>

                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 pt-2.5">
                {evaluatedAreas.map((area) => {
                  const Icon = area.icon;

                  return (
                    <div
                      key={area.shortName}
                      onClick={() => setSelectedAreaDetail(area)}
                      className="bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 rounded-lg p-2.5 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 bg-white border border-slate-200 rounded-md text-[#006837] group-hover:border-emerald-300 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-[#006837] transition-colors block truncate">
                            {area.name}
                          </span>

                          <span className="text-[10px] text-slate-500 truncate block">
                            {area.desc}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md text-center ${area.status === "POTENCIALIDADE"
                              ? "bg-emerald-100 text-[#006837] border border-emerald-200/80"
                              : area.status === "AVALIAÇÃO MEDIANA"
                                ? "bg-amber-100 text-amber-800 border border-amber-200/80"
                                : area.status === "FRAGILIDADE"
                                  ? "bg-rose-100 text-rose-700 border border-rose-200/80"
                                  : "bg-slate-200/70 text-slate-600 border border-slate-200"
                            }`}
                        >
                          {area.status}
                        </span>

                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006837] transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumo */}

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                Resumo Geral das Avaliações
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#006837]" />

                    <span className="text-[10px] font-bold text-slate-700 truncate">
                      Potencialidades
                    </span>
                  </div>

                  <span className="text-base font-black text-[#006837] mt-1 block">
                    {situacaoGeral.potencialidades}
                  </span>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />

                    <span className="text-[10px] font-bold text-slate-700 truncate">
                      Medianas
                    </span>
                  </div>

                  <span className="text-base font-black text-amber-600 mt-1 block">
                    {situacaoGeral.medianas}
                  </span>
                </div>

                <div className="bg-rose-50/70 border border-rose-200/80 rounded-lg p-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />

                    <span className="text-[10px] font-bold text-slate-700 truncate">
                      Fragilidades
                    </span>
                  </div>

                  <span className="text-base font-black text-rose-600 mt-1 block">
                    {situacaoGeral.fragilidades}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================
          INFORMAÇÕES COMPLEMENTARES
      ===================================================== */}

      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 tracking-tight">
            Informações Complementares e Histórico
          </span>

          <span className="text-[11px] text-slate-400 font-medium">
            Clique nos cards para expandir detalhes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Google Forms */}

          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSecondary("syncGoogleForms")}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50/70"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                  <Globe className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Google Forms & Sincronização
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    Integração ativa • Sincronizado
                  </p>
                </div>
              </div>

              {openSecondary.syncGoogleForms ? (
                <ChevronUp className="w-4 h-4 text-[#006837]" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {openSecondary.syncGoogleForms && (
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  className="border-t border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 text-xs"
                >
                  <div className="flex justify-between">
                    <span>Última Sincronização:</span>

                    <strong>{lastUpdateTime}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateTab("google-forms")}
                    className="w-full h-8 bg-[#006837] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    Gerenciar Google Forms
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Histórico */}

          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSecondary("historicoQuestionarios")}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50/70"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <FolderOpen className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Histórico de Questionários
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    {smartForms.length} questionários registrados
                  </p>
                </div>
              </div>

              {openSecondary.historicoQuestionarios ? (
                <ChevronUp className="w-4 h-4 text-[#006837]" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {openSecondary.historicoQuestionarios && (
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  className="border-t border-slate-100 bg-slate-50/50 p-3.5 space-y-2"
                >
                  {smartForms.slice(0, 4).map((form) => (
                    <div
                      key={form.id}
                      className="bg-white p-2 rounded-lg border border-slate-200"
                    >
                      <span className="font-bold text-xs block">
                        {form.title}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        {form.responsesCount?.total || 0} respostas
                      </span>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => onNavigateTab("formularios")}
                    className="w-full h-8 bg-slate-100 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    Ver Questionários
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Calendário */}

          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSecondary("calendarioCpa")}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50/70"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Ciclo & Calendário CPA
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    Ciclo Trienal 2024–2026
                  </p>
                </div>
              </div>

              {openSecondary.calendarioCpa ? (
                <ChevronUp className="w-4 h-4 text-[#006837]" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {openSecondary.calendarioCpa && (
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  className="border-t border-slate-100 bg-slate-50/50 p-3.5 text-xs"
                >
                  <p>
                    Campanha vigente: <strong>Autoavaliação 2026.2</strong>
                  </p>

                  <button
                    type="button"
                    onClick={() => onNavigateTab("relatorios")}
                    className="mt-3 w-full h-8 bg-[#006837] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    Consultar Relatórios
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =====================================================
          MODAL ÁREA
      ===================================================== */}

      <AnimatePresence>
        {selectedAreaDetail && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 text-[#006837] rounded-xl">
                    {React.createElement(selectedAreaDetail.icon, {
                      className: "w-6 h-6",
                    })}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {selectedAreaDetail.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                      Dimensão de Avaliação Institucional • CPA
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAreaDetail(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-600 text-xs">
                  {selectedAreaDetail.desc ||
                    "Avaliação detalhada da dimensão institucional."}
                </p>

                <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-xs">
                    Classificação Atual:
                  </span>

                  <span className="font-extrabold text-xs">
                    {selectedAreaDetail.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAreaDetail(null)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700"
                >
                  Fechar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAreaDetail(null);

                    onNavigateTab("relatorios");
                  }}
                  className="px-4 py-2 bg-[#006837] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  Abrir Relatório Completo
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MODAL CAMPANHA
      ===================================================== */}

      <AnimatePresence>
        {selectedCampaignDetail && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedCampaignDetail.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedCampaignDetail.campus || "Campus Tauá"} •{" "}
                    {selectedCampaignDetail.status || "Ativa"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCampaignDetail(null)}
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Vigência
                  </span>

                  <strong className="text-xs">
                    {selectedCampaignDetail.periodo || "Não informado"}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Respostas
                  </span>

                  <strong className="text-xs text-[#006837]">
                    {(
                      selectedCampaignDetail.responsesCount?.total || 0
                    ).toLocaleString("pt-BR")}
                  </strong>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                {selectedCampaignDetail.description ||
                  "Questionário institucional da CPA."}
              </p>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCampaignDetail(null)}
                  className="px-3.5 py-2 text-xs font-bold"
                >
                  Fechar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCampaignDetail(null);

                    onNavigateTab("formularios");
                  }}
                  className="px-4 py-2 bg-[#006837] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  Gerenciar Questionário
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
