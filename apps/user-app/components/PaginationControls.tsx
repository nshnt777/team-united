'use client';

import { useRouter } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      router.push(`/teams?page=${page}`);
    }
  };

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-4 py-2 border rounded ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Previous
      </button>

      <span className="mx-4">Page {currentPage} of {totalPages}</span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 border rounded ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Next
      </button>
    </div>
  );
}
