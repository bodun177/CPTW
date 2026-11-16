import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchesContext } from '../context/SearchesContext.js';
import { searchService } from '../services/searchService.js';
import { errorMessage } from '../services/ServiceError.js';

export default function SearchesProvider({ children }) {
  const [searches, setSearches] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isMutating, setIsMutating] = useState(false);
  const activeRead = useRef(null);
  const readVersion = useRef(0);
  const mutationLock = useRef(false);
  const mounted = useRef(false);

  const reload = useCallback(async () => {
    if (mutationLock.current) return;
    activeRead.current?.abort();
    const controller = new AbortController();
    activeRead.current = controller;
    const version = ++readVersion.current;
    setStatus('loading');
    setError('');

    try {
      const records = await searchService.getAll({ signal: controller.signal });
      if (controller.signal.aborted || version !== readVersion.current) return;
      setSearches(records);
      setStatus('success');
    } catch (cause) {
      if (controller.signal.aborted || version !== readVersion.current) return;
      setError(errorMessage(cause));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void reload();
    return () => {
      mounted.current = false;
      activeRead.current?.abort();
      readVersion.current += 1;
    };
  }, [reload]);

  const mutate = useCallback(async (operation, apply, message) => {
    if (mutationLock.current || status !== 'success') {
      return { ok: false, message: 'Дочекайтеся завершення поточної операції.' };
    }
    mutationLock.current = true;
    setIsMutating(true);
    setNotice('');
    activeRead.current?.abort();
    readVersion.current += 1;

    try {
      const record = await operation();
      if (mounted.current) {
        setSearches((previous) => apply(previous, record));
        setNotice(message);
      }
      return { ok: true, record };
    } catch (cause) {
      return {
        ok: false,
        message: errorMessage(cause),
        errors: cause.errors,
        code: cause.code,
      };
    } finally {
      mutationLock.current = false;
      if (mounted.current) setIsMutating(false);
    }
  }, [status]);

  function createSearch(input) {
    return mutate(
      () => searchService.create(input),
      (previous, record) => [
        ...previous.filter((entry) => entry.id !== record.id),
        record,
      ],
      'Підбір створено.',
    );
  }

  function updateSearch(id, input) {
    return mutate(
      () => searchService.update(id, input),
      (previous, record) =>
        previous.map((entry) => (entry.id === id ? record : entry)),
      'Зміни підбору збережено.',
    );
  }

  const deleteSearch = useCallback(
    (id) =>
      mutate(
        () => searchService.delete(id),
        (previous) => previous.filter((entry) => entry.id !== id),
        'Підбір видалено.',
      ),
    [mutate],
  );

  const dismissNotice = useCallback(() => setNotice(''), []);

  return (
    <SearchesContext.Provider
      value={{
        searches,
        status,
        error,
        reload,
        isMutating,
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
