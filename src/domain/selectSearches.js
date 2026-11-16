export function selectSearches(searches, items, { query, urgent, sort }) {
  const names = new Map(items.map((item) => [item.id, item.name]));
  const normalizedQuery = query.trim().toLocaleLowerCase('uk');

  const selected = searches.filter((search) => {
    const text =
      `${names.get(search.partId) ?? ''} ${search.carBrand} ${search.carModel} ${search.comment}`.toLocaleLowerCase(
        'uk',
      );
    const matchesUrgent =
      urgent === 'all' || (urgent === 'yes' ? search.urgent : !search.urgent);
    return text.includes(normalizedQuery) && matchesUrgent;
  });

  return selected.sort((a, b) => {
    let order = 0;
    if (sort === 'quantity-asc') order = a.quantity - b.quantity;
    else if (sort === 'quantity-desc') order = b.quantity - a.quantity;
    else {
      order = (names.get(a.partId) ?? '').localeCompare(
        names.get(b.partId) ?? '',
        'uk',
      );
    }
    return order || a.id.localeCompare(b.id);
  });
}
