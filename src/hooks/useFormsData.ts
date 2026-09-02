import { useCallback, useEffect, useMemo, useState } from 'react';
import { formsService } from '../services/formsService';
import type { SmartForm } from '../types';

function addPeriodFromDate(periodMap: Map<string, string>, startDate: string) {
  const parts = startDate.split('-');
  if (parts.length !== 3) return;

  const semester = `${parts[0]}.${Number.parseInt(parts[1], 10) >= 7 ? 2 : 1}`;
  periodMap.set(semester, `Semestre ${semester}`);
}

function addFormPeriod(periodMap: Map<string, string>, form: SmartForm) {
  const semesterMatch = /\b20\d{2}\.[12]\b/.exec(`${form.title} ${form.periodo || ''}`);
  if (semesterMatch) {
    const semester = semesterMatch[0];
    periodMap.set(semester, `Semestre ${semester}`);
  }

  const period = form.periodo?.trim();
  if (!period) {
    if (form.startDate) addPeriodFromDate(periodMap, form.startDate);
    return;
  }

  if (/^\d{4}\.[12]$/.test(period)) {
    periodMap.set(period, `Semestre ${period}`);
    return;
  }

  if (!semesterMatch && form.startDate) {
    addPeriodFromDate(periodMap, form.startDate);
  }
}

export function useFormsData() {
  const [forms, setForms] = useState<SmartForm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Ativo' | 'Rascunho' | 'Encerrado'>('todos');
  const [audienceFilter, setAudienceFilter] = useState<'todos' | 'alunos' | 'docentes' | 'taes'>('todos');
  const [campusFilter, setCampusFilter] = useState<string>('todos');
  const [periodFilter, setPeriodFilter] = useState<string>('todos');

  // Função para recarregamento manual (ex: clique de botão)
  const loadForms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await formsService.getAll();
      setForms(data as unknown as SmartForm[]);
    } catch (error) {
      console.error('Erro ao carregar formulários:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregamento inicial assíncrono (sem setState síncrono no corpo do efeito)
  useEffect(() => {
    let isMounted = true;

    formsService
      .getAll()
      .then((data) => {
        if (isMounted) {
          setForms(data as unknown as SmartForm[]);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Erro ao carregar formulários:', error);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Períodos disponíveis
  const availablePeriods = useMemo(() => {
    const periodMap = new Map<string, string>();
    forms.forEach((form) => addFormPeriod(periodMap, form));

    return Array.from(periodMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => b.value.localeCompare(a.value));
  }, [forms]);

  // Filtragem completa
  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      const matchesSearch =
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'todos' || f.status === statusFilter;

      const matchesAudience =
        audienceFilter === 'todos' ||
        f.questions?.some(
          (q) => q.audiences.includes('todos') || q.audiences.includes(audienceFilter)
        );

      const matchesCampus = campusFilter === 'todos' || f.campus === campusFilter;

      const matchesPeriod = (() => {
        if (periodFilter === 'todos') return true;
        const filterLower = periodFilter.toLowerCase();

        if (f.periodo?.toLowerCase().includes(filterLower)) return true;
        if (f.title?.toLowerCase().includes(filterLower)) return true;

        if (f.startDate) {
          const parts = f.startDate.split('-');
          if (parts.length === 3) {
            const sem = `${parts[0]}.${Number.parseInt(parts[1], 10) >= 7 ? 2 : 1}`;
            if (sem.toLowerCase() === filterLower) return true;
          }
        }
        return false;
      })();

      return matchesSearch && matchesStatus && matchesAudience && matchesCampus && matchesPeriod;
    });
  }, [forms, searchTerm, statusFilter, audienceFilter, campusFilter, periodFilter]);

  return {
    forms,
    setForms,
    isLoading,
    loadForms,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    audienceFilter,
    setAudienceFilter,
    campusFilter,
    setCampusFilter,
    periodFilter,
    setPeriodFilter,
    availablePeriods,
    filteredForms,
  };
}