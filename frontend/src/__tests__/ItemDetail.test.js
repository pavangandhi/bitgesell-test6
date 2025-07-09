import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ItemDetail from '../components/ItemDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

beforeEach(() => {
  fetch.resetMocks();
});

const mockItem = {
  id: 2,
  name: 'Standing Desk',
  category: 'Furniture',
  price: 1199,
};

test('renders item details', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockItem));

  render(
    <MemoryRouter initialEntries={['/items/2']}>
      <Routes>
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Standing Desk')).toBeInTheDocument();
    expect(screen.getByText(/furniture/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1199/)).toBeInTheDocument();
  });
});