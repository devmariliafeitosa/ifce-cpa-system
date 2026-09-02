import { useState, useCallback } from 'react';
import type { SmartQuestion } from '../types';

export function useFormWizard() {
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardQuestions, setWizardQuestions] = useState<SmartQuestion[]>([]);
  const [wizardTitle, setWizardTitle] = useState('');
  const [wizardDescription, setWizardDescription] = useState('');
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});

  const toggleQuestionExpanded = useCallback((id: string) => {
    setExpandedQuestionIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleMoveWizardQuestion = useCallback((id: string, direction: 'up' | 'down') => {
    setWizardQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const newArr = [...prev];
      const temp = newArr[idx];
      newArr[idx] = newArr[targetIdx];
      newArr[targetIdx] = temp;
      return newArr;
    });
  }, []);

  const handleUpdateWizardQuestionField = useCallback((id: string, field: keyof SmartQuestion, value: never) => {
    setWizardQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (field === 'type') {
            let options: string[] | undefined = undefined;
            if (value === 'SCALE') {
              options = ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'];
            } else if (value === 'YES_NO') {
              options = ['Sim', 'Não'];
            } else if (['RADIO', 'CHECKBOX'].includes(value)) {
              options = q.options && q.options.length > 0 ? q.options : ['Opção 1', 'Opção 2'];
            }
            return { ...q, type: value, options };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  }, []);

  const handleRemoveWizardQuestion = useCallback((id: string) => {
    setWizardQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const handleAddGeneralQuestion = useCallback(() => {
    const newId = `q-${crypto.randomUUID()}`;
    setWizardQuestions((prev) => [
      ...prev,
      {
        id: newId,
        title: '',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: ['todos'],
        options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
      },
    ]);
    setExpandedQuestionIds((prev) => ({ ...prev, [newId]: true }));
  }, []);

  return {
    wizardStep,
    setWizardStep,
    wizardQuestions,
    setWizardQuestions,
    wizardTitle,
    setWizardTitle,
    wizardDescription,
    setWizardDescription,
    expandedQuestionIds,
    setExpandedQuestionIds,
    toggleQuestionExpanded,
    handleMoveWizardQuestion,
    handleUpdateWizardQuestionField,
    handleRemoveWizardQuestion,
    handleAddGeneralQuestion,
  };
}