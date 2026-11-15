import AppButton from '../ui/AppButton.jsx';
import FormField from '../ui/FormField.jsx';

export default function SearchFormPreview({ idPrefix, partName }) {
  const nameId = `${idPrefix}-name`;
  const brandId = `${idPrefix}-brand`;
  const modelId = `${idPrefix}-model`;
  const commentId = `${idPrefix}-comment`;
  const noticeId = `${idPrefix}-notice`;

  return (
    <form
      aria-label="Макет пошуку запчастин"
      aria-describedby={noticeId}
      onSubmit={(event) => event.preventDefault()}
    >
      <p id={noticeId}>
        Це макет для перевірки структури полів. Дані не зберігаються.
      </p>

      <FormField id={nameId} label="Назва запчастини">
        <input id={nameId} name="partName" value={partName} readOnly />
      </FormField>

      <FormField id={brandId} label="Марка авто">
        <input id={brandId} name="brand" defaultValue="" />
      </FormField>

      <FormField id={modelId} label="Модель авто">
        <input id={modelId} name="model" defaultValue="" />
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
          defaultValue=""
          aria-describedby={`${commentId}-hint`}
        />
      </FormField>

      <div className="form-actions">
        <AppButton type="reset" variant="secondary">
          Очистити
        </AppButton>
        <AppButton disabled>Пошук буде доступний пізніше</AppButton>
      </div>
    </form>
  );
}
