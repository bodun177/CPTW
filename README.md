# Автопідбір

Вебзастосунок для пошуку та підбору автомобільних запасних частин.

## Запуск

```
npm install
npm start
```

Застосунок відкривається на http://localhost:3000/

## Збірка

```
npm run build
```

## Маршрутизація

Використано `react-router` 7.18.4 (декларативний режим, один `BrowserRouter` у `src/index.js`).

Адреси для перевірки:

- `/parts?q=колодки&available=1`
- `/parts/p-001`
- `/searches/new?partId=p-001`
- `/searches/s-001/edit`

Для хостингу потрібно повертати `index.html` для клієнтських маршрутів (SPA fallback). Незбережені чернетки скидаються при виході зі сторінки, зміні запису та перезавантаженні.

Документація: `docs/component-architecture.md`, `docs/project-plan.md`
