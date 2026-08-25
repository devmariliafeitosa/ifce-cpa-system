import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

/* Confirmação de exclusão de participante. Extraído de ParticipantsView.tsx. */

interface DeleteParticipantDialogProps {
  participantId: string | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteParticipantDialog: React.FC<DeleteParticipantDialogProps> = ({
  participantId,
  onCancel,
  onConfirm,
}) => {
  return (
    <AnimatePresence>
      {participantId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-sm w-full border border-slate-200 shadow-xl p-5 text-center space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Excluir Participante?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Esta ação é irreversível e removerá o participante da base da CPA.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={onCancel}
                className="h-8 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => onConfirm(participantId)}
                className="h-8 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
