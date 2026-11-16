export default function SearchSummary({ partName, draft }) {
  const car = `${draft.carBrand.trim()} ${draft.carModel.trim()}`.trim();
  const comment = draft.comment.trim();

  return (
    <aside aria-labelledby="search-summary-title">
      <h3 id="search-summary-title">Поточна чернетка</h3>
      <dl>
        <dt>Запчастина</dt>
        <dd>{partName}</dd>
        <dt>Авто</dt>
        <dd>{car || 'Ще не вказано'}</dd>
        <dt>Коментар</dt>
        <dd>{comment || 'Ще не вказано'}</dd>
        <dt>Кількість, шт.</dt>
        <dd>{draft.quantity === '' ? 'Ще не вказано' : draft.quantity}</dd>
        <dt>Доставка</dt>
        <dd>{draft.urgent ? 'Термінова' : 'Звичайна'}</dd>
      </dl>
      <p>Цей підсумок не підтверджує замовлення.</p>
    </aside>
  );
}
