import { useState } from 'react';
import { SearchesContext } from '../context/SearchesContext.js';
import { searches as initialSearches } from '../data/searches.js';
import { validateSearch } from '../domain/searchValidation.js';

export default function SearchesProvider({ items, children }) {
  const [searches, setSearches] = useState(() =>
    initialSearches.map((search) => ({ ...search })),
  );
  const [notice, setNotice] = useState('');

  function createSearch(input) {
    const validation = validateSearch(input, items);
    if (!validation.ok) return validation;

    const record = {
      id: `s-${crypto.randomUUID()}`,
      ...validation.value,
    };
    setSearches((previous) => [...previous, record]);
    setNotice('Підбір створено в поточній локальній колекції.');
    return { ok: true, record };
  }

  function updateSearch(id, input) {
    const current = searches.find((search) => search.id === id);
    if (!current) {
      return { ok: false, message: 'Підбір для оновлення не знайдено.' };
    }

    const validation = validateSearch(input, items);
    if (!validation.ok) return validation;

    const record = { ...validation.value, id: current.id };
    setSearches((previous) =>
      previous.map((search) => (search.id === id ? record : search)),
    );
    setNotice('Зміни підбору збережено в поточній локальній колекції.');
    return { ok: true, record };
  }

  function deleteSearch(id) {
    if (!searches.some((search) => search.id === id)) {
      return { ok: false, message: 'Підбір для видалення не знайдено.' };
    }

    setSearches((previous) => previous.filter((search) => search.id !== id));
    setNotice('Підбір видалено з поточної локальної колекції.');
    return { ok: true };
  }

  function dismissNotice() {
    setNotice('');
  }

  return (
    <SearchesContext.Provider
      value={{
        searches,
        createSearch,
        updateSearch,
        deleteSearch,
        notice,
        dismissNotice,
      }}
    >
      {children}
    </SearchesContext.Provider>
  );
}
