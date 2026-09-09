import { BarChart2, ExternalLink, Loader2, X } from 'lucide-react';
import React from 'react';
import type { GoogleFormDetails, GoogleFormResponsesData } from '../../../../services/googleFormsService';

interface FormInspectorModalProps {
  inspectFormId: string | null;
  setInspectFormId: (id: string | null) => void;
  isLoadingInspect: boolean;
  inspectDetails: GoogleFormDetails | null;
  inspectResponses: GoogleFormResponsesData | null;
}

export const FormInspectorModal: React.FC<FormInspectorModalProps> = ({
  inspectFormId,
  setInspectFormId,
  isLoadingInspect,
  inspectDetails,
  inspectResponses,
}) => {
  const questionCount = inspectDetails?.items?.length ?? 0;
  const totalResponses = inspectResponses?.totalResponses ?? 0;

  let modalContent: React.ReactNode = null;

  if (isLoadingInspect) {
    modalContent = (
      <div className="py-12 text-center text-slate-400 space-y-2">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#006837]" />
        <p className="text-xs font-medium">
          Buscando dados no Google Forms API...
        </p>
      </div>
    );
  } else if (inspectDetails) {
    modalContent = (
      <div className="space-y-6">
        {/* Form Header info */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-2">
          <h4 className="text-base font-bold text-slate-800">
            {inspectDetails.info?.title}
          </h4>
          {inspectDetails.info?.description && (
            <p className="text-xs text-slate-600 leading-relaxed">
              {inspectDetails.info.description}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#006837]">
            <span>Perguntas: {questionCount}</span>
            <span>•</span>
            <span>Total Respostas Recebidas: {totalResponses}</span>
          </div>
        </div>

        {/* Direct Links */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://docs.google.com/forms/d/${inspectFormId}/viewform`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#006837] text-white hover:bg-ifce-dark text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Visualizar / Preencher Formulário</span>
          </a>

          <a
            href={`https://docs.google.com/forms/d/${inspectFormId}/edit#responses`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Abrir Gráficos Nativos no Google Forms</span>
          </a>
        </div>

        {/* Items & Questions list */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Perguntas Cadastradas ({questionCount})
          </h5>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {inspectDetails.items?.map((item, idx) => {
              const itemKey =
                item.itemId ??
                item.questionItem?.question?.questionId ??
                item.title ??
                `form-item-${idx}`;

              return (
                <div
                  key={itemKey}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
                >
                  <p className="font-bold text-slate-800">
                    {idx + 1}. {item.title}
                  </p>
                  {item.questionItem?.question?.choiceQuestion && (
                    <div className="pl-4 text-[11px] text-slate-500 space-y-0.5">
                      {item.questionItem.question.choiceQuestion.options.map((opt, oIdx) => {
                        const optionKey = opt.value ?? `option-${oIdx}`;

                        return (
                          <div
                            key={optionKey}
                            className="flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span>{opt.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {item.questionItem?.question?.scaleQuestion && (
                    <p className="text-[11px] text-[#006837] font-medium">
                      Escala Linear (
                      {item.questionItem.question.scaleQuestion.low} a{" "}
                      {item.questionItem.question.scaleQuestion.high})
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Embedded Form Preview Frame */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Pré-visualização Incorporada
          </h5>
          <div className="w-full h-80 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
            <iframe
              src={`https://docs.google.com/forms/d/${inspectFormId}/viewform?embedded=true`}
              className="w-full h-full border-0"
              title="Google Form Embedded Preview"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {inspectFormId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#006837]" />
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Inspeção do Formulário Google
                  </h3>
                  <p className="text-[11px] text-slate-400">ID: {inspectFormId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectFormId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalContent}
          </div>
        </div>
      )}
    </>
  );
};
