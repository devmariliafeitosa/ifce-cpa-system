import {
  ChevronDown,
  FileCode,
  FileDown,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { ReportCampaignData } from "../../data/reportsData";
import {
  exportReportToCsv,
  exportReportToExcel,
} from "../../utils/reportExporter";

interface ReportsExportMenuProps {
  campaign: ReportCampaignData | null;
  isOpen: boolean;
  onToggle: () => void;
  onOpenPdf: () => void;
  onClose: () => void;
}

export function ReportsExportMenu({
  campaign,
  isOpen,
  onToggle,
  onOpenPdf,
  onClose,
}: ReportsExportMenuProps) {
  return (
    <div className="relative shrink-0">
      <button
        onClick={onToggle}
        disabled={!campaign}
        className="h-8 px-3 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <FileDown className="w-3.5 h-3.5" />
        <span>Exportar relatório</span>

        <ChevronDown
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && campaign && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 w-48 space-y-1"
          >
            <button
              onClick={() => {
                onClose();
                onOpenPdf();
              }}
              className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF (.pdf)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                void exportReportToExcel(campaign);
              }}
              className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                exportReportToCsv(campaign);
              }}
              className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span>CSV (.csv)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                window.print();
              }}
              className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-lg flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-100 pt-1"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimir</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}