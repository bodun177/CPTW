import HomePage from './HomePage.jsx';
import usePartSelection from '../hooks/usePartSelection.js';

export default function CatalogContainer({ items }) {
  const { selectedId, selectPart } = usePartSelection();

  return (
    <HomePage
      items={items}
      selectedId={selectedId}
      onSelect={selectPart}
    />
  );
}
