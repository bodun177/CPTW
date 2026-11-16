import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import App from './App.js';
import { searchService } from './services/searchService.js';
import { ServiceError } from './services/ServiceError.js';
import { savedSearch, validInput } from './test/fixtures.js';
import { deferred } from './test/deferred.js';

jest.mock('./services/searchService.js', () => ({
  dataSource: 'mock',
  searchService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

beforeEach(() => {
  searchService.getAll.mockResolvedValue([{ ...savedSearch }]);
  searchService.getById.mockResolvedValue({ ...savedSearch });
  searchService.create.mockImplementation(async (input) => ({
    ...input,
    id: 's-created',
  }));
  searchService.update.mockImplementation(async (id, input) => ({
    ...input,
    id,
  }));
  searchService.delete.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

function LocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  );
}

function openApp(path = '/searches') {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  );
  return user;
}

async function fillValidForm(user) {
  await user.type(
    await screen.findByRole('textbox', { name: /Марка авто/ }),
    validInput.carBrand,
  );
  await user.type(
    screen.getByRole('textbox', { name: /Модель авто/ }),
    validInput.carModel,
  );
  await user.type(
    screen.getByRole('textbox', { name: /Коментар/ }),
    validInput.comment,
  );
  const quantity = screen.getByRole('spinbutton', { name: /Кількість/ });
  await user.clear(quantity);
  await user.type(quantity, '2');
  await user.click(screen.getByRole('checkbox', { name: /термінова доставка/ }));
}

describe('стани читання колекції', () => {
  test('показує завантаження до отримання колекції', async () => {
    const pending = deferred();
    searchService.getAll.mockReturnValueOnce(pending.promise);
    openApp();

    expect(screen.getByText('Завантаження підборів…')).toBeInTheDocument();
    expect(screen.queryByText(savedSearch.comment)).not.toBeInTheDocument();
    expect(screen.queryByText(/Підборів ще немає/)).not.toBeInTheDocument();

    await act(async () => {
      pending.resolve([savedSearch]);
      await pending.promise;
    });

    expect(await screen.findByText(savedSearch.comment)).toBeInTheDocument();
    expect(screen.queryByText('Завантаження підборів…')).not.toBeInTheDocument();
  });

  test('після відмови читання повторно завантажує дані', async () => {
    searchService.getAll
      .mockRejectedValueOnce(new ServiceError('Навчальна відмова читання.'))
      .mockResolvedValueOnce([savedSearch]);
    const user = openApp();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Навчальна відмова читання.',
    );
    expect(screen.queryByText(savedSearch.comment)).not.toBeInTheDocument();
    expect(screen.queryByText(/Підборів ще немає/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Спробувати ще раз' }));

    expect(await screen.findByText(savedSearch.comment)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('успішний порожній список має окреме пояснення', async () => {
    searchService.getAll.mockResolvedValueOnce([]);
    openApp();

    expect(await screen.findByText(/Підборів ще немає/)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});

describe('маршрути та параметри', () => {
  test.each([
    ['/searches/s-test-001', 'Підбір s-test-001'],
    ['/searches/s-test-001/edit', 'Редагування підбору s-test-001'],
    ['/searches/s-missing', 'Підбір не знайдено'],
    ['/searches/new?partId=p-missing', 'Запчастину нового підбору не знайдено'],
    ['/unknown-page', '404: сторінку не знайдено'],
  ])('адреса %s відкриває відповідний екран', async (path, title) => {
    openApp(path);
    expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
  });

  test('URL фільтра без збігів не змінює джерело підборів', async () => {
    const user = openApp('/searches?q=немає_такого_збігу&urgent=all&sort=quantity-asc');

    expect(
      await screen.findByText('За цими умовами нічого не знайдено.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Показати всі підбори' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(searchService.delete).not.toHaveBeenCalled();
  });
});

describe('запис і перехід', () => {
  test('створює підбір і відкриває його підтверджені деталі', async () => {
    searchService.getAll.mockResolvedValueOnce([]);
    const user = openApp('/searches/new?partId=p-001');

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Створити підбір' }));

    expect(
      await screen.findByRole('heading', { name: 'Підбір s-created' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/searches/s-created');
    expect(screen.getByText(validInput.comment)).toBeInTheDocument();
    expect(searchService.create).toHaveBeenCalledTimes(1);
    expect(searchService.create).toHaveBeenCalledWith(validInput);
    expect(screen.queryByRole('form', { name: /Форма підбору/ })).not.toBeInTheDocument();
  });

  test('відмова створення залишає форму, введення й адресу', async () => {
    searchService.getAll.mockResolvedValueOnce([]);
    searchService.create.mockRejectedValueOnce(
      new ServiceError('Навчальна відмова створення.'),
    );
    const user = openApp('/searches/new?partId=p-001');

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Створити підбір' }));

    const form = await screen.findByRole('form', { name: /Форма підбору/ });
    expect(await within(form).findByRole('alert')).toHaveTextContent(
      'Навчальна відмова створення.',
    );
    expect(screen.getByRole('textbox', { name: /Коментар/ })).toHaveValue(
      validInput.comment,
    );
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/searches/new?partId=p-001',
    );
  });

  test('редагує підбір зі збереженням того самого id', async () => {
    const user = openApp('/searches/s-test-001/edit');

    const quantity = await screen.findByRole('spinbutton', { name: /Кількість/ });
    await user.clear(quantity);
    await user.type(quantity, '3');
    await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

    expect(
      await screen.findByRole('heading', { name: 'Підбір s-test-001' }),
    ).toBeInTheDocument();
    expect(searchService.update).toHaveBeenCalledWith('s-test-001', {
      ...validInput,
      quantity: 3,
    });
    expect(screen.getByTestId('location')).toHaveTextContent('/searches/s-test-001');
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

test('після редагування список показує оновлений запис, а не старий рядок', async () => {
  const user = openApp('/searches/s-test-001/edit');

  const comment = await screen.findByRole('textbox', { name: /Коментар/ });
  await user.clear(comment);
  await user.type(comment, 'Оновлений коментар для заміни передніх колодок.');
  await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
  await screen.findByRole('heading', { name: 'Підбір s-test-001' });

  await user.click(screen.getByRole('link', { name: 'До всіх підборів' }));

  expect(
    await screen.findByText('Оновлений коментар для заміни передніх колодок.'),
  ).toBeInTheDocument();
  expect(screen.queryByText(savedSearch.comment)).not.toBeInTheDocument();
});

describe('видалення', () => {
  test('скасування діалогу не викликає видалення', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const user = openApp('/searches/s-test-001');
    await screen.findByRole('heading', { name: 'Підбір s-test-001' });

    await user.click(screen.getByRole('button', { name: 'Видалити підбір' }));

    expect(searchService.delete).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: 'Підбір s-test-001' }),
    ).toBeInTheDocument();
  });

  test('підтверджене видалення вилучає запис і повертає до списку', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    searchService.getAll.mockResolvedValueOnce([
      savedSearch,
      { ...savedSearch, id: 's-other', comment: 'Інший підбір для перевірки видалення.' },
    ]);
    const user = openApp('/searches/s-test-001');
    await screen.findByRole('heading', { name: 'Підбір s-test-001' });

    await user.click(screen.getByRole('button', { name: 'Видалити підбір' }));

    expect(
      await screen.findByText('Інший підбір для перевірки видалення.'),
    ).toBeInTheDocument();
    expect(searchService.delete).toHaveBeenCalledWith('s-test-001');
    expect(screen.getByTestId('location')).toHaveTextContent('/searches');
    expect(screen.queryByText(savedSearch.comment)).not.toBeInTheDocument();
  });

  test('відмова видалення залишає запис і поточну адресу', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    searchService.delete.mockRejectedValueOnce(
      new ServiceError('Не вдалося видалити підбір.'),
    );
    const user = openApp('/searches/s-test-001');
    await screen.findByRole('heading', { name: 'Підбір s-test-001' });

    await user.click(screen.getByRole('button', { name: 'Видалити підбір' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не вдалося видалити підбір.',
    );
    expect(screen.getByText(savedSearch.comment)).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/searches/s-test-001');
    expect(searchService.delete).toHaveBeenCalledWith(savedSearch.id);
  });
});
