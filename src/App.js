import { Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout.jsx';
import SearchesLayout from './components/layout/SearchesLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogContainer from './pages/CatalogContainer.jsx';
import PartDetailsPage from './pages/PartDetailsPage.jsx';
import SearchesPage from './pages/SearchesPage.jsx';
import SearchCreatePage from './pages/SearchCreatePage.jsx';
import SearchEditPage from './pages/SearchEditPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { parts } from './data/parts.js';
import { searches } from './data/searches.js';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout items={parts} />}>
        <Route index element={<HomePage />} />

        <Route path="parts">
          <Route index element={<CatalogContainer items={parts} />} />
          <Route
            path=":partId"
            element={<PartDetailsPage items={parts} />}
          />
        </Route>

        <Route path="searches" element={<SearchesLayout />}>
          <Route
            index
            element={<SearchesPage searches={searches} items={parts} />}
          />
          <Route path="new" element={<SearchCreatePage items={parts} />} />
          <Route
            path=":searchId/edit"
            element={<SearchEditPage searches={searches} items={parts} />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
