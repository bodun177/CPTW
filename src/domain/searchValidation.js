export function validateSearch(input, items) {
  const errors = {};
  const carBrand =
    typeof input.carBrand === 'string' ? input.carBrand.trim() : '';
  const carModel =
    typeof input.carModel === 'string' ? input.carModel.trim() : '';
  const comment =
    typeof input.comment === 'string' ? input.comment.trim() : '';
  const quantityText = String(input.quantity ?? '').trim();
  const quantity = Number(quantityText);

  if (!items.some((item) => item.id === input.partId)) {
    errors.partId = 'Виберіть наявну запчастину з каталогу.';
  }

  if (carBrand.length === 0) {
    errors.carBrand = 'Укажіть марку авто.';
  } else if (carBrand.length < 2 || carBrand.length > 30) {
    errors.carBrand = 'Марка має містити від 2 до 30 символів без крайніх пробілів.';
  }

  if (carModel.length === 0) {
    errors.carModel = 'Укажіть модель авто.';
  } else if (carModel.length > 40) {
    errors.carModel = 'Модель має містити не більше 40 символів.';
  }

  if (comment.length === 0) {
    errors.comment = 'Опишіть, який саме вузол потрібен.';
  } else if (comment.length < 10 || comment.length > 500) {
    errors.comment = 'Коментар має містити від 10 до 500 символів без крайніх пробілів.';
  }

  if (quantityText === '') {
    errors.quantity = 'Укажіть кількість.';
  } else if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 10
  ) {
    errors.quantity = 'Кількість має бути цілим числом від 1 до 10.';
  }

  if (!errors.comment && !errors.quantity && quantity > 4 && comment.length < 20) {
    errors.comment =
      'Для кількості понад 4 одиниці опишіть потребу не менш ніж у 20 символах.';
  }

  if (typeof input.urgent !== 'boolean') {
    errors.urgent = 'Ознака терміновості має бути логічним значенням.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    value: {
      partId: input.partId,
      carBrand,
      carModel,
      comment,
      quantity,
      urgent: input.urgent,
    },
  };
}
