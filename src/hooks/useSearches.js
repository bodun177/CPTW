import { useContext } from 'react';
import { SearchesContext } from '../context/SearchesContext.js';

export default function useSearches() {
  const context = useContext(SearchesContext);

  if (context === null) {
    throw new Error('useSearches must be used within SearchesProvider');
  }

  return context;
}
