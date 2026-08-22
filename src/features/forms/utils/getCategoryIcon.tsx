import React from 'react';
import { Building2, BookOpen, GraduationCap, Award, Users, Layers } from 'lucide-react';

/* Ícone representativo de cada categoria/dimensão avaliada pela CPA.
 * Extraído de ReportsView.tsx (usado em várias seções do relatório). */

export const getCategoryIcon = (category: string): React.ReactNode => {
  const cat = category.toLowerCase();
  if (cat.includes('infra')) return <Building2 className="w-4 h-4 text-[#006837]" />;
  if (cat.includes('biblio')) return <BookOpen className="w-4 h-4 text-blue-600" />;
  if (cat.includes('ensino')) return <GraduationCap className="w-4 h-4 text-[#006837]" />;
  if (cat.includes('gestã') || cat.includes('gestao')) return <Award className="w-4 h-4 text-amber-600" />;
  if (cat.includes('assistê') || cat.includes('estudant')) return <Users className="w-4 h-4 text-purple-600" />;
  return <Layers className="w-4 h-4 text-[#006837]" />;
};
