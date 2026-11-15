import { Outlet } from 'react-router';
import SiteHeader from './SiteHeader.jsx';
import PartSelectionProvider from '../../providers/PartSelectionProvider.jsx';

const navigationLinks = [
  { to: '/', label: 'Головна', end: true },
  { to: '/parts', label: 'Запчастини' },
  { to: '/searches', label: 'Підбори' },
];

export default function AppLayout({ items }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти до вмісту
      </a>
      <SiteHeader title="Автопідбір" links={navigationLinks} />
      <main id="main-content" tabIndex={-1}>
        <PartSelectionProvider items={items}>
          <Outlet />
        </PartSelectionProvider>
      </main>
      <footer>Навчальний проєкт. Каталог і підбір автозапчастин.</footer>
    </>
  );
}
