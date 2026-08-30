import {
  CheckCircle2,
  ChevronDown,
  Filter,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { ReportCampaignData } from "../../data/reportsData";
import { ReportsExportMenu } from "./ReportsExportMenu";

interface ReportsFiltersBarProps {
  availableCampuses: string[];
  availableYears: string[];
  campusFilter: string;
  yearFilter: string;
  selectedCampaign: ReportCampaignData | null;
  selectedCampaignId: string | null;
  filteredCampaigns: ReportCampaignData[];
  isCampaignSelectorOpen: boolean;
  campaignSearchTerm: string;
  isExportMenuOpen: boolean;
  onCampusChange: (campus: string) => void;
  onYearChange: (year: string) => void;
  onCampaignSelectorToggle: () => void;
  onCampaignSearchChange: (term: string) => void;
  onCampaignSelect: (campaignId: string) => void;
  onExportToggle: () => void;
  onExportClose: () => void;
  onOpenPdf: () => void;
}

export function ReportsFiltersBar({
  availableCampuses,
  availableYears,
  campusFilter,
  yearFilter,
  selectedCampaign,
  selectedCampaignId,
  filteredCampaigns,
  isCampaignSelectorOpen,
  campaignSearchTerm,
  isExportMenuOpen,
  onCampusChange,
  onYearChange,
  onCampaignSelectorToggle,
  onCampaignSearchChange,
  onCampaignSelect,
  onExportToggle,
  onExportClose,
  onOpenPdf,
}: ReportsFiltersBarProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
        <div className="flex items-center gap-1 text-slate-500 text-xs font-bold shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#006837]" />
          <span className="hidden md:inline">Filtros:</span>
        </div>

        <select
          value={campusFilter}
          onChange={(event) =>
            onCampusChange(event.target.value)
          }
          className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] cursor-pointer"
        >
          <option value="todos">Todos Campi</option>

          {availableCampuses.map((campus) => (
            <option key={campus} value={campus}>
              {campus}
            </option>
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(event) =>
            onYearChange(event.target.value)
          }
          className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] cursor-pointer"
        >
          <option value="todos">Todos Anos</option>

          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <div className="relative min-w-[180px] max-w-[260px] flex-1">
          <button
            onClick={onCampaignSelectorToggle}
            className="w-full h-8 px-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-bold text-slate-800 flex items-center justify-between gap-1.5 shadow-2xs transition-all cursor-pointer text-left"
          >
            <span className="truncate">
              {selectedCampaign
                ? selectedCampaign.title
                : "Selecione um questionário"}
            </span>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform ${
                isCampaignSelectorOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isCampaignSelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute left-0 top-full mt-1 z-40 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1.5 w-72 sm:w-80 overflow-hidden flex flex-col"
              >
                <div className="relative flex-shrink-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />

                  <input
                    type="text"
                    value={campaignSearchTerm}
                    onChange={(event) =>
                      onCampaignSearchChange(event.target.value)
                    }
                    placeholder="Pesquisar questionário..."
                    className="w-full pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837]"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1 pr-1 flex-1">
                  {filteredCampaigns.length === 0 ? (
                    <div className="p-2 text-center text-xs text-slate-400">
                      Nenhum questionário encontrado.
                    </div>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <button
                        key={campaign.id}
                        onClick={() =>
                          onCampaignSelect(campaign.id)
                        }
                        className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          campaign.id === selectedCampaignId
                            ? "bg-[#006837] text-white font-bold"
                            : "hover:bg-slate-50 text-slate-700 font-medium"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="truncate">
                            {campaign.title}
                          </div>

                          <div
                            className={`text-[10px] mt-0.5 ${
                              campaign.id === selectedCampaignId
                                ? "text-emerald-100"
                                : "text-slate-400"
                            }`}
                          >
                            {campaign.campus} • {campaign.period}
                          </div>
                        </div>

                        {campaign.id === selectedCampaignId && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ReportsExportMenu
        campaign={selectedCampaign}
        isOpen={isExportMenuOpen}
        onToggle={onExportToggle}
        onOpenPdf={onOpenPdf}
        onClose={onExportClose}
      />
    </div>
  );
}