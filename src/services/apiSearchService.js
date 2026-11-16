import { ServiceError } from './ServiceError.js';
import { toSearch, toSearchInput, toSearchList } from './searchContract.js';

export function createApiSearchService(baseUrl) {
  if (!baseUrl?.trim()) {
    throw new ServiceError('Не налаштовано адресу API.', { code: 'CONFIG' });
  }
  const base = baseUrl.trim().replace(/\/+$/, '');

  async function request(path, { method = 'GET', body, signal } = {}) {
    let response;
    try {
      response = await fetch(`${base}${path}`, {
        method,
        signal,
        headers: {
          Accept: 'application/json',
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new ServiceError('Не вдалося зв’язатися із сервісом.', {
        code: 'NETWORK',
      });
    }

    if (!response.ok) {
      const messages = {
        400: 'Сервіс відхилив дані підбору.',
        401: 'Для цієї дії потрібна автентифікація.',
        403: 'Сервіс не дозволяє цю дію.',
        404: 'Підбір не знайдено.',
        409: 'Дані змінилися. Оновіть їх перед повторною дією.',
        422: 'Сервіс не прийняв значення полів.',
        429: 'Забагато запитів. Повторіть дію пізніше.',
      };
      throw new ServiceError(
        messages[response.status] ?? 'Сервіс тимчасово не може виконати дію.',
        {
          code: response.status === 404 ? 'NOT_FOUND' : 'HTTP',
          status: response.status,
        },
      );
    }

    if (response.status === 204) return undefined;
    try {
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new ServiceError('Сервіс повернув відповідь не у форматі JSON.', {
        code: 'BAD_DATA',
      });
    }
  }

  function recordPath(id) {
    return `/searches/${encodeURIComponent(id)}`;
  }

  return {
    async getAll({ signal } = {}) {
      return toSearchList(await request('/searches', { signal }));
    },

    async getById(id, { signal } = {}) {
      const record = toSearch(await request(recordPath(id), { signal }));
      if (record.id !== id) {
        throw new ServiceError('Сервіс повернув інший підбір.', {
          code: 'BAD_DATA',
        });
      }
      return record;
    },

    async create(input) {
      return toSearch(
        await request('/searches', {
          method: 'POST',
          body: toSearchInput(input),
        }),
      );
    },

    async update(id, input) {
      const record = toSearch(
        await request(recordPath(id), {
          method: 'PUT',
          body: toSearchInput(input),
        }),
      );
      if (record.id !== id) {
        throw new ServiceError('Сервіс змінив ідентифікатор підбору.', {
          code: 'BAD_DATA',
        });
      }
      return record;
    },

    async delete(id) {
      await request(recordPath(id), { method: 'DELETE' });
    },
  };
}
