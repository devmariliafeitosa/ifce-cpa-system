import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export interface SettingsToastData {
  message: string;
  type: "success" | "info";
}

interface SettingsToastProps {
  toast: SettingsToastData | null;
  onClose: () => void;
}

export function SettingsToast({ toast, onClose }: SettingsToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between shadow-2xs border ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-[#006837]"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:opacity-75 cursor-pointer text-slate-500 text-xs"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
