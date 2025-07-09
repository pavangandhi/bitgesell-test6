import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Items from '../components/Items';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  fetch.resetMocks();
});

const mockData = {
  items: [
    { id: 1, name: 'Laptop Pro' },
    { id: 2, name: 'Standing Desk' },
  ],
  total: 2,
};

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

test('renders loading state and fetches items', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockData));

  renderWithRouter(<Items />);
  
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  expect(screen.getByText(/no items found/i)).toBeInTheDocument(); // While loading

  await waitFor(() => {
    expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
    expect(screen.getByText('Standing Desk')).toBeInTheDocument();
  });
});

test('handles search input and resets page', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockData)); // Initial load

  renderWithRouter(<Items />);
  await waitFor(() => screen.getByText('Laptop Pro'));

  fetch.mockResponseOnce(JSON.stringify({
    items: [{ id: 3, name: 'Avocado' }],
    total: 1,
  }));

  fireEvent.change(screen.getByPlaceholderText(/search/i), {
    target: { value: 'ava' }
  });

  await waitFor(() => screen.getByText('Avocado'));
});