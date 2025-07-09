import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Items from '../pages/Items';
import { MemoryRouter } from 'react-router-dom';

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders items list and pagination', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      items: [
        { id: 1, name: 'Item A' },
        { id: 2, name: 'Item B' }
      ],
      total: 2
    })
  });

  render(
    <MemoryRouter>
      <Items />
    </MemoryRouter>
  );

  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();

  // Wait for items to load
  expect(await screen.findByText('Item A')).toBeInTheDocument();
  expect(screen.getByText('Item B')).toBeInTheDocument();
});

test('shows "No items found" when API returns empty', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ items: [], total: 0 })
  });

  render(
    <MemoryRouter>
      <Items />
    </MemoryRouter>
  );

  expect(await screen.findByText(/no items found/i)).toBeInTheDocument();
});

test('calls fetch with query on search input', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      items: [{ id: 3, name: 'Avocado' }],
      total: 1
    })
  });

  render(
    <MemoryRouter>
      <Items />
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'Avo' } });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('q=Avo')
    );
  });

  expect(await screen.findByText('Avocado')).toBeInTheDocument();
});
