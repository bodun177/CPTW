import SearchRow from './SearchRow.jsx';

export default function SearchTable({ searches, items, onDelete, disabled = false }) {
  return (
    <div className="table-scroll">
      <table className="searches-table">
        <caption>Підбори з поточного знімка даних</caption>
        <thead>
          <tr>
            <th scope="col">Запчастина і коментар</th>
            <th scope="col">Авто</th>
            <th scope="col">К-сть</th>
            <th scope="col">Термінова</th>
            <th scope="col">Дії</th>
          </tr>
        </thead>
        <tbody>
          {searches.map((search) => (
            <SearchRow
              key={search.id}
              search={search}
              partName={
                items.find((entry) => entry.id === search.partId)?.name ??
                'Запчастина відсутня'
              }
              onDelete={onDelete}
              disabled={disabled}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
