import { parts } from '../data/parts.js';

export const testItem = parts.find((item) => item.id === 'p-001');

export const validInput = {
  partId: 'p-001',
  carBrand: 'Volkswagen',
  carModel: 'Golf VII',
  comment: 'Потрібні колодки для автомобіля 2015 року випуску.',
  quantity: 2,
  urgent: true,
};

export const savedSearch = {
  ...validInput,
  id: 's-test-001',
};
