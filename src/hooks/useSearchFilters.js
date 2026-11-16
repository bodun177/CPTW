import { useSearchParams } from 'react-router';
import { selectSearches } from '../domain/selectSearches.js';

export default function useSearchFilters(searches, items) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const rawUrgent = searchParams.get('urgent');
  const urgent = ['yes', 'no'].includes(rawUrgent) ? rawUrgent : 'all';
  const rawSort = searchParams.get('sort');
  const sort = ['quantity-asc', 'quantity-desc'].includes(rawSort)
    ? rawSort
    : 'part';
  const visibleSearches = selectSearches(searches, items, {
    query,
    urgent,
    sort,
  });

  function setParameter(name, value, defaultValue, replace = false) {
    const next = new URLSearchParams(searchParams);
    if (value === defaultValue) next.delete(name);
    else next.set(name, value);
    setSearchParams(next, { replace });
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    next.delete('urgent');
    next.delete('sort');
    setSearchParams(next);
  }

  return {
    query,
    urgent,
    sort,
    visibleSearches,
    setQuery: (value) => setParameter('q', value, '', true),
    setUrgent: (value) => setParameter('urgent', value, 'all'),
    setSort: (value) => setParameter('sort', value, 'part'),
    resetFilters,
  };
}
