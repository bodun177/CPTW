import { Link } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import Section from '../components/ui/Section.jsx';
import CatalogSummary from '../components/parts/CatalogSummary.jsx';
import PartFilters from '../components/parts/PartFilters.jsx';
import PartList from '../components/parts/PartList.jsx';
import usePartFilters from '../hooks/usePartFilters.js';

export default function PartListPage({ items, selectedId, onSelect }) {
  const {
    query,
    setQuery,
    availableOnly,
    setAvailableOnly,
    visibleItems,
    resetFilters,
  } = usePartFilters(items);
  const searchParams = selectedId
    ? `?${new URLSearchParams({ partId: selectedId })}`
    : '';

  return (
    <>
      <PageHeading title="Каталог запчастин" />
      <Section id="catalog" title="Пошук і вибір">
        <CatalogSummary total={items.length} />
        <PartFilters
          query={query}
          availableOnly={availableOnly}
          onQueryChange={setQuery}
          onAvailableOnlyChange={setAvailableOnly}
          onReset={resetFilters}
        />
        <p>Показано запчастин: {visibleItems.length}</p>
        <PartList
          items={visibleItems}
          selectedId={selectedId}
          onSelect={onSelect}
          emptyTitle={
            items.length === 0
              ? 'Запчастин ще не додано.'
              : 'За цими фільтрами нічого не знайдено.'
          }
        />
        <p>
          <Link to={`/searches/new${searchParams}`}>Підготувати новий підбір</Link>
        </p>
      </Section>
    </>
  );
}
