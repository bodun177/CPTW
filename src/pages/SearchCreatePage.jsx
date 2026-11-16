import { Link, useNavigate, useSearchParams } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import usePartSelection from '../hooks/usePartSelection.js';
import useSearches from '../hooks/useSearches.js';
import SearchPage from './SearchPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default function SearchCreatePage({ items }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedId, clearSelection } = usePartSelection();
  const { createSearch } = useSearches();
  const partId = searchParams.get('partId');

  if (partId === null) {
    const lastSelectionSearch = selectedId
      ? `?${new URLSearchParams({ partId: selectedId })}`
      : null;

    return (
      <>
        <PageHeading title="Новий підбір" />
        <EmptyState title="Спочатку виберіть запчастину.">
          <p>
            <Link to="/parts">Відкрити каталог</Link>
          </p>
          {lastSelectionSearch && (
            <p>
              <Link to={lastSelectionSearch}>Використати останній вибір</Link>
            </p>
          )}
        </EmptyState>
      </>
    );
  }

  const item = items.find((entry) => entry.id === partId);

  if (!item) {
    return <NotFoundPage title="Запчастину нового підбору не знайдено" />;
  }

  function handleSave(input) {
    const result = createSearch(input);
    if (result.ok) {
      navigate(`/searches/${encodeURIComponent(result.record.id)}`, {
        replace: true,
      });
    }
    return result;
  }

  function handleCancel() {
    clearSelection();
    navigate('/parts', { replace: true });
  }

  return (
    <SearchPage
      key={`new-${item.id}`}
      title="Новий підбір"
      item={item}
      onSave={handleSave}
      submitLabel="Створити підбір"
      onCancel={handleCancel}
      cancelLabel="Скасувати чернетку й очистити вибір"
    />
  );
}
