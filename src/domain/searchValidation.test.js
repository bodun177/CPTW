import { validateSearch } from './searchValidation.js';
import { testItem, validInput } from '../test/fixtures.js';

describe('validateSearch', () => {
  test('нормалізує коректні поля, не змінюючи вхід', () => {
    const input = Object.freeze({
      ...validInput,
      carBrand: ` ${validInput.carBrand} `,
      quantity: '2',
      id: 'injected-id',
    });

    const result = validateSearch(input, [testItem]);

    expect(result).toEqual({ ok: true, errors: {}, value: validInput });
    expect(result.value).not.toHaveProperty('id');
    expect(input.quantity).toBe('2');
    expect(input.carBrand.startsWith(' ')).toBe(true);
  });

  test.each(['', '0', '1.5', '11', 'abc'])(
    'відхиляє кількість %j',
    (quantity) => {
      const result = validateSearch({ ...validInput, quantity }, [testItem]);

      expect(result.ok).toBe(false);
      expect(result.errors.quantity).toBeTruthy();
    },
  );

  test.each(['1e1', '0x5', '+5', '5.0', '٣'])(
    'відхиляє кількість із нецифровим записом %j',
    (quantity) => {
      const result = validateSearch({ ...validInput, quantity }, [testItem]);

      expect(result.ok).toBe(false);
      expect(result.errors.quantity).toBeTruthy();
    },
  );

  test.each([1, 10])('приймає граничну кількість %i', (quantity) => {
    const result = validateSearch({ ...validInput, quantity }, [testItem]);
    expect(result.ok).toBe(true);
  });

  test('для понад чотирьох одиниць вимагає розгорнутий коментар', () => {
    const short = validateSearch(
      { ...validInput, quantity: 5, comment: 'Колодки для Golf.' },
      [testItem],
    );
    const long = validateSearch(
      {
        ...validInput,
        quantity: 5,
        comment: 'Комплект колодок для Golf VII 2015 року.',
      },
      [testItem],
    );

    expect(short.ok).toBe(false);
    expect(short.errors.comment).toBeTruthy();
    expect(long.ok).toBe(true);
  });

  test('відхиляє невідому запчастину', () => {
    const result = validateSearch({ ...validInput, partId: 'p-missing' }, [
      testItem,
    ]);
    expect(result.errors.partId).toBeTruthy();
  });

  test.each([9, 501])('відхиляє коментар завдовжки %i', (length) => {
    const result = validateSearch(
      { ...validInput, comment: 'а'.repeat(length) },
      [testItem],
    );
    expect(result.errors.comment).toBeTruthy();
  });

  test.each([1, 31])('відхиляє марку завдовжки %i', (length) => {
    const result = validateSearch(
      { ...validInput, carBrand: 'а'.repeat(length) },
      [testItem],
    );
    expect(result.errors.carBrand).toBeTruthy();
  });

  test('ознака терміновості має бути логічним значенням', () => {
    const result = validateSearch({ ...validInput, urgent: 'yes' }, [testItem]);
    expect(result.errors.urgent).toBeTruthy();
  });
});
