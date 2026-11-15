import { Link } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function SearchesPage({ searches, items }) {
  return (
    <>
      <PageHeading title="Підбори запчастин" />
      <p>Нижче наведено локальні демонстраційні записи.</p>
      {searches.length === 0 ? (
        <EmptyState title="Підборів ще немає.">
          <p>
            <Link to="new">Підготувати новий підбір</Link>
          </p>
        </EmptyState>
      ) : (
        <div className="table-scroll">
          <table className="searches-table">
            <caption>Підбори для перевірки навігації</caption>
            <thead>
              <tr>
                <th scope="col">Запчастина</th>
                <th scope="col">Авто</th>
                <th scope="col">Дія</th>
              </tr>
            </thead>
            <tbody>
              {searches.map((search) => {
                const item = items.find((entry) => entry.id === search.partId);

                return (
                  <tr key={search.id}>
                    <td>{item?.name ?? 'Запчастина відсутня в каталозі'}</td>
                    <td>
                      {search.carBrand} {search.carModel}
                    </td>
                    <td>
                      <Link to={`${encodeURIComponent(search.id)}/edit`}>
                        Редагувати {search.id}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
