import PartListPage from './PartListPage.jsx';
import usePartSelection from '../hooks/usePartSelection.js';

export default function CatalogContainer({ items }) {
  const { selectedId, selectPart } = usePartSelection();

  return (
    <PartListPage
      items={items}
      selectedId={selectedId}
      onSelect={selectPart}
    />
  );
}
