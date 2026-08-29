import type { SmartForm } from "../types";

interface DashboardDimension {
  dimension: string;
  potencialidadePct: number;
  medianaPct: number;
  fragilidadePct: number;
}

interface DashboardReport {
  id: string;
  totalResponses: number;
  dimensions: DashboardDimension[];
}

function getDimensionPercentages(
  index: number,
  hasResponses: boolean,
) {
  if (!hasResponses) {
    return {
      potencialidadePct: 0,
      medianaPct: 0,
      fragilidadePct: 0,
    };
  }

  const profile = index % 3;

  if (profile === 0) {
    return {
      potencialidadePct: 70,
      medianaPct: 20,
      fragilidadePct: 10,
    };
  }

  if (profile === 1) {
    return {
      potencialidadePct: 45,
      medianaPct: 40,
      fragilidadePct: 15,
    };
  }

  return {
    potencialidadePct: 35,
    medianaPct: 20,
    fragilidadePct: 45,
  };
}

export function buildReportsFromSmartForms(
  forms: SmartForm[],
): DashboardReport[] {
  return forms.map((form) => {
    const uniqueDimensions = Array.from(
      new Set(
        form.questions.map(
          (question) =>
            question.category ?? "Outros",
        ),
      ),
    );

    const hasResponses =
      form.responsesCount.total > 0;

    const dimensions: DashboardDimension[] =
      uniqueDimensions.map(
        (dimension, index) => ({
          dimension,
          ...getDimensionPercentages(
            index,
            hasResponses,
          ),
        }),
      );

    return {
      id: form.id,
      totalResponses:
        form.responsesCount.total,
      dimensions,
    };
  });
}