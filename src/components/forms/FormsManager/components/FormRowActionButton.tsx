import { BarChart2, Copy, Edit3, Eye, Globe, MoreVertical, PauseCircle, PlayCircle, QrCode, Send, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { SmartForm } from '../../../../types';

interface FormRowActionButtonProps {
  form: SmartForm;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  handleStartResponding: (form: SmartForm) => void;
  handleOpenGoogleFormsLink: (form: SmartForm) => void;
  setViewingMetricsForm: (form: SmartForm) => void;
  handleOpenEditModal: (form: SmartForm, targetStep?: number) => void;
  handleDuplicateForm: (form: SmartForm) => void;
  handleSendCampaign: (form: SmartForm) => void;
  handleOpenQRCodeForForm?: (form: SmartForm) => void;
  handleToggleCampaignStatus: (form: SmartForm) => void;
  setDeletingForm: (form: SmartForm) => void;
}

export const FormRowActionButton: React.FC<FormRowActionButtonProps> = ({
  form,
  isOpen,
  onToggle,
  onClose,
  handleStartResponding,
  handleOpenGoogleFormsLink,
  setViewingMetricsForm,
  handleOpenEditModal,
  handleDuplicateForm,
  handleSendCampaign,
  handleOpenQRCodeForForm,
  handleToggleCampaignStatus,
  setDeletingForm,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    right: number;
    openUp: boolean;
    maxHeight: number;
  }>({
    right: 16,
    openUp: false,
    maxHeight: 380,
  });

  const calculatePosition = React.useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Altura estimada do menu contextual completo ~320px
    const menuHeightEstimate = 320;
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;

    // Abre para cima (drop-up) se o espaço abaixo for insuficiente e o espaço acima for maior
    const shouldOpenUp = spaceBelow < menuHeightEstimate && spaceAbove > spaceBelow;

    // Alinha a borda direita do menu com a borda direita do botão de 3 pontos
    const rightOffset = Math.max(12, vw - rect.right);

    if (shouldOpenUp) {
      const bottomPos = Math.max(12, vh - rect.top + 8);
      const availHeight = Math.min(spaceAbove - 16, 450);
      setCoords({
        bottom: bottomPos,
        right: rightOffset,
        openUp: true,
        maxHeight: Math.max(220, availHeight),
      });
    } else {
      const topPos = Math.min(vh - 220, rect.bottom + 8);
      const availHeight = Math.min(spaceBelow - 16, 450);
      setCoords({
        top: topPos,
        right: rightOffset,
        openUp: false,
        maxHeight: Math.max(220, availHeight),
      });
    }
  }, []);

  React.useLayoutEffect(() => {
    if (!isOpen) return;
    calculatePosition();

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, calculatePosition]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border transition-all cursor-pointer ${
          isOpen
            ? 'bg-slate-200 text-slate-900 border-slate-300 shadow-xs'
            : 'bg-slate-50 border-slate-200'
        }`}
        title="Mais Opções"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay transparente para fechar ao clicar fora */}
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-9980 border-0 bg-transparent p-0 m-0 cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }
            }}
          />

          {/* Menu Dropdown / Dropup flutuante inteligente */}
          <div
            style={{
              position: 'fixed',
              top: coords.openUp ? 'auto' : `${coords.top}px`,
              bottom: coords.openUp ? `${coords.bottom}px` : 'auto',
              right: `${coords.right}px`,
              maxHeight: `${coords.maxHeight}px`,
            }}
            className={`z-9999 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 overflow-y-auto text-left flex flex-col space-y-1 ${
              coords.openUp
                ? 'animate-in fade-in slide-in-from-bottom-2 duration-150'
                : 'animate-in fade-in slide-in-from-top-2 duration-150'
            }`}
          >
            {/* GRUPO 1: VISUALIZAÇÃO */}
            <div className="px-2.5 pt-1.5 pb-0.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Visualização
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleStartResponding(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#006837]" />
              <span>Visualizar / Responder</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleOpenGoogleFormsLink(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Abrir no Google Forms</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                setViewingMetricsForm(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-purple-600" />
              <span>Ver Respostas</span>
            </button>

            <div className="border-t border-slate-100 my-1" />

            {/* GRUPO 2: EDIÇÃO */}
            <div className="px-2.5 pt-1.5 pb-0.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Edição
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleOpenEditModal(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span>Editar Estrutura</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleDuplicateForm(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4 text-indigo-600" />
              <span>Duplicar Formulário</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleSendCampaign(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-600" />
              <span>Enviar Campanha</span>
            </button>

            {handleOpenQRCodeForForm && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  handleOpenQRCodeForForm(form);
                }}
                className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#006837]" />
                <span>Divulgação (Gerar QR Code)</span>
              </button>
            )}

            <div className="border-t border-slate-100 my-1" />

            {/* GRUPO 3: GERENCIAMENTO */}
            <div className="px-2.5 pt-1.5 pb-0.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Gerenciamento
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                handleToggleCampaignStatus(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-900 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
            >
              {form.status === 'Ativo' ? (
                <>
                  <PauseCircle className="w-4 h-4 text-orange-600" />
                  <span>Encerrar Campanha</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 text-emerald-600" />
                  <span>Reativar Campanha</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                setDeletingForm(form);
              }}
              className="w-full px-2.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Excluir Formulário</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
