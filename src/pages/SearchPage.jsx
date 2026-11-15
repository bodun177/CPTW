import { useState } from 'react';
import PageHeading from '../components/ui/PageHeading.jsx';
import Section from '../components/ui/Section.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import AvailabilityBadge from '../components/parts/AvailabilityBadge.jsx';
import SearchForm from '../components/search/SearchForm.jsx';
import SearchSummary from '../components/search/SearchSummary.jsx';

const emptyDraft = { carBrand: '', carModel: '', comment: '', urgent: false };

export default function SearchPage({
  title,
  item,
  initialDraft = emptyDraft,
  onCancel,
  cancelLabel = 'Вийти без збереження',
}) {
  const [draft, setDraft] = useState(() => ({ ...initialDraft }));

  function handleFieldChange(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }

  function handleReset() {
    setDraft({ ...emptyDraft });
  }

  return (
    <>
      <PageHeading title={title} />
      <Section id="search-editor" title="Поля та підсумок">
        <p>
          Запчастина «{item.name}»:{' '}
          <AvailabilityBadge available={item.available} />
        </p>
        <SearchForm
          idPrefix="search-draft"
          partName={item.name}
          draft={draft}
          onFieldChange={handleFieldChange}
          onReset={handleReset}
        />
        <SearchSummary partName={item.name} draft={draft} />
      </Section>
      <AppButton variant="secondary" onClick={onCancel}>
        {cancelLabel}
      </AppButton>
    </>
  );
}
