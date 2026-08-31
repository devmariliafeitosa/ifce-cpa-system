import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface SettingsSelectOption {
  value: string;
  label: string;
}

interface SettingsSelectProps {
  value: string;
  options: SettingsSelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

export function SettingsSelect({
  value,
  options,
  onChange,
  ariaLabel,
}: SettingsSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`w-full h-8 px-2.5 bg-slate-50/70 border rounded-lg text-xs font-semibold text-slate-800 transition-all flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white ${
          isOpen
            ? "border-[#006837] ring-1 ring-[#006837]"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className="truncate text-left">{selectedOption?.label}</span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden p-1"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full min-h-8 px-2.5 py-2 rounded-md text-left text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 text-[#006837] font-bold"
                    : "text-slate-700 font-medium hover:bg-slate-50"
                }`}
              >
                <span>{option.label}</span>

                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
