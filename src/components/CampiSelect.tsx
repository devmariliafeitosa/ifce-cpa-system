import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check, Search } from 'lucide-react';
import { IFCE_CAMPUSES } from '../data/campuses';

interface CampiSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
}

export const CampiSelect: React.FC<CampiSelectProps> = ({
  value,
  onChange,
  error,
  id = 'reg-campus',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Helper function for accent-insensitive search normalization
  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredCampuses = IFCE_CAMPUSES.filter((campus) =>
    normalizeText(campus).includes(normalizeText(searchTerm))
  );

  const handleSelect = (campusName: string) => {
    onChange(campusName);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
        Campi
      </label>

      {/* Main Trigger Button */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Building2 className="w-4 h-4" />
        </div>

        <button
          id={id}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-12 pl-10 pr-10 text-left text-sm bg-slate-50 border ${
            error
              ? 'border-red-500 focus:ring-red-200'
              : isOpen
              ? 'border-[#0B7A3E] ring-4 ring-[#0B7A3E]/10'
              : 'border-[#D9D9D9] hover:border-slate-400 focus:border-[#0B7A3E] focus:ring-4 focus:ring-[#0B7A3E]/10'
          } rounded-xl text-slate-900 focus:outline-hidden transition-all duration-200 cursor-pointer flex items-center justify-between`}
        >
          <span className={value ? 'text-slate-900 font-medium' : 'text-slate-400'}>
            {value ? `Campus ${value}` : 'Selecione o seu campus...'}
          </span>
        </button>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0B7A3E]' : ''}`}
          />
        </div>
      </div>

      {/* Custom Floating Dropdown Menu (Opens Upward) */}
      {isOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-white border border-slate-200/90 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Quick Search Header */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar campus..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0B7A3E] focus:ring-2 focus:ring-[#0B7A3E]/10"
              />
            </div>
          </div>

          {/* Scrollable Items List - Restricted height (max 4-5 items visible) */}
          <div className="max-h-44 overflow-y-auto p-1 divide-y divide-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredCampuses.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                Nenhum campus encontrado
              </div>
            ) : (
              filteredCampuses.map((campusName) => {
                const isSelected = value === campusName;
                return (
                  <button
                    key={campusName}
                    type="button"
                    onClick={() => handleSelect(campusName)}
                    className={`w-full text-left px-3 py-2.5 text-xs rounded-lg flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E8F5EE] text-[#0B7A3E] font-semibold'
                        : 'text-slate-700 hover:bg-[#E8F5EE] hover:text-[#0B7A3E]'
                    }`}
                  >
                    <span>Campus {campusName}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0B7A3E]" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note displaying total count */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-right font-medium">
            33 Campi IFCE
          </div>
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-600 pt-0.5">{error}</p>}
    </div>
  );
};
