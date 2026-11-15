import { useState } from 'react';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import AppButton from '../ui/AppButton.jsx';

export default function PartCard({ item, selected, onSelect }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const descriptionId = `part-${item.id}-description`;

  return (
    <article className="part-card">
      <h3>{item.name}</h3>
      <p className="category">{item.category}</p>
      <p>
        Марка: {item.brand}, модель авто: {item.carModel}
      </p>
      <p>Ціна: {item.price} грн</p>
      <p>
        <AvailabilityBadge available={item.available} />
      </p>

      <AppButton
        variant="secondary"
        aria-expanded={detailsOpen}
        aria-controls={descriptionId}
        onClick={() => setDetailsOpen((previous) => !previous)}
      >
        {detailsOpen ? 'Згорнути опис' : 'Показати опис'}
      </AppButton>
      <p id={descriptionId} hidden={!detailsOpen}>
        {item.description}
      </p>

      <p>
        <AppButton
          aria-pressed={selected}
          onClick={() => onSelect(item.id)}
        >
          Вибрати «{item.name}»
        </AppButton>
      </p>
      {selected && <p className="selection-note">Обрано для підбору.</p>}
    </article>
  );
}
