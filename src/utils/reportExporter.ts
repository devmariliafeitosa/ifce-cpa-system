import ExcelJS from "exceljs";
import type { ReportCampaignData, ReportQuestion } from "../data/reportsData";

/**
 * Utility to export CPA report to Excel (.xlsx) with multiple sheets
 */
export async function exportReportToExcel(
  campaign: ReportCampaignData,
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "CPA IFCE - Comissão Própria de Avaliação";
  workbook.lastModifiedBy = "CPA IFCE";
  workbook.created = new Date();

  // Color Constants
  const HEADER_FILL: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF006837" }, // IFCE Green
  };
  const HEADER_FONT: Partial<ExcelJS.Font> = {
    name: "Segoe UI",
    size: 11,
    bold: true,
    color: { argb: "FFFFFF" },
  };

  // ---------------------------------------------------------
  // TAB 1: RESUMO GERAL
  // ---------------------------------------------------------
  const summarySheet = workbook.addWorksheet("Resumo Geral");

  summarySheet.addRow(["RELATÓRIO DE AUTOAVALIAÇÃO CPA - IFCE"]);
  summarySheet.getRow(1).font = {
    size: 16,
    bold: true,
    color: { argb: "FF006837" },
  };

  summarySheet.addRow([`Campus: ${campaign.campus}`]);
  summarySheet.addRow([`Campanha / Instrumento: ${campaign.title}`]);
  summarySheet.addRow([`Período: ${campaign.period}`]);
  summarySheet.addRow([
    `Data de Emissão: ${new Date().toLocaleDateString("pt-BR")}`,
  ]);
  summarySheet.addRow([]);

  // Metrics Table
  summarySheet.addRow(["Métrica", "Valor"]);
  const metricHeaderRow = summarySheet.getRow(7);
  metricHeaderRow.fill = HEADER_FILL;
  metricHeaderRow.font = HEADER_FONT;

  const isNoResponses = campaign.totalResponses === 0;

  summarySheet.addRow(["Total de Perguntas", campaign.totalQuestions]);
  summarySheet.addRow(["Total de Respondentes", campaign.totalResponses]);
  summarySheet.addRow(["Taxa de Resposta", `${campaign.responseRate}%`]);
  summarySheet.addRow([
    "Tempo Médio",
    isNoResponses ? "—" : campaign.avgResponseTime,
  ]);
  summarySheet.addRow([
    "Potencialidades (≥ 70%)",
    isNoResponses ? "0% (Sem respostas)" : `${campaign.potencialidadePct}%`,
  ]);
  summarySheet.addRow([
    "Avaliação Mediana (50-69%)",
    isNoResponses ? "0% (Sem respostas)" : `${campaign.medianaPct}%`,
  ]);
  summarySheet.addRow([
    "Fragilidades (< 50%)",
    isNoResponses ? "0% (Sem respostas)" : `${campaign.fragilidadePct}%`,
  ]);
  summarySheet.addRow([
    "Status Geral",
    isNoResponses
      ? "Sem respostas"
      : campaign.potencialidadePct >= 70
        ? "Potencialidade"
        : campaign.fragilidadePct >= 40
          ? "Fragilidade"
          : "Mediana",
  ]);

  summarySheet.addRow([]);
  summarySheet.addRow(["RESULTADOS POR ÁREA / DIMENSÃO"]);
  summarySheet.getRow(18).font = {
    size: 13,
    bold: true,
    color: { argb: "FF006837" },
  };

  summarySheet.addRow([
    "Área / Dimensão",
    "Potencialidade (%)",
    "Mediana (%)",
    "Fragilidade (%)",
    "Classificação Final",
  ]);
  const dimHeaderRow = summarySheet.getRow(19);
  dimHeaderRow.fill = HEADER_FILL;
  dimHeaderRow.font = HEADER_FONT;

  campaign.dimensions.forEach((dim) => {
    summarySheet.addRow([
      dim.dimension,
      isNoResponses ? "0%" : `${dim.potencialidadePct}%`,
      isNoResponses ? "0%" : `${dim.medianaPct}%`,
      isNoResponses ? "0%" : `${dim.fragilidadePct}%`,
      isNoResponses ? "Sem respostas" : dim.classification,
    ]);
  });

  summarySheet.columns = [
    { width: 35 },
    { width: 22 },
    { width: 20 },
    { width: 20 },
    { width: 25 },
  ];

  // ---------------------------------------------------------
  // TAB 2: POR SEGMENTO
  // ---------------------------------------------------------
  const segmentSheet = workbook.addWorksheet("Por Segmento");
  segmentSheet.addRow([
    "RESULTADOS DETALHADOS POR SEGMENTO (DISCENTES, DOCENTES, TAES)",
  ]);
  segmentSheet.getRow(1).font = {
    size: 14,
    bold: true,
    color: { argb: "FF006837" },
  };
  segmentSheet.addRow([]);

  segmentSheet.addRow([
    "Área / Dimensão",
    "Pergunta",
    "Segmento",
    "Respondentes",
    "% Aprovação",
    "Classificação",
  ]);
  const segHeaderRow = segmentSheet.getRow(3);
  segHeaderRow.fill = HEADER_FILL;
  segHeaderRow.font = HEADER_FONT;

  campaign.questions.forEach((q) => {
    const isQNoResp = q.totalAnswers === 0 || isNoResponses;
    segmentSheet.addRow([
      q.category,
      q.questionText,
      q.segment,
      q.totalAnswers,
      isQNoResp ? "0%" : `${q.approvalRate}%`,
      isQNoResp ? "Sem respostas" : q.classification,
    ]);
  });

  segmentSheet.columns = [
    { width: 25 },
    { width: 50 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 20 },
  ];

  // ---------------------------------------------------------
  // TABS POR ÁREA / DIMENSÃO (Ensino, Infraestrutura, etc.)
  // ---------------------------------------------------------
  // Group questions by Area
  const questionsByArea = new Map<
    string,
    { [qTitle: string]: { [seg: string]: ReportQuestion } }
  >();

  campaign.questions.forEach((q) => {
    const area = q.category || "Geral";
    if (!questionsByArea.has(area)) {
      questionsByArea.set(area, {});
    }
    const areaObj = questionsByArea.get(area)!;
    if (!areaObj[q.questionText]) {
      areaObj[q.questionText] = {};
    }
    areaObj[q.questionText][q.segment] = q;
  });

  questionsByArea.forEach((questionsMap, areaName) => {
    // Clean sheet name (max 31 chars, no invalid chars)
    const sheetName = areaName.substring(0, 30).replace(/[:\\\/\?\*\[\]]/g, "");
    const areaSheet = workbook.addWorksheet(sheetName || "Área");

    areaSheet.addRow([`ÁREA AVALIADA: ${areaName.toUpperCase()}`]);
    areaSheet.getRow(1).font = {
      size: 14,
      bold: true,
      color: { argb: "FF006837" },
    };
    areaSheet.addRow([
      `Campus: ${campaign.campus} | Campanha: ${campaign.title}`,
    ]);
    areaSheet.addRow([]);

    areaSheet.addRow([
      "Pergunta",
      "Discentes",
      "Docentes",
      "TAEs",
      "Resultado Final (Geral)",
    ]);
    const areaHeaderRow = areaSheet.getRow(4);
    areaHeaderRow.fill = HEADER_FILL;
    areaHeaderRow.font = HEADER_FONT;

    Object.entries(questionsMap).forEach(([qTitle, segments]) => {
      const todosQ = segments["Todos"];
      const discQ = segments["Discentes"];
      const docQ = segments["Docentes"];
      const taeQ = segments["TAEs"];

      const isNoResp = isNoResponses || !todosQ || todosQ.totalAnswers === 0;

      const formatSeg = (q?: ReportQuestion) => {
        if (!q || q.totalAnswers === 0 || isNoResponses)
          return "Sem respostas (0%)";
        return `${q.approvalRate}% (${q.classification})`;
      };

      const finalResultado = isNoResp
        ? "Sem respostas"
        : `${todosQ.approvalRate}% - ${todosQ.classification}`;

      areaSheet.addRow([
        qTitle,
        formatSeg(discQ),
        formatSeg(docQ),
        formatSeg(taeQ),
        finalResultado,
      ]);
    });

    areaSheet.columns = [
      { width: 55 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 30 },
    ];
  });

  // Generate Buffer and Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const fileName = `${campaign.title.replace(/[^a-zA-Z0-9_\-]/g, "_")}_Relatorio_CPA.xlsx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Utility to export CPA report to CSV (.csv) with area groupings
 */
