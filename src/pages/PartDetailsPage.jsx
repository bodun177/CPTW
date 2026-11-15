import { Link, useNavigate, useParams } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import AvailabilityBadge from '../components/parts/AvailabilityBadge.jsx';
import usePartSelection from '../hooks/usePartSelection.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function PartDetailsPage({ items }) {
  const { partId } = useParams();
  const navigate = useNavigate();
  const { selectPart } = usePartSelection();
  const item = items.find((entry) => entry.id === partId);

  if (!item) {
    return (
      <NotFoundPage
        title="Запчастину не знайдено"
        message="У локальному каталозі немає запчастини з таким ідентифікатором."
      />
    );
  }

  function handlePrepareSearch() {
    selectPart(item.id);
    const search = new URLSearchParams({ partId: item.id });
    navigate(`/searches/new?${search}`);
  }

  return (
    <>
      <PageHeading title={item.name} />
      <p className="category">{item.category}</p>
      <p>
        Марка: {item.brand}, модель авто: {item.carModel}
      </p>
      <p>Ціна: {item.price} грн</p>
      <p>{item.description}</p>
      <p>
        <AvailabilityBadge available={item.available} />
      </p>
      <AppButton onClick={handlePrepareSearch}>
        Вибрати й підготувати підбір
      </AppButton>
      <p>
        <Link to="/parts">До каталогу без фільтрів</Link>
      </p>
    </>
  );
}
