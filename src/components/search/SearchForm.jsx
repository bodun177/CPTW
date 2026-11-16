import AppButton from '../ui/AppButton.jsx';
import FormField from '../ui/FormField.jsx';

export default function SearchForm({
  idPrefix,
  partName,
  draft,
  errors,
  operationError,
  onChange,
  onBlur,
  onSubmit,
  onReset,
  submitLabel,
  isSubmitting = false,
}) {
  const brandId = `${idPrefix}-brand`;
  const modelId = `${idPrefix}-model`;
  const commentId = `${idPrefix}-comment`;
  const quantityId = `${idPrefix}-quantity`;
  const urgentId = `${idPrefix}-urgent`;
  const hasErrors = Object.keys(errors).length > 0;

  function describedBy(id, error, hasHint = true) {
    const hint = hasHint ? `${id}-hint` : '';
    const message = error ? `${id}-error` : '';
    return [hint, message].filter(Boolean).join(' ') || undefined;
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-label="Форма підбору запчастини"
      aria-busy={isSubmitting}
    >
      <fieldset disabled={isSubmitting}>
        <legend>Дані підбору</legend>
        <p>Запчастина: {partName}</p>
        <p>
          Збережіть зміни кнопкою нижче. Незбережене введення зникає при виході
          зі сторінки або її перезавантаженні.
        </p>
        {hasErrors && <p role="alert">Виправте позначені поля.</p>}
        {errors.partId && <p role="alert">{errors.partId}</p>}
        {operationError && <p role="alert">{operationError}</p>}

        <FormField
          id={brandId}
          label="Марка авто (обов'язково)"
          hint="Від 2 до 30 символів."
          error={errors.carBrand}
        >
          <input
            id={brandId}
            name="carBrand"
            required
            value={draft.carBrand}
            onChange={(event) => onChange('carBrand', event.target.value)}
            onBlur={() => onBlur('carBrand')}
            aria-invalid={Boolean(errors.carBrand)}
            aria-describedby={describedBy(brandId, errors.carBrand)}
          />
        </FormField>

        <FormField
          id={modelId}
          label="Модель авто (обов'язково)"
          hint="До 40 символів."
          error={errors.carModel}
        >
          <input
            id={modelId}
            name="carModel"
            required
            value={draft.carModel}
            onChange={(event) => onChange('carModel', event.target.value)}
            onBlur={() => onBlur('carModel')}
            aria-invalid={Boolean(errors.carModel)}
            aria-describedby={describedBy(modelId, errors.carModel)}
          />
        </FormField>

        <FormField
          id={commentId}
          label="Коментар (обов'язково)"
          hint="Від 10 до 500 символів без крайніх пробілів. Опишіть вузол або рік випуску авто."
          error={errors.comment}
        >
          <textarea
            id={commentId}
            name="comment"
            rows={3}
            required
            value={draft.comment}
            onChange={(event) => onChange('comment', event.target.value)}
            onBlur={() => onBlur('comment')}
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={describedBy(commentId, errors.comment)}
          />
        </FormField>

        <FormField
          id={quantityId}
          label="Кількість, шт. (обов'язково)"
          hint="Ціле число від 1 до 10."
          error={errors.quantity}
        >
          <input
            id={quantityId}
            name="quantity"
            type="number"
            min={1}
            max={10}
            step={1}
            required
            value={draft.quantity}
            onChange={(event) => onChange('quantity', event.target.value)}
            onBlur={() => onBlur('quantity')}
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={describedBy(quantityId, errors.quantity)}
          />
        </FormField>

        <div>
          <label className="checkbox-field" htmlFor={urgentId}>
            <input
              id={urgentId}
              name="urgent"
              type="checkbox"
              checked={draft.urgent}
              onChange={(event) => onChange('urgent', event.target.checked)}
              onBlur={() => onBlur('urgent')}
              aria-invalid={Boolean(errors.urgent)}
              aria-describedby={describedBy(urgentId, errors.urgent)}
            />
            Потрібна термінова доставка
          </label>
          <p id={`${urgentId}-hint`} className="field-hint">
            Для кількості понад 4 одиниці коментар має містити не менше 20 символів.
          </p>
          {errors.urgent && (
            <p id={`${urgentId}-error`} className="field-error">
              {errors.urgent}
            </p>
          )}
        </div>

        <div
          className="form-actions"
          onMouseDown={(event) => event.preventDefault()}
        >
          <AppButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Збереження…' : submitLabel}
          </AppButton>
          <AppButton
            variant="secondary"
            disabled={isSubmitting}
            onClick={onReset}
          >
            Відновити початкові поля
          </AppButton>
        </div>
      </fieldset>
      <p role="status">{isSubmitting ? 'Збереження підбору…' : ''}</p>
    </form>
  );
}
