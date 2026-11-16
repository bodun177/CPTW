import { useState } from 'react';
import PageHeading from '../components/ui/PageHeading.jsx';
import Section from '../components/ui/Section.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import AvailabilityBadge from '../components/parts/AvailabilityBadge.jsx';
import SearchForm from '../components/search/SearchForm.jsx';
import SearchSummary from '../components/search/SearchSummary.jsx';
import { validateSearch } from '../domain/searchValidation.js';

const emptyDraft = {
  carBrand: '',
  carModel: '',
  comment: '',
  quantity: 1,
  urgent: false,
};

const fieldOrder = ['carBrand', 'carModel', 'comment', 'quantity', 'urgent'];

export default function SearchPage({
  title,
  item,
  initialDraft = emptyDraft,
  onSave,
  onCancel,
  submitLabel,
  cancelLabel = 'Вийти без збереження',
}) {
  const initialValues = {
    carBrand: initialDraft.carBrand,
    carModel: initialDraft.carModel,
    comment: initialDraft.comment,
    quantity: String(initialDraft.quantity),
    urgent: initialDraft.urgent,
  };
  const [draft, setDraft] = useState(() => ({ ...initialValues }));
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [operationError, setOperationError] = useState('');
  const validation = validateSearch({ ...draft, partId: item.id }, [item]);
  const errors = Object.fromEntries(
    Object.entries(validation.errors).filter(
      ([field]) => attempted || touched[field],
    ),
  );
  const isDirty = fieldOrder.some((field) => draft[field] !== initialValues[field]);

  function handleChange(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
    setOperationError('');
  }

  function handleBlur(field) {
    setTouched((previous) => ({ ...previous, [field]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);
    setOperationError('');

    if (!validation.ok) {
      const firstField = fieldOrder.find((field) => validation.errors[field]);
      if (firstField) {
        event.currentTarget.elements.namedItem(firstField)?.focus();
      }
      return;
    }

    const result = onSave(validation.value);
    if (!result.ok) {
      setOperationError(
        result.message || Object.values(result.errors).join(' '),
      );
    }
  }

  function handleReset() {
    if (!isDirty) return;
    if (
      !window.confirm('Відкинути введені зміни та відновити початкові поля?')
    ) {
      return;
    }
    setDraft({ ...initialValues });
    setTouched({});
    setAttempted(false);
    setOperationError('');
  }

  function handleCancel() {
    if (isDirty && !window.confirm('Вийти та відкинути незбережені зміни?')) {
      return;
    }
    onCancel();
  }

  return (
    <>
      <PageHeading title={title} />
      <Section id="search-editor" title="Поля та підсумок">
        <p>
          <AvailabilityBadge available={item.available} />
        </p>
        <SearchForm
          idPrefix="search-draft"
          partName={item.name}
          draft={draft}
          errors={errors}
          operationError={operationError}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          onReset={handleReset}
          submitLabel={submitLabel}
        />
        <SearchSummary partName={item.name} draft={draft} />
      </Section>
      <AppButton variant="secondary" onClick={handleCancel}>
        {cancelLabel}
      </AppButton>
    </>
  );
}
