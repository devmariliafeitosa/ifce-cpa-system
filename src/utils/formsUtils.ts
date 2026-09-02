export function getCampaignStatus(
  startDate: string,
  startTime: string | undefined,
  endDate: string,
  endTime: string | undefined,
  status: string
) {
  // 1. Respeita encerramento ou rascunho manual
  if (status === 'encerrado') return 'Encerrado';
  if (status === 'rascunho') return 'Rascunho';

  // 2. Combina data e hora para precisão exata
  const now = new Date();
  const start = new Date(`${startDate}T${startTime || '00:00:00'}`);
  const end = new Date(`${endDate}T${endTime || '23:59:59'}`);

  if (now < start) return 'Rascunho';
  if (now > end) return 'Encerrado';
  return 'Publicado';
}