import React from 'react';

interface LaunchCampaignConfirmModalProps {
  showSendConfirmModal: boolean;
  setShowSendConfirmModal: (open: boolean) => void;
  handleConfirmSendCampaign: () => void;
}

export const LaunchCampaignConfirmModal: React.FC<LaunchCampaignConfirmModalProps> = ({
  showSendConfirmModal,
  setShowSendConfirmModal,
  handleConfirmSendCampaign,
}) => {
  return (
    <>
      {/* MODAL CONFIRMAÇÃO DE ENVIO DA CAMPANHA */}
      {showSendConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-#006837 text-flex text-items-center text-justify-center font-bold text-2xl mx-auto flex items-center justify-center">
              🚀
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-slate-900">Deseja iniciar esta campanha agora?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Após o envio, os participantes receberão automaticamente o acesso conforme os métodos selecionados.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSendConfirmModal(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSendCampaign}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-[#006837] hover:bg-#045C2D rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Enviar Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
