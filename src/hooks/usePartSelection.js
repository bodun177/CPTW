import { useContext } from 'react';
import { PartSelectionContext } from '../context/PartSelectionContext.js';

export default function usePartSelection() {
  const selection = useContext(PartSelectionContext);

  if (selection === null) {
    throw new Error(
      'usePartSelection must be used within PartSelectionProvider',
    );
  }

  return selection;
}
