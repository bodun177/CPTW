import { useNavigate, useParams } from 'react-router';
import SearchPage from './SearchPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default function SearchEditPage({ searches, items }) {
  const { searchId } = useParams();
  const navigate = useNavigate();
  const search = searches.find((entry) => entry.id === searchId);

  if (!search) {
    return (
      <NotFoundPage
        title="Підбір не знайдено"
        message="Перевірте ідентифікатор підбору в адресі."
      />
    );
  }

  const item = items.find((entry) => entry.id === search.partId);

  if (!item) {
    return (
      <NotFoundPage
        title="Запчастина підбору відсутня"
        message="Демонстраційний запис посилається на відсутню запчастину."
      />
    );
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
        urgent: search.urgent,
      }}
      onCancel={() => navigate('/searches')}
    />
  );
}
