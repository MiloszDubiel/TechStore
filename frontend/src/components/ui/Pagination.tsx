import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (number) => number === 1 || number === totalPages || Math.abs(number - page) <= 2,
  );

  return (
    <div className="m-4 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="cursor-pointer border border-(--border) bg-(--surface) px-2 py-1 text-sm text-(--foreground) transition hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-base"
      >
        ←
      </button>

      {pages.map((item, index) => {
        const previous = pages[index - 1];

        return (
          <React.Fragment key={item}>
            {previous && item - previous > 1 && <span className="px-1 text-(--foreground-secondary) sm:px-2">...</span>}

            <button
              onClick={() => onPageChange(item)}
              className={`cursor-pointer border px-2 py-1 text-sm transition sm:px-3 sm:text-base ${
                page === item
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-(--border) bg-(--surface) text-(--foreground) hover:bg-orange-500/10"
              }`}
            >
              {item}
            </button>
          </React.Fragment>
        );
      })}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        test-id="next"
        className="cursor-pointer border border-(--border) bg-(--surface) px-2 py-1 text-sm text-(--foreground) transition hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-base"
      >
        →
      </button>
    </div>
  );
};
export default Pagination;
