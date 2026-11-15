# План сторінок «Автопідбір»

Режим React Router: декларативний (`BrowserRouter`, `Routes`, `Route`), пакет `react-router` 7.18.4.

| Адреса | Компонент | Параметри | Джерело запису | Якщо запису немає |
|---|---|---|---|---|
| `/` | `HomePage` | — | — | — |
| `/parts` | `CatalogContainer`, `PartListPage` | `q`, `available` (query) | `src/data/parts.js` | «За цими фільтрами нічого не знайдено» |
| `/parts/:partId` | `PartDetailsPage` | `partId` (шлях) | `src/data/parts.js` | сторінка «Запчастину не знайдено» |
| `/searches` | `SearchesPage` | — | `src/data/searches.js` | порожній стан зі посиланням на створення |
| `/searches/new` | `SearchCreatePage` | `partId` (query) | `src/data/parts.js` | без параметра — пояснення; з невідомим — «Неможливо підготувати підбір» |
| `/searches/:searchId/edit` | `SearchEditPage` | `searchId` (шлях) | `src/data/searches.js` | сторінка «Підбір не знайдено» |
| `*` | `NotFoundPage` | — | — | 404 із посиланнями |

## Дерево маршрутного вмісту

```
AppLayout (PartSelectionProvider, Outlet)
  Головна
  Запчастини
    Каталог
    Деталі запчастини
  SearchesLayout
    Список підборів
    Новий підбір
    Редагування підбору
  Сторінка 404
```

## Приклади адрес для перевірки

- `/parts?q=колодки&available=1`
- `/parts/p-001`
- `/searches/new?partId=p-001`
- `/searches/s-001/edit`
- `/unknown`, `/parts/missing`, `/searches/missing/edit`
