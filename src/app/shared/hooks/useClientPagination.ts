import { useCallback, useState } from 'react';

export const useClientPagination = <T>(items: T[], pageSize: number) => {
  const [requestedPage, setRequestedPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount - 1);
  const hasNext = page < pageCount - 1;

  const loadMore = useCallback(() => {
    setRequestedPage((current) => Math.min(current + 1, pageCount - 1));
  }, [pageCount]);

  return {
    page,
    setPage: setRequestedPage,
    hasNext,
    totalCount: items.length,
    pageItems: items.slice(page * pageSize, (page + 1) * pageSize),
    revealedItems: items.slice(0, (page + 1) * pageSize),
    loadMore,
  };
};
