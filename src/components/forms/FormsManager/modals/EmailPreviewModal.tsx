import { Edit3, Mail, X } from 'lucide-react';
import React from 'react';

interface EmailPreviewModalProps {
  showEmailPreviewModal: boolean;
  setShowEmailPreviewModal: (open: boolean) => void;
  setShowEmailEditModal: (open: boolean) => void;
  emailSubject: string;
  emailBody: string;
  emailSignature: string;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  showEmailPreviewModal,
  setShowEmailPreviewModal,
  setShowEmailEditModal,
  emailSubject,
  emailBody,
  emailSignature,
}) => {
  return (
    <>
      {/* MODAL SECUNDÁRIO: Visualizar E-mail */}
      {showEmailPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#006837]" />
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900">Prévia do E-mail Institucional</h4>
                  <p className="text-xs text-slate-500">Como o destinatário visualizará o convite</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailPreviewModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 font-sans">
                <div className="space-y-1 pb-3 border-b border-slate-200/80">
                  <p><strong className="text-slate-900">De:</strong> CPA IFCE &lt;cpa@ifce.edu.br&gt;</p>
                  <p><strong className="text-slate-900">Para:</strong> participante@ifce.edu.br</p>
                  <p><strong className="text-slate-900">Assunto:</strong> {emailSubject}</p>
                </div>
                <div className="py-2 text-slate-700 whitespace-pre-line leading-relaxed">
                  {emailBody}
                </div>
                <div className="pt-2 text-center">
                  <span className="inline-block px-5 py-2.5 bg-[#006837] text-white text-xs font-extrabold rounded-xl shadow-xs">
                    Responder Avaliação Institucional
                  </span>
                </div>
                {emailSignature && (
                  <div className="pt-3 border-t border-slate-200/70 text-[11px] text-slate-500 whitespace-pre-line leading-normal">
                    {emailSignature}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowEmailPreviewModal(false);
                  setShowEmailEditModal(true);
                }}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006837] text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Mensagem</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEmailPreviewModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Fechar Prévia
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
