import { NavLink, Outlet } from 'react-router';
import SearchNotice from '../search/SearchNotice.jsx';
import SearchesGate from '../search/SearchesGate.jsx';
import DevFailureControls from '../search/DevFailureControls.jsx';
import { dataSource } from '../../services/searchService.js';

export default function SearchesLayout() {
  return (
    <>
      <nav aria-label="Навігація розділом підборів">
        <ul className="nav-list">
          <li>
            <NavLink to="." end>
              Список підборів
            </NavLink>
          </li>
          <li>
            <NavLink to="new">Новий підбір</NavLink>
          </li>
        </ul>
      </nav>
      <p>
        {dataSource === 'mock'
          ? 'Підбори зберігаються в локальному сховищі цього браузера (режим mock).'
          : 'Підбори зберігаються у зовнішньому сервісі (режим API).'}
      </p>
      <DevFailureControls />
      <SearchNotice />
      <SearchesGate>
        <Outlet />
      </SearchesGate>
    </>
  );
}
