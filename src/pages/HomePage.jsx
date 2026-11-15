import Section from '../components/ui/Section.jsx';
import CatalogSummary from '../components/parts/CatalogSummary.jsx';
import PartFilters from '../components/parts/PartFilters.jsx';
import PartList from '../components/parts/PartList.jsx';
import usePartFilters from '../hooks/usePartFilters.js';

export default function HomePage({ items, selectedId, onSelect }) {
  const {
    query,
    setQuery,
    availableOnly,
    setAvailableOnly,
    visibleItems,
    resetFilters,
  } = usePartFilters(items);

  return (
    <>
      <Section id="about" title="Про застосунок">
        <p>Каталог автозапчастин для навчального проєкту.</p>
        <p>Виберіть запчастину і перейдіть до підбору.</p>
      </Section>

      <Section id="catalog" title="Каталог запчастин">
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
          <a href="#search">Перейти до підбору</a>
        </p>
      </Section>
    </>
  );
}
