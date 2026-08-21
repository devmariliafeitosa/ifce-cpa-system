import React from 'react';
import { QrCode, X } from 'lucide-react';

/* Preview do QR Code de divulgação de um formulário. Extraído de FormsManagerView.tsx. */

interface QrCodePreviewDialogProps {
  isOpen: boolean;
  formTitle: string;
  onClose: () => void;
  onDownloadPng: () => void;
  onDownloadPdf: () => void;
}

export const QrCodePreviewDialog: React.FC<QrCodePreviewDialogProps> = ({
  isOpen,
  formTitle,
  onClose,
  onDownloadPng,
  onDownloadPdf,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#006837]" />
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900">QR Code de Divulgação</h4>
              <p className="text-xs text-slate-500">Pronto para download ou impressão</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="w-44 h-44 mx-auto bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center p-3 shadow-inner">
            <QrCode className="w-36 h-36 text-slate-900" />
          </div>

          <div>
            <h5 className="text-sm font-bold text-slate-900">{formTitle || 'Avaliação Institucional CPA'}</h5>
            <p className="text-xs text-slate-500 mt-0.5">Aponta para o link de formulário público do campus</p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={onDownloadPng}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Baixar PNG
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Baixar Cartaz (PDF)
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
