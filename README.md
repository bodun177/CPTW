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

- AvailabilityBadge: у картці каталогу і на сторінці підбору. Зміна підпису робиться в одному файлі.
- Section: двічі на головній сторінці з різним вмістом.
- AppButton: двічі у формі.
