// Utilitários puros para cálculo de status e formatação de período de campanhas/formulários.
// Extraído de FormsManagerView.tsx (God Component) para isolar lógica de negócio sem dependência de UI.

// Helper to calculate campaign/form status automatically based on current date/time
export const getCampaignStatus = (
  startDateStr?: string,
  startTimeStr: string = '08:00',
  endDateStr?: string,
  endTimeStr: string = '23:59',
  currentStatus: string = 'Ativa'
): 'Agendada' | 'Ativa' | 'Encerrada' | 'Rascunho' => {
  if (currentStatus === 'Rascunho') return 'Rascunho';

  if (!startDateStr || !endDateStr) {
    if (currentStatus === 'Agendada') return 'Agendada';
    if (currentStatus === 'Encerrado' || currentStatus === 'Encerrada') return 'Encerrada';
    return 'Ativa';
  }

  const parseDate = (dStr: string, tStr: string) => {
    let y = 0, m = 0, d = 0;
    if (dStr.includes('-')) {
      const parts = dStr.split('-');
      y = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10) - 1;
      d = parseInt(parts[2], 10);
    } else if (dStr.includes('/')) {
      const parts = dStr.split('/');
      d = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10) - 1;
      y = parseInt(parts[2], 10);
    } else {
      return new Date();
    }
    const [hh, mm] = (tStr || '00:00').split(':').map((v) => parseInt(v, 10) || 0);
    return new Date(y, m, d, hh, mm, 0);
  };

  const now = new Date();
  const start = parseDate(startDateStr, startTimeStr);
  const end = parseDate(endDateStr, endTimeStr);

  if (now < start) return 'Agendada';
  if (now > end) return 'Encerrada';
  return 'Ativa';
};

export const getCountdownBadgeInfo = (
  startDateStr?: string,
  startTimeStr: string = '08:00',
  endDateStr?: string,
  endTimeStr: string = '23:59',
  currentStatus: string = 'Ativa'
) => {
  const status = getCampaignStatus(startDateStr, startTimeStr, endDateStr, endTimeStr, currentStatus);

  if (status === 'Rascunho') {
    return {
      text: 'Rascunho em edição',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 font-semibold',
    };
  }

  if (!startDateStr || !endDateStr) {
    return {
      text: status === 'Ativa' ? 'Campanha Ativa' : status === 'Agendada' ? 'Campanha Agendada' : 'Campanha Encerrada',
      badgeClass:
        status === 'Ativa'
          ? 'bg-emerald-50 text-[#006837] border-emerald-200 font-bold'
          : status === 'Agendada'
          ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
          : 'bg-rose-50 text-rose-800 border-rose-200 font-semibold',
    };
  }

  const parseDate = (dStr: string, tStr: string) => {
    let y = 0, m = 0, d = 0;
    if (dStr.includes('-')) {
      const parts = dStr.split('-');
      y = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10) - 1;
      d = parseInt(parts[2], 10);
    } else if (dStr.includes('/')) {
      const parts = dStr.split('/');
      d = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10) - 1;
      y = parseInt(parts[2], 10);
    } else {
      return new Date();
    }
    const [hh, mm] = (tStr || '00:00').split(':').map((v) => parseInt(v, 10) || 0);
    return new Date(y, m, d, hh, mm, 0);
  };

  const now = new Date();
  const start = parseDate(startDateStr, startTimeStr);
  const end = parseDate(endDateStr, endTimeStr);

  if (status === 'Agendada') {
    const diffMs = start.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    let text = '';
    if (diffDays > 1) {
      text = `Inicia em ${diffDays} dias`;
    } else if (diffDays === 1) {
      text = `Inicia amanhã às ${startTimeStr}`;
    } else if (diffHours > 0) {
      text = `Inicia em ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else {
      text = 'Inicia em instantes';
    }

    return {
      text: `⏳ ${text}`,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
    };
  }

  if (status === 'Ativa') {
    const diffMs = end.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    let text = '';
    if (diffDays > 1) {
      text = `Restam ${diffDays} dias`;
    } else if (diffDays === 1) {
      text = `Resta 1 dia (encerra amanhã)`;
    } else if (diffHours > 0) {
      text = `Restam ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else {
      text = 'Encerra em breve';
    }

    return {
      text: `⏳ ${text}`,
      badgeClass: 'bg-emerald-50 text-[#006837] border-emerald-200 font-bold',
    };
  }

  return {
    text: '⌛ Respostas Encerradas',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 font-semibold',
  };
};

