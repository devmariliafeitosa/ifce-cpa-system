import React from 'react';
import { Edit3, Eye, X } from 'lucide-react';

/* Edição da mensagem de e-mail de convite da campanha. Extraído de FormsManagerView.tsx. */

interface EmailEditDialogProps {
  isOpen: boolean;
  emailSubject: string;
  emailBody: string;
  emailSignature: string;
  onChangeSubject: (value: string) => void;
  onChangeBody: (value: string) => void;
  onChangeSignature: (value: string) => void;
  onClose: () => void;
  onPreview: () => void;
  onSave: () => void;
}

export const EmailEditDialog: React.FC<EmailEditDialogProps> = ({
  isOpen,
  emailSubject,
  emailBody,
  emailSignature,
  onChangeSubject,
  onChangeBody,
  onChangeSignature,
  onClose,
  onPreview,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#006837]" />
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900">Editar Mensagem do E-mail</h4>
              <p className="text-xs text-slate-500">Personalize o texto do convite enviado aos participantes</p>
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

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>Assunto do E-mail</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => onChangeSubject(e.target.value)}
              className="w-full h-10 px-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>Corpo do Convite</span>
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              value={emailBody}
              onChange={(e) => onChangeBody(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium leading-relaxed"
            />
            <p className="text-[11px] text-slate-400">
              O botão e o link para preenchimento da autoavaliação serão inseridos automaticamente ao final do texto.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Assinatura Institucional
            </label>
            <textarea
              rows={3}
              value={emailSignature}
              onChange={(e) => onChangeSignature(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onPreview}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#006837]" />
            <span>Ver Prévia</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Salvar Mensagem
          </button>
        </div>
      </div>
    </div>
  );
};
