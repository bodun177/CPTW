import { parts } from '../data/parts.js';
import { validateSearch } from '../domain/searchValidation.js';
import { ServiceError } from './ServiceError.js';

export function toSearchInput(input) {
  const result = validateSearch(input, parts);
  if (!result.ok) {
    throw new ServiceError('Перевірте поля підбору.', {
      code: 'VALIDATION',
      errors: result.errors,
    });
  }
  return result.value;
}

export function toSearch(value) {
  const valid =
    value !== null &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.partId === 'string' &&
    typeof value.carBrand === 'string' &&
    typeof value.carModel === 'string' &&
    typeof value.comment === 'string' &&
    Number.isInteger(value.quantity) &&
    typeof value.urgent === 'boolean';

  if (!valid) {
    throw new ServiceError('Джерело повернуло некоректний запис підбору.', {
      code: 'BAD_DATA',
    });
  }

  return {
    id: value.id,
    partId: value.partId,
    carBrand: value.carBrand,
    carModel: value.carModel,
    comment: value.comment,
    quantity: value.quantity,
    urgent: value.urgent,
  };
}

export function toSearchList(value) {
  if (!Array.isArray(value)) {
    throw new ServiceError('Джерело повернуло некоректний список.', {
      code: 'BAD_DATA',
    });
  }
  const records = value.map(toSearch);
  if (new Set(records.map((record) => record.id)).size !== records.length) {
    throw new ServiceError('Джерело повернуло повторні ідентифікатори.', {
      code: 'BAD_DATA',
    });
  }
  return records;
}
