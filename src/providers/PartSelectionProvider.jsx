import { useState } from 'react';
import { PartSelectionContext } from '../context/PartSelectionContext.js';

export default function PartSelectionProvider({ items, children }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedItem = items.find((item) => item.id === selectedId);

  function selectPart(id) {
    if (items.some((item) => item.id === id)) {
      setSelectedId(id);
    }
  }

  function clearSelection() {
    setSelectedId(null);
  }

  const value = {
    selectedId,
    selectedItem,
    selectPart,
    clearSelection,
  };

  return (
    <PartSelectionContext.Provider value={value}>
      {children}
    </PartSelectionContext.Provider>
  );
}
