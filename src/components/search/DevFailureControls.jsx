import { dataSource } from '../../services/searchService.js';
import { failNextMockRequest } from '../../services/mockSearchService.js';
import useSearches from '../../hooks/useSearches.js';

export default function DevFailureControls() {
  const { isMutating, reload } = useSearches();

  if (process.env.NODE_ENV !== 'development' || dataSource !== 'mock') {
    return null;
  }

  return (
    <details>
      <summary>Навчальна перевірка відмов (лише режим розробки)</summary>
      <p>
        <button
          type="button"
          disabled={isMutating}
          onClick={() => {
            failNextMockRequest('getAll');
            void reload();
          }}
        >
          Перевірити відмову читання
        </button>
      </p>
      {['create', 'update', 'delete'].map((operation) => (
        <p key={operation}>
          <button type="button" onClick={() => failNextMockRequest(operation)}>
            Відмовити наступну операцію: {operation}
          </button>
        </p>
      ))}
    </details>
  );
}
