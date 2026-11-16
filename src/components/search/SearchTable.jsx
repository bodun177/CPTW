import { Link } from 'react-router';
import AppButton from '../ui/AppButton.jsx';

export default function SearchTable({ searches, items, onDelete }) {
  return (
    <div className="table-scroll">
      <table className="searches-table">
        <caption>Підбори поточної локальної колекції</caption>
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
          {searches.map((search) => {
            const item = items.find((entry) => entry.id === search.partId);
            const path = `/searches/${encodeURIComponent(search.id)}`;

            return (
              <tr key={search.id}>
                <td>
                  <strong>{item?.name ?? 'Запчастина відсутня'}</strong>
                  <p>{search.comment}</p>
                </td>
                <td>
                  {search.carBrand} {search.carModel}
                </td>
                <td>{search.quantity}</td>
                <td>{search.urgent ? 'Так' : 'Ні'}</td>
                <td>
                  <p>
                    <Link to={path}>Переглянути</Link>
                  </p>
                  <p>
                    <Link to={`${path}/edit`}>Редагувати</Link>
                  </p>
                  <AppButton
                    variant="secondary"
                    onClick={() => onDelete(search)}
                  >
                    Видалити
                  </AppButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
