import React from 'react';
import { ArrowRight, Clock, FileSpreadsheet, RefreshCw, Search, X } from 'lucide-react';
import { DriveFormMock } from '../../data/mockDriveForms';

/* Importação de formulário legado do Google Drive. Extraído de FormsManagerView.tsx. */

interface ImportFromDriveDialogProps {
  isOpen: boolean;
  availableForms: DriveFormMock[];
  searchTerm: string;
  isFetching: boolean;
  onChangeSearchTerm: (value: string) => void;
  onRefresh: () => void;
  onImport: (item: DriveFormMock) => void;
  onClose: () => void;
}

export const ImportFromDriveDialog: React.FC<ImportFromDriveDialogProps> = ({
  isOpen,
  availableForms,
  searchTerm,
  isFetching,
  onChangeSearchTerm,
  onRefresh,
  onImport,
  onClose,
}) => {
  if (!isOpen) return null;

  const filtered = availableForms.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            onClick={onClose}
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
            onClick={onRefresh}
            disabled={isFetching}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#006837] ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Sincronizando...' : 'Sincronizar Google Drive'}</span>
          </button>
        </div>

        {/* Search Input for Importable Forms */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome do formulário..."
            value={searchTerm}
            onChange={(e) => onChangeSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837]"
          />
        </div>

        {/* Available Forms List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Formulários Disponíveis no Google Forms
          </p>

          {filtered.map((item) => (
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
                onClick={() => onImport(item)}
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
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
