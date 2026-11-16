import useSearches from '../../hooks/useSearches.js';

export default function SearchesGate({ children }) {
  const { status, error, reload } = useSearches();

  if (status === 'loading') {
    return (
      <section aria-busy="true" aria-label="Підбори">
        <p role="status">Завантаження підборів…</p>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section aria-label="Помилка завантаження">
        <p role="alert">{error}</p>
        <button type="button" onClick={() => void reload()}>
          Спробувати ще раз
        </button>
      </section>
    );
  }

  return children;
}
