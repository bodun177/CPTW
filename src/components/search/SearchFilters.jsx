import AppButton from '../ui/AppButton.jsx';
import FormField from '../ui/FormField.jsx';

export default function SearchFilters({
  query,
  urgent,
  sort,
  onQueryChange,
  onUrgentChange,
  onSortChange,
  onReset,
}) {
  return (
    <div className="search-filters">
      <FormField id="searches-query" label="Пошук у підборах">
        <input
          id="searches-query"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </FormField>
      <FormField id="searches-urgent" label="Термінова доставка">
        <select
          id="searches-urgent"
          value={urgent}
          onChange={(event) => onUrgentChange(event.target.value)}
        >
          <option value="all">Усі підбори</option>
          <option value="yes">Термінова</option>
          <option value="no">Звичайна</option>
        </select>
      </FormField>
      <FormField id="searches-sort" label="Упорядкування">
        <select
          id="searches-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="part">За назвою запчастини</option>
          <option value="quantity-asc">Спочатку менша кількість</option>
          <option value="quantity-desc">Спочатку більша кількість</option>
        </select>
      </FormField>
      <AppButton variant="secondary" onClick={onReset}>
        Скинути умови
      </AppButton>
    </div>
  );
}
