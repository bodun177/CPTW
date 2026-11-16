import { useNavigate, useParams } from 'react-router';
import useSearches from '../hooks/useSearches.js';
import SearchPage from './SearchPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default function SearchEditPage({ items }) {
  const { searchId } = useParams();
  const navigate = useNavigate();
  const { searches, updateSearch } = useSearches();
  const search = searches.find((entry) => entry.id === searchId);

  if (!search) return <NotFoundPage title="Підбір для редагування не знайдено" />;

  const item = items.find((entry) => entry.id === search.partId);
  if (!item) return <NotFoundPage title="Запчастина підбору відсутня" />;

  function handleSave(input) {
    const result = updateSearch(search.id, input);
    if (result.ok) {
      navigate(`/searches/${encodeURIComponent(result.record.id)}`, {
        replace: true,
      });
    }
    return result;
  }

  return (
    <SearchPage
      key={`edit-${search.id}`}
      title={`Редагування підбору ${search.id}`}
      item={item}
      initialDraft={{
        carBrand: search.carBrand,
        carModel: search.carModel,
        comment: search.comment,
        quantity: search.quantity,
        urgent: search.urgent,
      }}
      onSave={handleSave}
      submitLabel="Зберегти зміни"
      onCancel={() =>
        navigate(`/searches/${encodeURIComponent(search.id)}`)
      }
    />
  );
}
