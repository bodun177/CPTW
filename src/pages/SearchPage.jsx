import Section from '../components/ui/Section.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import AvailabilityBadge from '../components/parts/AvailabilityBadge.jsx';
import SearchFormPreview from '../components/search/SearchFormPreview.jsx';

export default function SearchPage({ item }) {
  return (
    <Section id="search" title="Підбір запчастин">
      {item ? (
        <>
          <p>
            Приклад для запчастини «{item.name}»:{' '}
            <AvailabilityBadge available={item.available} />
          </p>
          <SearchFormPreview idPrefix="search-preview" partName={item.name} />
        </>
      ) : (
        <EmptyState title="Немає запчастини для підбору.">
          <p>
            <a href="#catalog">Переглянути каталог</a>
          </p>
        </EmptyState>
      )}
    </Section>
  );
}
