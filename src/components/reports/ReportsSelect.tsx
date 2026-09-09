import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ReportsSelectOption {
  value: string;
  label: string;
}

interface ReportsSelectProps {
  value: string;
  options: ReportsSelectOption[];
  onChange: (value: string) => void;
}

export function ReportsSelect({
  value,
  options,
  onChange,
}: ReportsSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
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
    <div
      ref={containerRef}
      className="relative min-w-[120px]"
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`h-8 w-full px-3 bg-white border rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-between gap-2 transition-all cursor-pointer ${
          isOpen
            ? "border-[#006837] ring-1 ring-[#006837]/20"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className="truncate">
          {selectedOption?.label ?? "Selecione"}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 w-full min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-xl p-1.5">
          <div className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg flex items-center justify-between gap-3 text-left text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-[#006837]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#006837] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}