// Methodology Etapa 1: Classify answer to satisfaction level
export type SatisfactionLevel = 'Baixo' | 'Médio' | 'Alto' | 'Ignorado';

export function classifyAnswer(value: string | number | undefined | null): SatisfactionLevel {
  if (value === null || value === undefined) return 'Ignorado';
  const valStr = String(value).trim().toLowerCase();

  if (
    valStr.includes('não possuo') ||
    valStr.includes('não se aplica') ||
    valStr.includes('sem informação') ||
    valStr.includes('não sei') ||
    valStr === '0' ||
    valStr === 'n/a'
  ) {
    return 'Ignorado';
  }

  // Baixo
  if (
    valStr === 'não' ||
    valStr === 'raramente' ||
    valStr === 'nunca' ||
    valStr === 'baixa' ||
    valStr === 'insuficiente' ||
    valStr === 'péssimo' ||
    valStr === 'ruim' ||
    valStr === 'inadequado' ||
    valStr === '1' ||
    valStr === '2' ||
    valStr.includes('não atende') ||
    valStr.includes('não soube')
  ) {
    return 'Baixo';
  }

  // Médio
  if (
    valStr === 'parcialmente' ||
    valStr === 'moderada' ||
    valStr === 'regular' ||
    valStr === '3' ||
    valStr.includes('atendeu parcialmente') ||
    valStr.includes('tenho conhecimento, mas não')
  ) {
    return 'Médio';
  }

  // Alto
  if (
    valStr === 'sim' ||
    valStr === 'sempre' ||
    valStr === 'frequentemente' ||
    valStr === 'alta' ||
    valStr === 'bom' ||
    valStr === 'ótimo' ||
    valStr === 'otimo' ||
    valStr === 'adequado' ||
    valStr === '4' ||
    valStr === '5' ||
    valStr.includes('sim, ativamente') ||
    valStr.includes('atende plenamente') ||
    valStr.includes('superou') ||
    valStr.includes('na maioria das vezes')
  ) {
    return 'Alto';
  }

  const num = Number(valStr);
  if (!isNaN(num)) {
    if (num <= 2) return 'Baixo';
    if (num === 3) return 'Médio';
    if (num >= 4) return 'Alto';
  }

  return 'Alto';
}

// Methodology Etapa 2: Segment Result Badge Classification
export type CpaSegmentResult = 'Fragilidade' | 'Avaliação Mediana' | 'Potencialidade' | 'Sem Respostas';

export function getSegmentResult(percentAlto: number, totalValid: number): CpaSegmentResult {
  if (totalValid === 0) return 'Sem Respostas';
  if (percentAlto < 50) return 'Fragilidade';
  if (percentAlto < 70) return 'Avaliação Mediana';
  return 'Potencialidade';
}

// Methodology Etapa 3: Final Combination across 3 segments
export type CpaFinalResult =
  | 'Fragilidade'
  | 'Avaliação Mediana'
  | 'Potencialidade'
  | 'Tendência de Fragilidade'
  | 'Tendência de Potencialidade'
  | 'Controvérsia'
  | 'Sem Dados Suficientes';

export function calculateCpaFinalResult(
  alunosRes: CpaSegmentResult,
  docentesRes: CpaSegmentResult,
  taesRes: CpaSegmentResult
): CpaFinalResult {
  const list = [alunosRes, docentesRes, taesRes].filter((r) => r !== 'Sem Respostas');
  if (list.length === 0) return 'Sem Dados Suficientes';

  const countP = list.filter((r) => r === 'Potencialidade').length;
  const countF = list.filter((r) => r === 'Fragilidade').length;
  const countM = list.filter((r) => r === 'Avaliação Mediana').length;

  // Unanimous cases
  if (countP === list.length) return 'Potencialidade';
  if (countF === list.length) return 'Fragilidade';
  if (countM === list.length) return 'Avaliação Mediana';

  // Conflict between Fragilidade and Potencialidade
  if (countP > 0 && countF > 0) {
    if (countF > countP) return 'Fragilidade';
    return 'Controvérsia';
  }

  // Combination of Avaliação Mediana + Potencialidade
  if (countP > 0 && countM > 0 && countF === 0) {
    return 'Tendência de Potencialidade';
  }

  // Combination of Avaliação Mediana + Fragilidade
  if (countF > 0 && countM > 0 && countP === 0) {
    return 'Tendência de Fragilidade';
  }

  return 'Avaliação Mediana';
}