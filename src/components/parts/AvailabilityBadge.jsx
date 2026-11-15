export default function AvailabilityBadge({ available }) {
  const label = available ? 'В наявності' : 'Немає в наявності';
  const className = available ? 'status available' : 'status';

  return <span className={className}>{label}</span>;
}
