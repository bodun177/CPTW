import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import SearchFilters from '../components/search/SearchFilters.jsx';
import SearchTable from '../components/search/SearchTable.jsx';
import useSearches from '../hooks/useSearches.js';
import useSearchFilters from '../hooks/useSearchFilters.js';
import useDeleteSearch from '../hooks/useDeleteSearch.js';

export default function SearchesPage({ items }) {
  const { searches, isMutating, reload } = useSearches();
  const filters = useSearchFilters(searches, items);
  const deleteWithConfirmation = useDeleteSearch(items);
  const [error, setError] = useState('');
  const pageAlive = useRef(false);

  useEffect(() => {
    pageAlive.current = true;
    return () => {
      pageAlive.current = false;
    };
  }, []);

  const handleDelete = useCallback(
    async (search) => {
      if (isMutating) return;
      setError('');
      const result = await deleteWithConfirmation(search);
      if (pageAlive.current && !result.ok && !result.cancelled) {
        setError(result.message);
      }
    },
    [deleteWithConfirmation, isMutating],
  );

  return (
    <>
      <PageHeading title="Підбори запчастин" />
      <p>
        <Link to="/parts">Створити підбір (вибрати запчастину в каталозі)</Link>
      </p>
      <p>
        <AppButton
          variant="secondary"
          disabled={isMutating}
          onClick={() => void reload()}
        >
          Оновити дані
        </AppButton>
      </p>
      <p role="status">{isMutating ? 'Опрацювання зміни…' : ''}</p>
      <SearchFilters
        query={filters.query}
        urgent={filters.urgent}
        sort={filters.sort}
        onQueryChange={filters.setQuery}
        onUrgentChange={filters.setUrgent}
        onSortChange={filters.setSort}
        onReset={filters.resetFilters}
      />
      <p>
        Показано: {filters.visibleSearches.length} із {searches.length}
      </p>
      {error && <p role="alert">{error}</p>}
      {searches.length === 0 ? (
        <EmptyState title="Підборів ще немає.">
          <p>
            <Link to="/parts">Виберіть запчастину для першого підбору</Link>
          </p>
        </EmptyState>
      ) : filters.visibleSearches.length === 0 ? (
        <EmptyState title="За цими умовами нічого не знайдено.">
          <AppButton variant="secondary" onClick={filters.resetFilters}>
            Показати всі підбори
          </AppButton>
        </EmptyState>
      ) : (
        <SearchTable
          searches={filters.visibleSearches}
          items={items}
          onDelete={handleDelete}
          disabled={isMutating}
        />
      )}
    </>
  );
}
