import { useState } from 'react';

export default function usePartFilters(items) {
  const [query, setQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase('uk');
  const visibleItems = items.filter((item) => {
    const searchable = `${item.name} ${item.brand} ${item.carModel}`;
    return (
      searchable.toLocaleLowerCase('uk').includes(normalizedQuery) &&
      (!availableOnly || item.available)
    );
  });

  function resetFilters() {
    setQuery('');
    setAvailableOnly(false);
  }

  return {
    query,
    setQuery,
    availableOnly,
    setAvailableOnly,
    visibleItems,
    resetFilters,
  };
}
