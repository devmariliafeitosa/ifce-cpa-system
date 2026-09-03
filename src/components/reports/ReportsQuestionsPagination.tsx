interface ReportsQuestionsPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function ReportsQuestionsPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalCount,
  onPageChange,
}: ReportsQuestionsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 pt-3">
      <span className="text-xs text-slate-500 font-medium">
        Exibindo {startIndex + 1}–
        {Math.min(endIndex, totalCount)} de{" "}
        <strong className="text-slate-800">
          {totalCount}
        </strong>{" "}
        perguntas
      </span>

      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(Math.max(1, currentPage - 1))
          }
          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          ← Anterior
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1,
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`w-7 h-7 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              pageNumber === currentPage
                ? "bg-[#006837] text-white shadow-2xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(
              Math.min(totalPages, currentPage + 1),
            )
          }
          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}