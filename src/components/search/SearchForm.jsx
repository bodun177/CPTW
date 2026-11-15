import AppButton from '../ui/AppButton.jsx';
import FormField from '../ui/FormField.jsx';

export default function SearchForm({
  idPrefix,
  partName,
  draft,
  onFieldChange,
  onReset,
}) {
  const nameId = `${idPrefix}-name`;
  const brandId = `${idPrefix}-brand`;
  const modelId = `${idPrefix}-model`;
  const commentId = `${idPrefix}-comment`;
  const noticeId = `${idPrefix}-notice`;

  return (
    <form
      aria-label="Чернетка підбору запчастини"
      aria-describedby={noticeId}
      onSubmit={(event) => event.preventDefault()}
    >
      <p id={noticeId}>
        Зміни не зберігаються. Чернетка скидається при виході зі сторінки,
        зміні запчастини чи запису або перезавантаженні. Пошук ще недоступний.
      </p>

      <FormField id={nameId} label="Запчастина">
        <input id={nameId} name="partName" value={partName} readOnly />
      </FormField>

      <FormField id={brandId} label="Марка авто">
        <input
          id={brandId}
          name="carBrand"
          value={draft.carBrand}
          onChange={(event) => onFieldChange('carBrand', event.target.value)}
        />
      </FormField>

      <FormField id={modelId} label="Модель авто">
        <input
          id={modelId}
          name="carModel"
          value={draft.carModel}
          onChange={(event) => onFieldChange('carModel', event.target.value)}
        />
      </FormField>

      <FormField
        id={commentId}
        label="Коментар"
        hint="Опишіть, який саме вузол потрібен або який рік випуску авто."
      >
        <textarea
          id={commentId}
          name="comment"
          rows={3}
          value={draft.comment}
          onChange={(event) => onFieldChange('comment', event.target.value)}
          aria-describedby={`${commentId}-hint`}
        />
      </FormField>

      <label className="checkbox-field">
        <input
          name="urgent"
          type="checkbox"
          checked={draft.urgent}
          onChange={(event) => onFieldChange('urgent', event.target.checked)}
        />
        Потрібна термінова доставка
      </label>

      <div className="form-actions">
        <AppButton variant="secondary" onClick={onReset}>
          Очистити поля
        </AppButton>
        <AppButton disabled>Пошук буде доступний пізніше</AppButton>
      </div>
    </form>
  );
}
