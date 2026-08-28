import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Sliders,
  Bell,
  Shield,
  KeyRound,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Lock,
  Clock,
  Mail,
  UserCheck,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChangePasswordModal } from './ChangePasswordModal';

interface SettingsViewProps {
  onReturnToDashboard?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = () => {
  // Preferências do Sistema
  const [systemName, setSystemName] = useState(
    'Sistema de Autoavaliação Institucional • CPA IFCE'
  );
  const [defaultCampus, setDefaultCampus] = useState('Campus Tauá');
  const [currentAcademicPeriod, setCurrentAcademicPeriod] = useState('2025.1');

  // Configurações das Avaliações
  const [defaultDuration, setDefaultDuration] = useState('30');
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [requireIdentification, setRequireIdentification] = useState(true);
  const [singleResponsePerUser, setSingleResponsePerUser] = useState(true);

  // Notificações
  const [notifyNewResponses, setNotifyNewResponses] = useState(true);
  const [notifyCampaignEnding, setNotifyCampaignEnding] = useState(true);
  const [notifyCampaignFinished, setNotifyCampaignFinished] = useState(true);
  const [alertEmail, setAlertEmail] = useState('cpa.taua@ifce.edu.br');

  // Segurança
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [require2FA, setRequire2FA] = useState(false);

  // Modal & Toast States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'info' } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setShowToast({
        message: 'Configurações do sistema salvas e aplicadas com sucesso!',
        type: 'success',
      });
      setTimeout(() => setShowToast(null), 3500);
    }, 400);
  };

  const handlePasswordChangeSuccess = () => {
    setShowToast({
      message: 'Senha do coordenador atualizada com sucesso!',
      type: 'success',
    });
    setTimeout(() => setShowToast(null), 4000);
  };

  const handleResetDefaults = () => {
    setSystemName('Sistema de Autoavaliação Institucional • CPA IFCE');
    setDefaultCampus('Campus Tauá');
    setCurrentAcademicPeriod('2025.1');
    setDefaultDuration('30');
    setAllowAnonymous(true);
    setRequireIdentification(true);
    setSingleResponsePerUser(true);
    setNotifyNewResponses(true);
    setNotifyCampaignEnding(true);
    setNotifyCampaignFinished(true);
    setAlertEmail('cpa.taua@ifce.edu.br');
    setSessionTimeout('60');
    setRequire2FA(false);

    setShowToast({
      message: 'Configurações restauradas para os padrões institucionais da CPA.',
      type: 'info',
    });
    setTimeout(() => setShowToast(null), 3500);
  };

  return (
    <div className="w-full max-w-[96%] 2xl:max-w-[1440px] mx-auto px-2 sm:px-4 py-4 space-y-4 select-none animate-in fade-in duration-200">
      {/* Barra de Ações e Status */}
      <div
        id="settings-header"
        className="bg-white border border-slate-200/90 rounded-xl px-4 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Parâmetros & Preferências</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006837] text-[10px] font-extrabold border border-emerald-200">
            Painel Geral
          </span>
        </div>

        {/* Action Button: Restaurar Padrões */}
        <button
          type="button"
          onClick={handleResetDefaults}
          className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-center shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Restaurar Padrões</span>
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between shadow-2xs border ${
              showToast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-[#006837]'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{showToast.message}</span>
            </div>
            <button
              onClick={() => setShowToast(null)}
              className="p-1 hover:opacity-75 cursor-pointer text-slate-500 text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Settings Grid Form (2 Columns on large screens) */}
      <form onSubmit={handleSaveSettings} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {/* =====================================================================
              CARD 1: PREFERÊNCIAS DO SISTEMA
             ===================================================================== */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="p-1.5 bg-emerald-50 text-[#006837] rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-900 tracking-tight">
                    Preferências do Sistema
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Parâmetros institucionais e contexto acadêmico padrão
                  </p>
                </div>
              </div>

              {/* Nome do Sistema */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Nome do Sistema / Instituição
                </label>
                <input
                  type="text"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all"
                  placeholder="Nome do sistema"
                  required
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  Exibido nos cabeçalhos, formulários e relatórios emitidos.
                </p>
              </div>

              {/* Grid 2 colunas: Campus Padrão e Período Acadêmico */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Campus Padrão */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Campus Padrão
                  </label>
                  <select
                    value={defaultCampus}
                    onChange={(e) => setDefaultCampus(e.target.value)}
                    className="w-full h-8 px-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
                  >
                    <option value="Campus Tauá">IFCE • Campus Tauá</option>
                    <option value="Campus Crateús">IFCE • Campus Crateús</option>
                    <option value="Campus Canindé">IFCE • Campus Canindé</option>
                    <option value="Campus Iguatu">IFCE • Campus Iguatu</option>
                    <option value="Campus Cedro">IFCE • Campus Cedro</option>
                    <option value="Reitoria">IFCE • Reitoria Geral</option>
                  </select>
                </div>

                {/* Ano / Período Acadêmico Atual */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Ano / Período Atual
                  </label>
                  <select
                    value={currentAcademicPeriod}
                    onChange={(e) => setCurrentAcademicPeriod(e.target.value)}
                    className="w-full h-8 px-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
                  >
                    <option value="2025.2">2025.2 (Próximo Semestre)</option>
                    <option value="2025.1">2025.1 (Semestre Vigente)</option>
                    <option value="2024.2">2024.2 (Semestre Anterior)</option>
                    <option value="2024.1">2024.1 (Histórico)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Identificador Institucional: IFCE-CPA-TAU</span>
              <span className="text-[#006837] font-bold">Ativo</span>
            </div>
          </div>

          {/* =====================================================================
              CARD 2: CONFIGURAÇÕES DAS AVALIAÇÕES
             ===================================================================== */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-900 tracking-tight">
                    Configurações das Avaliações
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Regras e diretrizes para aplicação de questionários
                  </p>
                </div>
              </div>

              {/* Duração Padrão dos Questionários */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Duração Padrão das Campanhas</span>
                  <span className="text-[10px] text-slate-400 font-normal">Prazo de preenchimento</span>
                </label>
                <select
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.value)}
                  className="w-full h-8 px-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
                >
                  <option value="15">15 dias corridos</option>
                  <option value="30">30 dias corridos (Recomendado pela CPA)</option>
                  <option value="45">45 dias corridos</option>
                  <option value="60">60 dias corridos (Ciclo estendido)</option>
                </select>
              </div>

              {/* Switches de Regras */}
              <div className="space-y-2.5 pt-1">
                {/* Switch 1: Permitir respostas anônimas */}
                <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Permitir respostas anônimas
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Garante sigilo do respondente nos relatórios públicos
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowAnonymous(!allowAnonymous)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      allowAnonymous ? 'bg-[#006837]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                        allowAnonymous ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 2: Exigir identificação institucional */}
                <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Exigir identificação de participante
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Valida matrícula ou e-mail institucional @ifce.edu.br
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequireIdentification(!requireIdentification)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      requireIdentification ? 'bg-[#006837]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                        requireIdentification ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 3: Uma resposta por participante */}
                <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Permitir apenas uma resposta por participante
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Impede envios duplicados no mesmo ciclo avaliativo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSingleResponsePerUser(!singleResponsePerUser)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      singleResponsePerUser ? 'bg-[#006837]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                        singleResponsePerUser ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Metodologia SINAES / CPA IFCE</span>
              <span className="text-blue-600 font-bold">Conforme</span>
            </div>
          </div>

          {/* =====================================================================
              CARD 3: NOTIFICAÇÕES
             ===================================================================== */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-900 tracking-tight">
                    Notificações e Alertas
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Alertas automáticos para a comissão e respondentes
                  </p>
                </div>
              </div>

              {/* E-mail de destino para alertas */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  E-mail Institucional para Recebimento de Alertas
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    className="w-full h-8 pl-8 pr-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all"
                    placeholder="cpa.taua@ifce.edu.br"
                    required
                  />
                </div>
              </div>

              {/* Switches de Notificação */}
              <div className="space-y-2.5 pt-1">
                {/* Switch 1: Novas respostas */}
                <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Notificar sobre novas respostas
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Resumo diário consolidado das participações recebidas
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyNewResponses(!notifyNewResponses)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      notifyNewResponses ? 'bg-[#006837]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                        notifyNewResponses ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 2: Campanha próxima do fim */}
                <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Avisar quando a campanha estiver próxima do encerramento
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Alerta com 3 dias de antecedência para reforçar divulgação
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyCampaignEnding(!notifyCampaignEnding)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      notifyCampaignEnding ? 'bg-[#006837]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                        notifyCampaignEnding ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 3: Campanha finalizada */}
                <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Avisar quando uma campanha for finalizada
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Gera automaticamente o relatório preliminar de resultados
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyCampaignFinished(!notifyCampaignFinished)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      notifyCampaignFinished ? 'bg-[#006837]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                        notifyCampaignFinished ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Canal de Notificações: E-mail & Sistema</span>
              <span className="text-amber-600 font-bold">Ativo</span>
            </div>
          </div>

          {/* =====================================================================
              CARD 4: SEGURANÇA E ACESSO
             ===================================================================== */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-900 tracking-tight">
                    Segurança e Acesso
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Políticas de sessão, credenciais e proteção de dados
                  </p>
                </div>
              </div>

              {/* Tempo de Sessão */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Tempo Limite de Sessão por Inatividade</span>
                  <span className="text-[10px] text-slate-400 font-normal">Desconexão automática</span>
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full h-8 px-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
                >
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora (Recomendado)</option>
                  <option value="120">2 horas</option>
                  <option value="240">4 horas</option>
                  <option value="480">8 horas (Jornada completa)</option>
                </select>
              </div>

              {/* Alteração de Senha */}
              <div className="p-3 bg-slate-50/80 border border-slate-200/90 rounded-xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Credenciais de Coordenador
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Senha forte com requisitos de segurança ativos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="h-7 px-3 bg-white hover:bg-emerald-50 hover:text-[#006837] border border-slate-200 hover:border-emerald-300 text-slate-700 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <KeyRound className="w-3 h-3 text-[#006837]" />
                  <span>Alterar Senha</span>
                </button>
              </div>

              {/* Switch Autenticação em Duas Etapas (2FA) */}
              <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    Exigir autenticação em duas etapas (2FA)
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Código de confirmação enviado ao e-mail institucional
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRequire2FA(!require2FA)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    require2FA ? 'bg-[#006837]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                      require2FA ? 'left-4.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Status de Proteção: LGPD & Criptografia</span>
              <span className="text-[#006837] font-bold">Protegido</span>
            </div>
          </div>
        </div>

        {/* Footer Actions: Botão Discreto Salvar Alterações */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Info className="w-4 h-4 text-[#006837] shrink-0" />
            <span>
              As alterações efetuadas serão aplicadas imediatamente a todas as sessões da CPA do Campus Tauá.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="h-8 px-4 bg-[#006837] hover:bg-[#00522b] text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Password Change Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
};
