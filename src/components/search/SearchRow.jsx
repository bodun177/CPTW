import { memo } from 'react';
import { Link } from 'react-router';
import AppButton from '../ui/AppButton.jsx';

function SearchRow({ search, partName, onDelete, disabled }) {
  const path = `/searches/${encodeURIComponent(search.id)}`;

  return (
    <tr>
      <td>
        <strong>{partName}</strong>
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
          disabled={disabled}
          onClick={() => onDelete(search)}
        >
          Видалити
        </AppButton>
      </td>
    </tr>
  );
}

export default memo(SearchRow);
