import type {
  ReportCampaignData,
  ReportDimensionResult,
  ReportQuestion,
  ReportQuestionAlternative,
} from "../data/reportsData";
import type { SmartForm, SmartQuestion } from "../types";

export function convertSmartFormToReportCampaign(
  form: SmartForm,
): ReportCampaignData {
  const totalResponses = form.responsesCount?.total ?? 0;
  const questionsCount = form.questions?.length ?? 0;

  // Extract year & semester
  let year = "2026";
  const yearMatch = (
    form.title +
    " " +
    (form.periodo || "") +
    " " +
    (form.startDate || "")
  ).match(/20\d{2}/);
  if (yearMatch) {
    year = yearMatch[0];
  }

  let semester = `${year}.2`;
  const semMatch = (form.title + " " + (form.periodo || "")).match(
    /\b20\d{2}\.[12]\b/,
  );
  if (semMatch) {
    semester = semMatch[0];
  } else if (form.startDate) {
    const parts = form.startDate.split("-");
    if (parts.length === 3) {
      const y = parts[0];
      const m = parseInt(parts[1], 10);
      semester = `${y}.${m >= 7 ? 2 : 1}`;
    }
  }

  // Status mapping
  const currentStatusStr = String(form.status || "").toLowerCase();
  const isFinished =
    currentStatusStr.includes("encerrad") ||
    currentStatusStr.includes("finalizad");
  const status: "Finalizada" | "Em andamento" = isFinished
    ? "Finalizada"
    : "Em andamento";

  // Response rate calculation
  const estimatedCampusUniverse = 1600;
  const responseRate =
    totalResponses > 0
      ? Math.min(
          99.9,
          Math.round((totalResponses / estimatedCampusUniverse) * 1000) / 10,
        )
      : 0;

  const reportQuestions: ReportQuestion[] = [];

  (form.questions || []).forEach((q: SmartQuestion, idx: number) => {
    const targetSegments: Array<"Todos" | "Discentes" | "Docentes" | "TAEs"> = [
      "Todos",
      "Discentes",
      "Docentes",
      "TAEs",
    ];

    targetSegments.forEach((seg) => {
      let segmentAnswers = 0;
      if (seg === "Todos") segmentAnswers = totalResponses;
      else if (seg === "Discentes")
        segmentAnswers =
          form.responsesCount?.alunos ?? Math.round(totalResponses * 0.75);
      else if (seg === "Docentes")
        segmentAnswers =
          form.responsesCount?.docentes ?? Math.round(totalResponses * 0.15);
      else if (seg === "TAEs")
        segmentAnswers =
          form.responsesCount?.taes ?? Math.round(totalResponses * 0.1);

      let approvalRate = 0;
      let classification:
        | "Potencialidade"
        | "Mediana"
        | "Fragilidade"
        | "Sem respostas" = "Sem respostas";
      let alternatives: ReportQuestionAlternative[] = [];

      if (segmentAnswers === 0) {
        approvalRate = 0;
        classification = "Sem respostas";

        if (q.type === "SCALE") {
          alternatives = [
            { option: "Ótimo / Bom", count: 0, percentage: 0 },
            { option: "Regular", count: 0, percentage: 0 },
            { option: "Ruim / Péssimo", count: 0, percentage: 0 },
            { option: "Não sei / Não se aplica", count: 0, percentage: 0 },
          ];
        } else if (q.options && q.options.length > 0) {
          alternatives = q.options.map((opt) => ({
            option: opt,
            count: 0,
            percentage: 0,
          }));
        } else {
          alternatives = [
            { option: "Sim", count: 0, percentage: 0 },
            { option: "Não", count: 0, percentage: 0 },
          ];
        }
      } else {
        // Deterministic mock distributions based on question index & title hash
        const hashSeed = (q.title.length + idx * 7) % 3;

        if (q.type === "SCALE") {
          let pOtimo = 64;
          let pRegular = 22;
          let pRuim = 10;
          let pNa = 4;

          if (hashSeed === 1) {
            pOtimo = 78;
            pRegular = 14;
            pRuim = 5;
            pNa = 3;
          } else if (hashSeed === 2) {
            pOtimo = 48;
            pRegular = 32;
            pRuim = 15;
            pNa = 5;
          }

          approvalRate = pOtimo + pRegular;
          const cOtimo = Math.round((segmentAnswers * pOtimo) / 100);
          const cRegular = Math.round((segmentAnswers * pRegular) / 100);
          const cRuim = Math.round((segmentAnswers * pRuim) / 100);
          const cNa = Math.max(0, segmentAnswers - cOtimo - cRegular - cRuim);

          alternatives = [
            { option: "Ótimo / Bom", count: cOtimo, percentage: pOtimo },
            { option: "Regular", count: cRegular, percentage: pRegular },
            { option: "Ruim / Péssimo", count: cRuim, percentage: pRuim },
            { option: "Não sei / Não se aplica", count: cNa, percentage: pNa },
          ];
        } else if (q.options && q.options.length > 0) {
          const countOpts = q.options.length;
          let remainingPct = 100;
          let remainingCount = segmentAnswers;

          alternatives = q.options.map((opt, i) => {
            let pct = 0;
            if (i === countOpts - 1) {
              pct = Math.max(0, remainingPct);
            } else {
              pct = Math.round((remainingPct / (countOpts - i)) * 1.2);
              if (pct > remainingPct) pct = remainingPct;
            }
            remainingPct -= pct;
            const cnt = Math.round((segmentAnswers * pct) / 100);
            remainingCount -= cnt;
            return { option: opt, count: cnt, percentage: pct };
          });

          approvalRate = alternatives[0]?.percentage ?? 70;
        } else {
          // YES_NO or Default
          const pSim = 82;
          const pNao = 18;
          approvalRate = pSim;
          const cSim = Math.round((segmentAnswers * pSim) / 100);
          const cNao = segmentAnswers - cSim;

          alternatives = [
            { option: "Sim", count: cSim, percentage: pSim },
            { option: "Não", count: cNao, percentage: pNao },
          ];
        }

        if (approvalRate >= 70) {
          classification = "Potencialidade";
        } else if (approvalRate >= 50) {
          classification = "Mediana";
        } else {
          classification = "Fragilidade";
        }
      }

      reportQuestions.push({
        id: `${q.id}-${seg.toLowerCase()}`,
        questionText: q.title,
        category: q.category || "Ensino",
        segment: seg,
        totalAnswers: segmentAnswers,
        approvalRate,
        classification,
        alternatives,
      });
    });
  });

  // Calculate dimension results using 'Todos' segment
  const allSegmentQuestions = reportQuestions.filter(
    (q) => q.segment === "Todos",
  );

  const dimensionsMap = new Map<string, ReportQuestion[]>();
  allSegmentQuestions.forEach((q) => {
    const cat = q.category || "Outros";
    if (!dimensionsMap.has(cat)) {
      dimensionsMap.set(cat, []);
    }
    dimensionsMap.get(cat)!.push(q);
  });

  const dimensions: ReportDimensionResult[] = [];
  dimensionsMap.forEach((qs, dimName) => {
    const totalQ = qs.length;
    let potCount = 0;
    let medCount = 0;
    let fragCount = 0;

    qs.forEach((q) => {
      if (q.classification === "Potencialidade") potCount++;
      else if (q.classification === "Mediana") medCount++;
      else if (q.classification === "Fragilidade") fragCount++;
    });

    const potPct =
      totalResponses > 0 && totalQ > 0
        ? Math.round((potCount / totalQ) * 100)
        : 0;
    const medPct =
      totalResponses > 0 && totalQ > 0
        ? Math.round((medCount / totalQ) * 100)
        : 0;
    const fragPct =
      totalResponses > 0 && totalQ > 0
        ? Math.round((fragCount / totalQ) * 100)
        : 0;

    let dimClass:
      | "Potencialidade"
      | "Mediana"
      | "Fragilidade"
      | "Sem respostas" = "Sem respostas";
    if (totalResponses > 0) {
      if (potPct >= 60) dimClass = "Potencialidade";
      else if (fragPct >= 40) dimClass = "Fragilidade";
      else dimClass = "Mediana";
    }

    dimensions.push({
      dimension: dimName,
      potencialidadePct: potPct,
      medianaPct: medPct,
      fragilidadePct: fragPct,
      classification: dimClass,
    });
  });

  // Resumo Geral
  const totalReportQuestions = allSegmentQuestions.length;
  let totalPot = 0;
  let totalMed = 0;
  let totalFrag = 0;

  if (totalResponses > 0) {
    allSegmentQuestions.forEach((q) => {
      if (q.classification === "Potencialidade") totalPot++;
      else if (q.classification === "Mediana") totalMed++;
      else if (q.classification === "Fragilidade") totalFrag++;
    });
  }

  const potencialidadePct =
    totalResponses > 0 && totalReportQuestions > 0
      ? Math.round((totalPot / totalReportQuestions) * 100)
      : 0;
  const medianaPct =
    totalResponses > 0 && totalReportQuestions > 0
      ? Math.round((totalMed / totalReportQuestions) * 100)
      : 0;
  const fragilidadePct =
    totalResponses > 0 && totalReportQuestions > 0
      ? Math.round((totalFrag / totalReportQuestions) * 100)
      : 0;

  return {
    id: form.id,
    title: form.title,
    campus: form.campus || "Campus Tauá",
    period: form.periodo || `${year}.2`,
    year,
    semester,
    status,
    totalResponses,
    totalQuestions: questionsCount,
    responseRate,
    avgResponseTime: totalResponses > 0 ? "5.2 min" : "—",
    updatedAt:
      form.updatedAt ||
      form.createdAt ||
      new Date().toLocaleDateString("pt-BR"),
    potencialidadePct,
    medianaPct,
    fragilidadePct,
    dimensions,
    questions: reportQuestions,
  };
}

export function buildReportsFromSmartForms(
  forms: SmartForm[],
): ReportCampaignData[] {
  return forms.map((f) => convertSmartFormToReportCampaign(f));
}