export function exportReportToCsv(campaign: ReportCampaignData): void {
  const isNoResponses = campaign.totalResponses === 0;
  let csvContent = "\uFEFF"; // UTF-8 BOM for Portuguese characters in Excel

  csvContent += `RELATÓRIO DE AUTOAVALIAÇÃO CPA - IFCE\n`;
  csvContent += `Campus;${campaign.campus}\n`;
  csvContent += `Campanha;${campaign.title}\n`;
  csvContent += `Período;${campaign.period}\n`;
  csvContent += `Data de Emissão;${new Date().toLocaleDateString("pt-BR")}\n`;
  csvContent += `Total de Respondentes;${campaign.totalResponses}\n`;
  csvContent += `Status Geral;${isNoResponses ? "Sem respostas" : campaign.potencialidadePct >= 70 ? "Potencialidade" : campaign.fragilidadePct >= 40 ? "Fragilidade" : "Mediana"}\n\n`;

  // Group questions by Area
  const questionsByArea = new Map<
    string,
    { [qTitle: string]: { [seg: string]: ReportQuestion } }
  >();

  campaign.questions.forEach((q) => {
    const area = q.category || "Geral";
    if (!questionsByArea.has(area)) {
      questionsByArea.set(area, {});
    }
    const areaObj = questionsByArea.get(area)!;
    if (!areaObj[q.questionText]) {
      areaObj[q.questionText] = {};
    }
    areaObj[q.questionText][q.segment] = q;
  });

  questionsByArea.forEach((questionsMap, areaName) => {
    csvContent += `--------------------------------------------------\n`;
    csvContent += `ÁREA: ${areaName.toUpperCase()}\n`;
    csvContent += `--------------------------------------------------\n`;
    csvContent += `Pergunta;Discentes;Docentes;TAEs;Resultado Final\n`;

    Object.entries(questionsMap).forEach(([qTitle, segments]) => {
      const todosQ = segments["Todos"];
      const discQ = segments["Discentes"];
      const docQ = segments["Docentes"];
      const taeQ = segments["TAEs"];

      const cleanTitle = `"${qTitle.replace(/"/g, '""')}"`;

      const isNoResp = isNoResponses || !todosQ || todosQ.totalAnswers === 0;

      const formatSeg = (q?: ReportQuestion) => {
        if (!q || q.totalAnswers === 0 || isNoResponses)
          return "Sem respostas (0%)";
        return `"${q.approvalRate}% (${q.classification})"`;
      };

      const finalResultado = isNoResp
        ? '"Sem respostas"'
        : `"${todosQ.approvalRate}% - ${todosQ.classification}"`;

      csvContent += `${cleanTitle};${formatSeg(discQ)};${formatSeg(docQ)};${formatSeg(taeQ)};${finalResultado}\n`;
    });

    csvContent += `\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const fileName = `${campaign.title.replace(/[^a-zA-Z0-9_\-]/g, "_")}_Relatorio_CPA.csv`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
