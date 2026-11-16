import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import useSearches from '../hooks/useSearches.js';
import useDeleteSearch from '../hooks/useDeleteSearch.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function SearchDetailsPage({ items }) {
  const { searchId } = useParams();
  const navigate = useNavigate();
  const { searches } = useSearches();
  const deleteWithConfirmation = useDeleteSearch(items);
  const [error, setError] = useState('');
  const search = searches.find((entry) => entry.id === searchId);

  if (!search) return <NotFoundPage title="Підбір не знайдено" />;

  const item = items.find((entry) => entry.id === search.partId);

  function handleDelete() {
    setError('');
    const result = deleteWithConfirmation(search);
    if (result.ok) navigate('/searches', { replace: true });
    else if (!result.cancelled) setError(result.message);
  }

  return (
    <>
      <PageHeading title={`Підбір ${search.id}`} />
      {error && <p role="alert">{error}</p>}
      <dl>
        <dt>Запчастина</dt>
        <dd>{item?.name ?? 'Запчастина відсутня в каталозі'}</dd>
        <dt>Авто</dt>
        <dd>
          {search.carBrand} {search.carModel}
        </dd>
        <dt>Коментар</dt>
        <dd>{search.comment}</dd>
        <dt>Кількість, шт.</dt>
        <dd>{search.quantity}</dd>
        <dt>Доставка</dt>
        <dd>{search.urgent ? 'Термінова' : 'Звичайна'}</dd>
      </dl>
      <p>Збережений підбір не є підтвердженням замовлення.</p>
      <p>
        <Link to={`/searches/${encodeURIComponent(search.id)}/edit`}>
          Редагувати підбір
        </Link>
      </p>
      <AppButton variant="secondary" onClick={handleDelete}>
        Видалити підбір
      </AppButton>
      <p>
        <Link to="/searches">До всіх підборів</Link>
      </p>
    </>
  );
}
