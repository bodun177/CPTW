import PartCard from './PartCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function PartList({
  items,
  selectedId,
  onSelect,
  emptyTitle = 'Запчастин ще не додано.',
}) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <ul className="part-grid">
      {items.map((item) => (
        <li key={item.id}>
          <PartCard
            item={item}
            selected={item.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
