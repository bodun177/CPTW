# Архітектура компонентів: Автопідбір

## Дерево

App
- AppLayout (шапка, навігація, футер)
  - HomePage
    - Section «Про застосунок»
    - Section «Каталог»: CatalogSummary, PartList → PartCard → AvailabilityBadge
  - SearchPage
    - Section «Підбір»: AvailabilityBadge, SearchFormPreview → FormField, AppButton

## Контракти

| Компонент | Props | Призначення |
|---|---|---|
| AppLayout | title, links, children | Спільна оболонка з одним main |
| Section | id, title, children | Блок із заголовком |
| PartList | items | Список карток (порожній масив допустимий) |
| PartCard | item | Картка однієї запчастини |
| AvailabilityBadge | available | Підпис наявності |
| SearchPage | item | Сторінка підбору (item може бути відсутнім) |
| FormField | id, label, hint, children | Поле з підписом і підказкою |
| SearchFormPreview | idPrefix, partName | Макет форми без збереження |
| AppButton | children, type, variant, disabled | Кнопка (primary або secondary) |

## Повторне використання

- AvailabilityBadge: у картці каталогу і на сторінці підбору.
- Section: двічі на головній сторінці з різним вмістом.
- AppButton: двічі у формі.

## Керування станом (Л 2.1)

| Значення | Природа | Власник |
|---|---|---|
| `parts` | початкові дані | модуль `data/parts.js`, передається в `App` |
| `detailsOpen` | локальний стан UI | конкретна `PartCard` |
| `query`, `availableOnly` | стан каталогу | `HomePage` через хук `usePartFilters` |
| `selectedId` | спільний стан вибору | `PartSelectionProvider` (Context) |
| `draft` | незбережена чернетка підбору | `SearchPage` |
| `visibleItems`, `selectedItem`, лічильники | похідні значення | обчислюються, окремого `useState` немає |

Події: `onSelect(id)`, `onQueryChange(text)`, `onAvailableOnlyChange(flag)`, `onFieldChange(field, value)`, `onReset()`, `onClearSelection()`.

Context API обмежений робочою областю (`CatalogContainer`, `SearchContainer`); `SiteHeader`, `MainNav` і футер поза провайдером. Чернетка скидається через `key={selectedId ?? 'empty'}` на `SearchPage`. Ефект у `SearchPage` синхронізує `document.title` і відновлює його при очищенні.

## Сторінки та маршрутизація (Л 2.2)

- `AppLayout` задає спільну оболонку через `Outlet`; `PartSelectionProvider` розміщено в ній, тому останній вибір зберігається між клієнтськими переходами. Шапка, меню й підвал поза провайдером.
- `SearchesLayout` — вкладена оболонка розділу підборів з власним меню.
- Фільтри каталогу (`q`, `available`) зберігаються в URL; хук `usePartFilters` читає їх через `useSearchParams`, окремого `useState` немає.
- Предмет сторінки деталей визначає `useParams`, предмет нового підбору — query-параметр `partId`. Контекст зберігає лише останній явний вибір.
- `SearchPage` — спільний редактор чернетки; ключ `new-<id>` / `edit-<id>` задається в маршрутних сторінках. Чернетка скидається при виході зі сторінки, зміні запису або перезавантаженні.
- `PageHeading` — єдиний власник `document.title` на відкритій сторінці.

## Локальний CRUD підборів (Л 3.1)

| Дані | Власник | Коли змінюються |
|---|---|---|
| Довідник запчастин | `data/parts.js` | У цій роботі не редагується |
| Колекція підборів | `SearchesProvider` | Після успішного створення, оновлення або видалення |
| Чернетка | поточна `SearchPage` | Під час введення та відновлення початкових полів |
| Ознаки перевірки й помилка операції | поточний редактор | Після взаємодії та спроби збереження |
| Пошук, фільтр, порядок | URL сторінки `/searches` | Після зміни параметрів подання |
| Видимі підбори | обчислення в `useSearchFilters` | З поточної колекції та параметрів |

Правила полів описані одним модулем `domain/searchValidation.js`; його використовують і редактор, і операції провайдера. `src/data/searches.js` слугує лише початковим набором.

Контракти синхронних операцій (підготовка до Л 3.2):

| Операція | Вхід | Успіх | Відмова |
|---|---|---|---|
| `createSearch` | поля підбору | `{ ok: true, record }` | помилки полів |
| `updateSearch` | ідентифікатор і поля | `{ ok: true, record }` | помилки полів або відсутній запис |
| `deleteSearch` | ідентифікатор | `{ ok: true }` | відсутній запис |
| перегляд | ідентифікатор маршруту | знайдений запис | сторінка відсутнього запису |

Видалення проходить через `useDeleteSearch` з єдиним підтвердженням (`window.confirm`) і не показує повідомлення про видалення, якщо дію скасовано.

## Рівень доступу до даних (Л 3.2)

Схема залежностей:

```
Сторінки та форма (SearchPage, SearchCreatePage, SearchEditPage, SearchDetailsPage, SearchesPage)
        ↓
SearchesProvider / useSearches / SearchesGate
        ↓
searchService (єдине місце вибору реалізації)
        ↓
mockSearchService | apiSearchService
        ↓
localStorage | REST API
```

| Частина | Відповідальність | Чого не знає |
|---|---|---|
| SearchForm | поля, повідомлення, стан подання | URL, HTTP, ключ localStorage |
| Маршрутна сторінка | параметри маршруту, перехід після підтвердженого успіху | формат мережевого пакета |
| SearchesProvider | знімок колекції, стани читання й запису, повтор, захист застарілих відповідей | спосіб збереження в адаптері |
| searchService | вибір реалізації за `REACT_APP_DATA_SOURCE` | JSX, навігація |
| mock / API адаптер | читання, запис, перетворення даних, помилки | стан полів форми |
| searchValidation / searchContract | предметні правила; перевірка даних на межі сервісу | React, мережа, сховище |

Контракт сервісу: `getAll({signal})` → масив; `getById(id,{signal})` → запис або `NOT_FOUND`; `create(input)` → повний запис з id; `update(id,input)` → повний запис з тим самим id; `delete(id)` → `undefined`. Відмова — відхилений Promise із `ServiceError` (`code`, `message`, `status`, `errors`). Провайдер перетворює відмову запису на `{ ok:false, message, errors }`, успіх — на `{ ok:true, record }`.

Правила синхронізації: колекція змінюється лише після підтвердження сервісу, повернутим записом; одночасно виконується одна операція запису (`mutationLock` + `isMutating`); читання має номер версії й `AbortController`, тому застаріла відповідь не затирає знімок; відсутній запис визначається після успішного читання (`SearchesGate`). Хук `useSearchRecord` (окреме `getById`) підготовлено як дослід; сторінки деталей і редагування читають спільний знімок провайдера.

## Тестування й продуктивність (Л 4.1)

- `src/domain/selectSearches.js` — чиста функція пошуку, фільтра й сортування; `useSearchFilters` лише читає параметри URL і викликає її.
- `SearchRow` (мемоізований рядок таблиці) отримує `search`, `partName`, `disabled` та стабільний `onDelete`. Стабільність забезпечують `useCallback` у `SearchesProvider` (`mutate`, `deleteSearch`, `dismissNotice`), `useDeleteSearch` і `SearchesPage`.
- Тести перевіряють поведінку через ролі й доступні назви; у інтеграційних тестах підміняється тільки `searchService`.
