import { selectSearches } from './selectSearches.js';
import { savedSearch, testItem } from '../test/fixtures.js';

test('поєднує пошук, терміновість і порядок без зміни джерела', () => {
  const records = Object.freeze([
    Object.freeze({ ...savedSearch, id: 's-1', quantity: 4 }),
    Object.freeze({ ...savedSearch, id: 's-2', quantity: 1 }),
    Object.freeze({ ...savedSearch, id: 's-3', urgent: false }),
  ]);

  const result = selectSearches(records, [testItem], {
    query: ' GOLF ',
    urgent: 'yes',
    sort: 'quantity-asc',
  });

  expect(result.map((record) => record.id)).toEqual(['s-2', 's-1']);
  expect(records.map((record) => record.id)).toEqual(['s-1', 's-2', 's-3']);
});

test('відсутність збігів не видаляє початковий запис', () => {
  const records = [savedSearch];
  const result = selectSearches(records, [testItem], {
    query: 'несумісний пошуковий текст',
    urgent: 'all',
    sort: 'part',
  });

  expect(result).toEqual([]);
  expect(records).toEqual([savedSearch]);
});

test('сортує за кількістю за спаданням із стабільним порядком за id', () => {
  const records = [
    { ...savedSearch, id: 's-b', quantity: 3 },
    { ...savedSearch, id: 's-a', quantity: 3 },
    { ...savedSearch, id: 's-c', quantity: 7 },
  ];

  const result = selectSearches(records, [testItem], {
    query: '',
    urgent: 'all',
    sort: 'quantity-desc',
  });

  expect(result.map((record) => record.id)).toEqual(['s-c', 's-a', 's-b']);
});
