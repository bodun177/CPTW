import AvailabilityBadge from './AvailabilityBadge.jsx';

export default function PartCard({ item }) {
  return (
    <article className="part-card">
      <h3>{item.name}</h3>
      <p className="category">{item.category}</p>
      <p>
        Марка: {item.brand}, модель авто: {item.carModel}
      </p>
      <p>Ціна: {item.price} грн</p>
      <p>{item.description}</p>
      <p>
        <AvailabilityBadge available={item.available} />
      </p>
    </article>
  );
}
