import { NavLink, Outlet } from 'react-router';

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
      <Outlet />
    </>
  );
}
