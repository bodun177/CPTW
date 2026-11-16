import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from './SearchPage.jsx';
import { savedSearch, testItem, validInput } from '../test/fixtures.js';
import { deferred } from '../test/deferred.js';

function renderEditor(onSave) {
  return render(
    <SearchPage
      title="Новий підбір"
      item={testItem}
      onSave={onSave}
      onCancel={jest.fn()}
      submitLabel="Створити підбір"
    />,
  );
}

async function fillValidForm(user) {
  await user.type(
    screen.getByRole('textbox', { name: /Марка авто/ }),
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

test('не зберігає порожню форму та пояснює помилку', async () => {
  const user = userEvent.setup();
  const onSave = jest.fn();
  renderEditor(onSave);

  await user.click(screen.getByRole('button', { name: 'Створити підбір' }));

  const brand = screen.getByRole('textbox', { name: /Марка авто/ });
  expect(brand).toHaveAttribute('aria-invalid', 'true');
  expect(brand).toHaveFocus();
  expect(screen.getByText('Укажіть марку авто.')).toBeInTheDocument();
  expect(screen.getByText('Укажіть модель авто.')).toBeInTheDocument();
  expect(onSave).not.toHaveBeenCalled();
});

test('передає нормалізовані поля й блокує повтор до відповіді', async () => {
  const user = userEvent.setup();
  const pending = deferred();
  const onSave = jest.fn().mockReturnValue(pending.promise);
  renderEditor(onSave);
  await fillValidForm(user);

  await user.click(screen.getByRole('button', { name: 'Створити підбір' }));

  const submit = screen.getByRole('button', { name: 'Збереження…' });
  expect(submit).toBeDisabled();
  expect(screen.getByRole('textbox', { name: /Марка авто/ })).toBeDisabled();
  await user.click(submit);
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onSave).toHaveBeenCalledWith(validInput);

  await act(async () => {
    pending.resolve({ ok: true, record: savedSearch });
    await pending.promise;
  });

  expect(screen.getByRole('button', { name: 'Створити підбір' })).toBeEnabled();
});

test('після відмови зберігає введення й дозволяє свідомий повтор', async () => {
  const user = userEvent.setup();
  const onSave = jest
    .fn()
    .mockResolvedValueOnce({ ok: false, message: 'Сервіс тимчасово недоступний.' })
    .mockResolvedValueOnce({ ok: true, record: savedSearch });
  renderEditor(onSave);
  await fillValidForm(user);

  await user.click(screen.getByRole('button', { name: 'Створити підбір' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Сервіс тимчасово недоступний.',
  );
  expect(screen.getByRole('textbox', { name: /Марка авто/ })).toHaveValue(
    validInput.carBrand,
  );
  expect(screen.getByRole('textbox', { name: /Коментар/ })).toHaveValue(
    validInput.comment,
  );
  expect(screen.getByRole('spinbutton', { name: /Кількість/ })).toHaveValue(2);
  expect(screen.getByRole('checkbox', { name: /термінова доставка/ })).toBeChecked();

  await user.click(screen.getByRole('button', { name: 'Створити підбір' }));

  await waitFor(() => {
    expect(
      screen.getByRole('button', { name: 'Створити підбір' }),
    ).toBeEnabled();
  });
  expect(onSave).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
