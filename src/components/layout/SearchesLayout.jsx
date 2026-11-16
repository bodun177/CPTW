import { NavLink, Outlet } from 'react-router';
import SearchNotice from '../search/SearchNotice.jsx';

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
      <p>Локальні дані зберігаються до перезавантаження сторінки.</p>
      <SearchNotice />
      <Outlet />
    </>
  );
}
