import { Trash2 } from 'lucide-react';
import React from 'react';
import type { SmartForm } from '../../../../types';

interface DeleteFormConfirmModalProps {
  deletingForm: SmartForm | null;
  setDeletingForm: (form: SmartForm | null) => void;
  handleDeleteForm: () => void;
}

export const DeleteFormConfirmModal: React.FC<DeleteFormConfirmModalProps> = ({
  deletingForm,
  setDeletingForm,
  handleDeleteForm,
}) => {
  return (
    <>
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

    </>
  );
};
