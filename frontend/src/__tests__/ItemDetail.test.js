import React from 'react';
import { render, screen } from '@testing-library/react';
import ItemDetail from '../pages/ItemDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock global fetch before each test
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          name: 'Test Item',
          category: 'Test Category',
          price: 123,
        }),
    })
  );
});

// Reset mocks after each test
afterEach(() => {
  jest.resetAllMocks();
});

test('renders item details correctly after fetch', async () => {
  render(
    <MemoryRouter initialEntries={['/items/1']}>
      <Routes>
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for the fetched item name to appear
  expect(await screen.findByText('Test Item')).toBeInTheDocument();
  expect(screen.getByText(/Category:/i)).toBeInTheDocument();
  expect(screen.getByText(/Price:/i)).toBeInTheDocument();
});
