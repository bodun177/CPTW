import SearchPage from './SearchPage.jsx';
import usePartSelection from '../hooks/usePartSelection.js';

export default function SearchContainer() {
  const { selectedId, selectedItem, clearSelection } = usePartSelection();

  return (
    <SearchPage
      key={selectedId ?? 'empty'}
      item={selectedItem}
      onClearSelection={clearSelection}
    />
  );
}
