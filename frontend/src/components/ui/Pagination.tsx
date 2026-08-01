import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (number) =>
      number === 1 || number === totalPages || Math.abs(number - page) <= 2
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 m-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className=" disabled:opacity-40 hover:bg-orange-100 px-3 py-1 border border-gray-200 rounded cursor-pointer"
      >
        ←
      </button>

      {pages.map((item, index) => {
        const previous = pages[index - 1];
        return (
          <React.Fragment key={item}>
            {previous && item - previous > 1 && (
              <span className="px-2">...</span>
            )}

            <button
              onClick={() => onPageChange(item)}
              className={`
                px-3
                py-1
                rounded
                border
                transition
                cursor-pointer

                ${
                  page === item
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 hover:bg-orange-100"
                }
              `}
            >
              {item}
            </button>
          </React.Fragment>
        );
      })}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className=" disabled:opacity-40 hover:bg-orange-100 px-3 py-1 border border-gray-200 rounded cursor-pointer"
      >
        →
      </button>
    </div>
  );
};
export default Pagination;