export const formatCompactPeriod = (
  startDateStr?: string,
  startTimeStr: string = '08:00',
  endDateStr?: string,
  endTimeStr: string = '23:59',
  periodoRaw?: string
) => {
  const parseStr = (str?: string) => {
    if (!str) return null;
    const s = str.trim();
    if (s.includes('-')) {
      const parts = s.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return { day: parts[2].padStart(2, '0'), month: parts[1].padStart(2, '0'), year: parts[0] };
        } else {
          return { day: parts[0].padStart(2, '0'), month: parts[1].padStart(2, '0'), year: parts[2] };
        }
      }
    }
    if (s.includes('/')) {
      const parts = s.split('/');
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return { day: parts[2].padStart(2, '0'), month: parts[1].padStart(2, '0'), year: parts[0] };
        } else {
          return { day: parts[0].padStart(2, '0'), month: parts[1].padStart(2, '0'), year: parts[2] };
        }
      }
    }
    return null;
  };

  let sD = parseStr(startDateStr);
  let eD = parseStr(endDateStr);

  if (!sD || !eD) {
    if (periodoRaw) {
      const matches = periodoRaw.match(/(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/g);
      if (matches && matches.length >= 2) {
        if (!sD) sD = parseStr(matches[0]);
        if (!eD) eD = parseStr(matches[1]);
      } else if (matches && matches.length === 1) {
        if (!sD) sD = parseStr(matches[0]);
      }
    }
  }

  let durationText = '';
  let hasDates = Boolean(sD || eD);

  if (sD && eD) {
    const d1 = new Date(parseInt(sD.year, 10), parseInt(sD.month, 10) - 1, parseInt(sD.day, 10));
    const d2 = new Date(parseInt(eD.year, 10), parseInt(eD.month, 10) - 1, parseInt(eD.day, 10));
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    durationText = `${days} ${days === 1 ? 'dia' : 'dias'}`;
  }

  if (!sD && !eD) {
    return {
      hasDates: false,
      displayDates: 'A definir',
      stackedDates: false,
      date1: 'A definir',
      date2: '',
      sameYear: true,
      tooltipStart: 'A definir',
      tooltipEnd: 'A definir',
      durationText: '',
    };
  }

  if (sD && !eD) {
    const fullStart = `${sD.day}/${sD.month}/${sD.year}`;
    return {
      hasDates: true,
      displayDates: fullStart,
      stackedDates: false,
      date1: fullStart,
      date2: '',
      sameYear: true,
      tooltipStart: `${fullStart} • ${startTimeStr || '08:00'}`,
      tooltipEnd: 'A definir',
      durationText: '',
    };
  }

  if (!sD && eD) {
    const fullEnd = `${eD.day}/${eD.month}/${eD.year}`;
    return {
      hasDates: true,
      displayDates: fullEnd,
      stackedDates: false,
      date1: fullEnd,
      date2: '',
      sameYear: true,
      tooltipStart: 'A definir',
      tooltipEnd: `${fullEnd} • ${endTimeStr || '23:59'}`,
      durationText: '',
    };
  }

  const startFull = `${sD!.day}/${sD!.month}/${sD!.year}`;
  const endFull = `${eD!.day}/${eD!.month}/${eD!.year}`;
  const sameYear = sD!.year === eD!.year;

  if (sameYear) {
    const startShort = `${sD!.day}/${sD!.month}`;
    const endShort = `${eD!.day}/${eD!.month}`;
    return {
      hasDates: true,
      displayDates: `${startShort} → ${endShort}`,
      stackedDates: false,
      date1: `${startShort} → ${endShort}`,
      date2: '',
      sameYear: true,
      tooltipStart: `${startFull} • ${startTimeStr || '08:00'}`,
      tooltipEnd: `${endFull} • ${endTimeStr || '23:59'}`,
      durationText,
    };
  } else {
    return {
      hasDates: true,
      displayDates: `${startFull} → ${endFull}`,
      stackedDates: true,
      date1: startFull,
      date2: endFull,
      sameYear: false,
      tooltipStart: `${startFull} • ${startTimeStr || '08:00'}`,
      tooltipEnd: `${endFull} • ${endTimeStr || '23:59'}`,
      durationText,
    };
  }
};

export const getCompactStatusBadge = (
  startDateStr?: string,
  startTimeStr: string = '08:00',
  endDateStr?: string,
  endTimeStr: string = '23:59',
  currentStatus: string = 'Ativa'
) => {
  const status = getCampaignStatus(startDateStr, startTimeStr, endDateStr, endTimeStr, currentStatus);

  if (status === 'Ativa') {
    return {
      status,
      label: 'Ativa',
      dotColor: 'bg-[#006837]',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold',
    };
  }
  if (status === 'Agendada') {
    return {
      status,
      label: 'Agendada',
      dotColor: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80 font-bold',
    };
  }
  if (status === 'Encerrada') {
    return {
      status,
      label: 'Encerrada',
      dotColor: 'bg-rose-500',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80 font-bold',
    };
  }
  return {
    status: 'Rascunho',
    label: 'Rascunho',
    dotColor: 'bg-slate-400',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 font-semibold',
  };
};
