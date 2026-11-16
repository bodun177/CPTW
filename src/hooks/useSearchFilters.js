import { useSearchParams } from 'react-router';

export default function useSearchFilters(searches, items) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const rawUrgent = searchParams.get('urgent');
  const urgent = ['yes', 'no'].includes(rawUrgent) ? rawUrgent : 'all';
  const rawSort = searchParams.get('sort');
  const sort = ['quantity-asc', 'quantity-desc'].includes(rawSort)
    ? rawSort
    : 'part';
  const names = new Map(items.map((item) => [item.id, item.name]));
  const normalizedQuery = query.trim().toLocaleLowerCase('uk');

  const visibleSearches = searches.filter((search) => {
    const text =
      `${names.get(search.partId) ?? ''} ${search.carBrand} ${search.carModel} ${search.comment}`.toLocaleLowerCase(
        'uk',
      );
    const matchesUrgent =
      urgent === 'all' || (urgent === 'yes' ? search.urgent : !search.urgent);
    return text.includes(normalizedQuery) && matchesUrgent;
  });

  visibleSearches.sort((a, b) => {
    let order = 0;
    if (sort === 'quantity-asc') order = a.quantity - b.quantity;
    else if (sort === 'quantity-desc') order = b.quantity - a.quantity;
    else {
      order = (names.get(a.partId) ?? '').localeCompare(
        names.get(b.partId) ?? '',
        'uk',
      );
    }
    return order || a.id.localeCompare(b.id);
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
