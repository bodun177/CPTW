import useSearches from './useSearches.js';

export default function useDeleteSearch(items) {
  const { deleteSearch } = useSearches();

  return function deleteWithConfirmation(search) {
    const item = items.find((entry) => entry.id === search.partId);
    const name = item?.name ?? search.partId;
    const confirmed = window.confirm(
      `Видалити підбір ${search.id} для «${name}»? ` +
        'Запис буде вилучено з поточної локальної колекції. Скасування видалення не передбачено.',
    );

    if (!confirmed) return { ok: false, cancelled: true };
    return deleteSearch(search.id);
  };
}
