import AppLayout from './components/layout/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import { parts } from './data/parts.js';

const navigationLinks = [
  { href: '#about', label: 'Про застосунок' },
  { href: '#catalog', label: 'Каталог' },
  { href: '#search', label: 'Підбір запчастин' },
];

export default function App() {
  const exampleItem = parts.find((item) => item.id === 'p-001');

  return (
    <AppLayout title="Автопідбір" links={navigationLinks}>
      <HomePage />
      <SearchPage item={exampleItem} />
    </AppLayout>
  );
}
