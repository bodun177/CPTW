import AppLayout from './components/layout/AppLayout.jsx';
import PartSelectionProvider from './providers/PartSelectionProvider.jsx';
import CatalogContainer from './pages/CatalogContainer.jsx';
import SearchContainer from './pages/SearchContainer.jsx';
import { parts } from './data/parts.js';

const navigationLinks = [
  { href: '#about', label: 'Про застосунок' },
  { href: '#catalog', label: 'Каталог' },
  { href: '#search', label: 'Підбір запчастин' },
];

export default function App() {
  return (
    <AppLayout title="Автопідбір" links={navigationLinks}>
      <PartSelectionProvider items={parts}>
        <CatalogContainer items={parts} />
        <SearchContainer />
      </PartSelectionProvider>
    </AppLayout>
  );
}
