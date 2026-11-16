/**
 * @jest-environment node
 */
import { createApiSearchService } from './apiSearchService.js';
import { savedSearch } from '../test/fixtures.js';

const base = 'https://example.test/api';

// Jest 27 не надає глобального Response, тому будуємо мінімальну відповідь fetch.
function fakeResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn(async () => body),
  };
}

afterEach(() => {
  delete global.fetch;
});

test('відхиляє HTTP 404 замість удаваного успіху', async () => {
  global.fetch = jest.fn().mockResolvedValue(fakeResponse(404));
  const service = createApiSearchService(base);

  await expect(service.getById('missing')).rejects.toMatchObject({
    code: 'NOT_FOUND',
    status: 404,
  });
  expect(global.fetch).toHaveBeenCalledWith(
    `${base}/searches/missing`,
    expect.objectContaining({ method: 'GET' }),
  );
});

test('після DELETE 204 не намагається читати JSON', async () => {
  const response = fakeResponse(204);
  const readJson = response.json;
  global.fetch = jest.fn().mockResolvedValue(response);
  const service = createApiSearchService(base);

  await expect(service.delete('s-test-001')).resolves.toBeUndefined();
  expect(readJson).not.toHaveBeenCalled();
  expect(global.fetch).toHaveBeenCalledWith(
    `${base}/searches/s-test-001`,
    expect.objectContaining({ method: 'DELETE' }),
  );
});

test.each([
  { label: 'неправильна оболонка', body: { items: [] } },
  { label: 'тип кількості', body: [{ ...savedSearch, quantity: 'two' }] },
  { label: 'повторний id', body: [savedSearch, { ...savedSearch }] },
])('відхиляє несумісну структуру: $label', async ({ body }) => {
  global.fetch = jest.fn().mockResolvedValue(
    fakeResponse(200, body),
  );
  const service = createApiSearchService(base);

  await expect(service.getAll()).rejects.toMatchObject({ code: 'BAD_DATA' });
});

test('мережева помилка стає помилкою сервісу без технічних подробиць', async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
  const service = createApiSearchService(base);

  await expect(service.getAll()).rejects.toMatchObject({ code: 'NETWORK' });
});

test('не надсилає запис із некоректними полями', async () => {
  global.fetch = jest.fn();
  const service = createApiSearchService(base);

  await expect(
    service.create({ ...savedSearch, carBrand: '' }),
  ).rejects.toMatchObject({ code: 'VALIDATION' });
  expect(global.fetch).not.toHaveBeenCalled();
});
