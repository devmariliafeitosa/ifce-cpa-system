import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Share2,
  BarChart3,
  Sliders,
  FileText,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { Campaign } from '../types';
import { IFCELogo } from './IFCELogo';

interface CampaignQRCodeModalProps {
  campaign: Campaign;
  onClose: () => void;
  onUpdateCampaign?: (updatedCampaign: Campaign) => void;
  showNotification?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const CampaignQRCodeModal: React.FC<CampaignQRCodeModalProps> = ({
  campaign,
  onClose,
  showNotification,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [isGeneratingQrOnly, setIsGeneratingQrOnly] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // Customization Live Preview Toggles
  const [showLogo, setShowLogo] = useState(true);
  const [showPeriod, setShowPeriod] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [printFormat, setPrintFormat] = useState<'a4' | 'a3'>('a4');

  // Generate public campaign evaluation URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cpa.ifce.edu.br';
  const campaignUrl = campaign.uniqueTokenUrl || `${baseUrl}/?campaignId=${campaign.id}`;

  // Metrics
  const emailsSent = campaign.sentEmailsCount ?? 2450;
  const accessCount = campaign.qrCodeAccessCount ?? 184;
  const responseCount = campaign.qrCodeResponsesCount ?? 142;

  // Copy campaign link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      if (showNotification) {
        showNotification('success', 'Link da campanha copiado para a área de transferência!');
      }
      setTimeout(() => setCopied(false), 3000);
    } catch {
      if (showNotification) {
        showNotification('error', 'Não foi possível copiar o link.');
      }
    }
  };

  // Test link in a new browser tab
  const handleTestLink = () => {
    window.open(campaignUrl, '_blank', 'noopener,noreferrer');
    if (showNotification) {
      showNotification('info', 'Abrindo o questionário da campanha em uma nova aba...');
    }
  };

  // Web Share API or Copy Fallback
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CPA IFCE - ${campaign.title}`,
          text: `Participe da Avaliação Institucional do IFCE ${campaign.campus}`,
          url: campaignUrl,
        });
        if (showNotification) {
          showNotification('success', 'Link compartilhado com sucesso!');
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Trigger Print (Native print dialog allows Save to PDF as well)
  const handlePrint = () => {
    window.print();
  };

  // Download only raw QR Code (PNG High Res)
  const handleDownloadOnlyQRCode = () => {
    setIsGeneratingQrOnly(true);
    try {
      const svgElement = posterRef.current?.querySelector('svg');
      if (!svgElement) {
        setIsGeneratingQrOnly(false);
        if (showNotification) showNotification('error', 'QR Code não encontrado.');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const size = 1000; // High res
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsGeneratingQrOnly(false);
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      img.onload = () => {
        // Draw with padding
        const pad = 60;
        ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QRCode_Apenas_${campaign.campus.replace(/\s+/g, '_')}.png`;
        downloadLink.href = pngUrl;
        downloadLink.click();

        setIsGeneratingQrOnly(false);
        if (showNotification) {
          showNotification('success', 'Imagem do QR Code isolado (PNG) baixada com sucesso!');
        }
      };
    } catch (err) {
      console.error('Error generating standalone QR Code:', err);
      setIsGeneratingQrOnly(false);
      if (showNotification) showNotification('error', 'Erro ao baixar imagem do QR Code.');
    }
  };

  // Download high-resolution PNG using HTML Canvas
  const handleDownloadPNG = () => {
    setIsGeneratingPng(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingPng(false);
        return;
      }

      // High-Res Poster Dimensions: 1200 x 1600 px (A4 Ratio)
      const w = printFormat === 'a3' ? 1414 : 1200;
      const h = printFormat === 'a3' ? 2000 : 1600;
      canvas.width = w;
      canvas.height = h;

      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      let currentY = 0;

      // 1. Top Logo & Header (If enabled)
      if (showLogo) {
        ctx.fillStyle = '#006837';
        ctx.fillRect(0, 0, w, 200);

        // Header Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 42px sans-serif';
        ctx.fillText('INSTITUTO FEDERAL DO CEARÁ', 80, 100);

        ctx.fillStyle = '#A7F3D0';
        ctx.font = '600 26px sans-serif';
        ctx.fillText('CPA — Comissão Própria de Avaliação', 80, 145);

        currentY = 240;
      } else {
        currentY = 100;
      }

      // 2. Campus & Campaign Title Card
      ctx.fillStyle = '#006837';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`AVALIAÇÃO INSTITUCIONAL • ${campaign.campus.toUpperCase()}`, 80, currentY + 40);

      // Title Word Wrap
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 38px sans-serif';
      const words = campaign.title.split(' ');
      let line = '';
      let textY = currentY + 100;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > (w - 160) && i > 0) {
          ctx.fillText(line, 80, textY);
          line = words[i] + ' ';
          textY += 48;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 80, textY);

      // Response Period (If enabled)
      if (showPeriod) {
        textY += 40;
        ctx.fillStyle = '#047857';
        ctx.font = '600 24px sans-serif';
        ctx.fillText(`📅 Período de resposta: ${campaign.startDate} a ${campaign.endDate}`, 80, textY);
      }

      // 3. Centralized QR Code SVG rendering
      const svgElement = posterRef.current?.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

        img.onload = () => {
          const qrSize = 520;
          const qrX = (w - qrSize) / 2;
          const qrY = textY + 60;

          // QR Code Border Container
          ctx.fillStyle = '#F8FAFC';
          ctx.strokeStyle = '#006837';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.roundRect(qrX - 40, qrY - 40, qrSize + 80, qrSize + 80, 28);
          ctx.fill();
          ctx.stroke();

          ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

          let bottomY = qrY + qrSize + 90;

          // 4. Instructions (If enabled)
          if (showInstructions) {
            ctx.fillStyle = '#ECFDF5';
            ctx.beginPath();
            ctx.roundRect(100, bottomY, w - 200, 110, 20);
            ctx.fill();

            ctx.fillStyle = '#065F46';
            ctx.font = 'bold 26px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📱 Escaneie este QR Code com a câmera do celular', w / 2, bottomY + 48);

            ctx.fillStyle = '#047857';
            ctx.font = '600 22px sans-serif';
            ctx.fillText('para acessar a Avaliação Institucional.', w / 2, bottomY + 85);

            bottomY += 150;
          }

          // 5. Footer (If enabled)
          if (showFooter) {
            ctx.fillStyle = '#64748B';
            ctx.font = '500 22px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Sua participação contribui para a melhoria contínua do IFCE.', w / 2, h - 80);
          }

          // Trigger PNG download
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `Poster_CPA_IFCE_${campaign.campus.replace(/\s+/g, '_')}_${printFormat.toUpperCase()}.png`;
          downloadLink.href = pngUrl;
          downloadLink.click();

          setIsGeneratingPng(false);
          if (showNotification) {
            showNotification('success', `Cartaz Pôster PNG (${printFormat.toUpperCase()}) gerado e baixado com sucesso!`);
          }
        };
      } else {
        setIsGeneratingPng(false);
      }
    } catch (err) {
      console.error('Error generating PNG:', err);
      setIsGeneratingPng(false);
      if (showNotification) {
        showNotification('error', 'Erro ao processar imagem PNG.');
      }
    }
  };

  return (
    <>
      {/* Dynamic Print CSS for flawless printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #cpa-poster-print-container, #cpa-poster-print-container * {
            visibility: visible !important;
          }
          #cpa-poster-print-container {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999999 !important;
            padding: 24px !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Main Overlay Modal (approx 1000px width) */}
      <div className="fixed inset-0 z-[10000] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-[1020px] w-full border border-slate-200 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden my-auto">
          
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#006837] text-white flex items-center justify-center shadow-xs shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight flex items-center gap-2">
                  <span>Divulgação Institucional • QR Code da Campanha</span>
                  <span className="text-[10px] bg-emerald-100 text-[#006837] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    CPA IFCE
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Material oficial de divulgação e sinalização do Instituto Federal do Ceará.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body - 2 Columns Layout */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ================= COLUNA ESQUERDA: PÔSTER PRÉ-VISUALIZAÇÃO ================= */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="w-full text-center mb-3 flex items-center justify-between px-1">
                  <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#006837]" />
                    Pôster de Divulgação Impresso
                  </span>
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-[#006837] border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                    Simulador {printFormat.toUpperCase()}
                  </span>
                </div>

                {/* Printable Institutional Poster Card */}
                <div
                  id="cpa-poster-print-container"
                  ref={posterRef}
                  className="w-full max-w-[430px] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center transition-all hover:shadow-2xl flex flex-col min-h-[550px] relative"
                >
                  {/* Logo / Top Bar IFCE */}
                  {showLogo && (
                    <div className="bg-[#006837] text-white p-5 text-left relative overflow-hidden shrink-0 border-b-4 border-rose-600">
                      <div className="flex items-center justify-between">
                        <IFCELogo variant="light" showSubtitle={true} />
                      </div>
                    </div>
                  )}

                  {/* Poster Main Content */}
                  <div className="p-6 flex-1 flex flex-col items-center justify-between space-y-4 bg-gradient-to-b from-white via-white to-emerald-50/20">
                    
                    {/* Title & Campus */}
                    <div className="space-y-1.5 w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#006837] bg-emerald-100/80 px-3 py-1 rounded-full inline-block border border-emerald-200/60">
                        {campaign.campus}
                      </span>
                      <h5 className="text-base font-black text-slate-900 leading-snug pt-1 px-2">
                        {campaign.title}
                      </h5>

                      {/* Period Badge */}
                      {showPeriod && (
                        <div className="pt-1 text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-1.5 bg-emerald-50/80 py-1 px-3 rounded-lg border border-emerald-100 mx-auto max-w-xs">
                          <Calendar className="w-3.5 h-3.5 text-[#006837]" />
                          <span>Período: {campaign.startDate} a {campaign.endDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Centralized QR Code in Highlight Container */}
                    <div className="p-4 bg-white rounded-3xl border-2 border-[#006837]/30 shadow-md inline-block my-1 relative group">
                      <QRCodeSVG
                        value={campaignUrl}
                        size={190}
                        bgColor="#FFFFFF"
                        fgColor="#006837"
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    {/* Instructions Box */}
                    {showInstructions && (
                      <div className="w-full bg-emerald-50/90 border border-emerald-200/80 p-3.5 rounded-2xl text-center space-y-0.5 text-xs shadow-2xs">
                        <p className="text-[#006837] font-extrabold text-xs">
                          📱 Escaneie este QR Code com a câmera do celular
                        </p>
                        <p className="text-slate-600 text-[11px] font-medium">
                          para acessar a Avaliação Institucional.
                        </p>
                      </div>
                    )}

                    {/* Institutional Footer Message */}
                    {showFooter && (
                      <div className="pt-2 border-t border-slate-200/80 w-full text-[11px] text-slate-500 font-semibold italic">
                        Sua participação contribui para a melhoria contínua do IFCE.
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* ================= COLUNA DIREITA: PAINEL DE CONTROLE E DOWNLOADS ================= */}
              <div className="lg:col-span-6 space-y-5">
                
                {/* CARD 1: Estatísticas Rápidas da Campanha */}
                <div className="bg-slate-900 text-white p-4.5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      Estatísticas da Campanha
                    </span>
                    <span className="text-[10px] bg-white/10 text-emerald-200 px-2 py-0.5 rounded-md font-bold">
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs text-center border border-white/5">
                      <span className="text-[10px] text-slate-300 block font-bold truncate">E-mails Enviados</span>
                      <strong className="text-base font-black text-white block pt-0.5">
                        {emailsSent.toLocaleString('pt-BR')}
                      </strong>
                    </div>

                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs text-center border border-white/5">
                      <span className="text-[10px] text-slate-300 block font-bold truncate">Acessos QR</span>
                      <strong className="text-base font-black text-emerald-300 block pt-0.5">
                        {accessCount.toLocaleString('pt-BR')}
                      </strong>
                    </div>

                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs text-center border border-white/5">
                      <span className="text-[10px] text-slate-300 block font-bold truncate">Respostas</span>
                      <strong className="text-base font-black text-white block pt-0.5">
                        {responseCount.toLocaleString('pt-BR')}
                      </strong>
                    </div>
                  </div>
                </div>


                {/* CARD 2: Formato de Impressão e Personalização do Cartaz */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-xs font-bold text-[#006837] flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      Personalização & Formato de Impressão
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Atualização em Tempo Real</span>
                  </div>

                  {/* Formato Seletor */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Tamanho do Papel / Suporte:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPrintFormat('a4')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                          printFormat === 'a4'
                            ? 'bg-[#006837] text-white border-[#006837] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        📄 Folha A4 (210 x 297 mm)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrintFormat('a3')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                          printFormat === 'a3'
                            ? 'bg-[#006837] text-white border-[#006837] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        📜 Cartaz / Banner A3
                      </button>
                    </div>
                  </div>

                  {/* Toggles de Exibição */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/50">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={showLogo}
                        onChange={(e) => setShowLogo(e.target.checked)}
                        className="accent-[#006837] w-4 h-4 rounded-md cursor-pointer"
                      />
                      <span>Logo do IFCE</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={showPeriod}
                        onChange={(e) => setShowPeriod(e.target.checked)}
                        className="accent-[#006837] w-4 h-4 rounded-md cursor-pointer"
                      />
                      <span>Período de Resposta</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={showInstructions}
                        onChange={(e) => setShowInstructions(e.target.checked)}
                        className="accent-[#006837] w-4 h-4 rounded-md cursor-pointer"
                      />
                      <span>Instruções de leitura</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={showFooter}
                        onChange={(e) => setShowFooter(e.target.checked)}
                        className="accent-[#006837] w-4 h-4 rounded-md cursor-pointer"
                      />
                      <span>Mensagem de Rodapé</span>
                    </label>
                  </div>
                </div>


                {/* CARD 3: Link do Formulário & Testar Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Link Direto do Questionário</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">CPA SUAP Integration</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={campaignUrl}
                      className="flex-1 h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 truncate focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`h-10 px-3.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestLink}
                      className="h-10 px-3 bg-emerald-100 hover:bg-emerald-200 text-[#006837] border border-emerald-300/70 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="Testar Link em Nova Aba"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Testar Link</span>
                    </button>
                  </div>
                </div>


                {/* CARD 4: Opções de Download e Exportação */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                    Exportação & Downloads Oficiais
                  </span>

                  {/* High Priority Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Baixar Pôster PDF */}
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="py-3 px-4 bg-[#006837] hover:bg-[#045C2D] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Baixar Pôster em PDF ({printFormat.toUpperCase()})</span>
                    </button>

                    {/* Baixar Imagem PNG */}
                    <button
                      type="button"
                      onClick={handleDownloadPNG}
                      disabled={isGeneratingPng}
                      className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isGeneratingPng ? 'Processando...' : 'Baixar Imagem PNG (Alta Res.)'}</span>
                    </button>
                  </div>

                  {/* Secondary Export Options */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Baixar Apenas QR Code */}
                    <button
                      type="button"
                      onClick={handleDownloadOnlyQRCode}
                      disabled={isGeneratingQrOnly}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-300 shrink-0"
                    >
                      <QrCode className="w-4 h-4 text-[#006837]" />
                      <span>{isGeneratingQrOnly ? 'Baixando...' : 'Baixar apenas o QR Code'}</span>
                    </button>

                    {/* Compartilhar */}
                    <button
                      type="button"
                      onClick={handleShare}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
                    >
                      <Share2 className="w-4 h-4 text-[#006837]" />
                      <span>Compartilhar Campanha</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="font-semibold text-slate-600">
              Comissão Própria de Avaliação — Instituto Federal do Ceará (IFCE)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-all cursor-pointer"
            >
              Concluído
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
