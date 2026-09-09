import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import React from 'react';
import type { GoogleFormFile } from '../../../../services/googleFormsService';

interface DeleteGoogleFormConfirmModalProps {
  deleteTarget: GoogleFormFile | null;
  setDeleteTarget: (form: GoogleFormFile | null) => void;
  isDeleting: boolean;
  handleConfirmDelete: () => void;
}

export const DeleteGoogleFormConfirmModal: React.FC<DeleteGoogleFormConfirmModalProps> = ({
  deleteTarget,
  setDeleteTarget,
  isDeleting,
  handleConfirmDelete,
}) => {
  return (
    <>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Confirmar Exclusão de Formulário
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tem certeza de que deseja mover o formulário{" "}
                  <strong className="text-slate-800">
                    "{deleteTarget.name}"
                  </strong>{" "}
                  para a lixeira do Google Drive? Esta ação removerá o
                  formulário do sistema da CPA.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Aviso de Segurança
              </p>
              <p className="text-[11px] leading-relaxed">
                As respostas acumuladas no Google Forms poderão deixar de
                aceitar novos envios.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Sim, Excluir Formulário</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
