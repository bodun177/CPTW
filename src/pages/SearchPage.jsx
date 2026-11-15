import { useEffect, useState } from 'react';
import Section from '../components/ui/Section.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import AvailabilityBadge from '../components/parts/AvailabilityBadge.jsx';
import SearchForm from '../components/search/SearchForm.jsx';
import SearchSummary from '../components/search/SearchSummary.jsx';

function createEmptyDraft() {
  return { carBrand: '', carModel: '', comment: '', urgent: false };
}

export default function SearchPage({ item, onClearSelection }) {
  const [draft, setDraft] = useState(createEmptyDraft);
  const title = item ? `Автопідбір: ${item.name}` : 'Автопідбір';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  function handleFieldChange(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }

  function handleReset() {
    setDraft(createEmptyDraft());
  }

  if (!item) {
    return (
      <Section id="search" title="Підбір запчастин">
        <EmptyState title="Запчастину ще не вибрано.">
          <p>
            <a href="#catalog">Виберіть запчастину в каталозі</a>
          </p>
        </EmptyState>
      </Section>
    );
  }

  return (
    <Section id="search" title="Підбір запчастин">
      <p>
        Обрано «{item.name}»: <AvailabilityBadge available={item.available} />
      </p>
      <SearchForm
        idPrefix="search-draft"
        partName={item.name}
        draft={draft}
        onFieldChange={handleFieldChange}
        onReset={handleReset}
      />
      <SearchSummary partName={item.name} draft={draft} />
      <AppButton variant="secondary" onClick={onClearSelection}>
        Скасувати вибір і очистити чернетку
      </AppButton>
    </Section>
  );
}
