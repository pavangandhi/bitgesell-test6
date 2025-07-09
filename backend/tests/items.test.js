const request = require('supertest');
const express = require('express');
const itemsRouter = require('../src/routes/items');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const { promises: fs } = require('fs');

const mockItems = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
  { id: 2, name: 'Noise Cancelling Headphones', category: 'Electronics', price: 399 },
  { id: 3, name: 'Ultra‑Wide Monitor', category: 'Electronics', price: 999 },
  { id: 4, name: 'Ergonomic Chair', category: 'Furniture', price: 799 },
  { id: 5, name: 'Standing Desk', category: 'Furniture', price: 1199 }
];

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/items', itemsRouter);
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
  });
  return app;
};

beforeEach(() => {
  fs.readFile.mockReset();
  fs.writeFile.mockReset();
});

describe('Items API', () => {
  test('GET /api/items - return all items', async () => {
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));
    const app = createTestApp();

    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
    expect(res.body[0].name).toBe('Laptop Pro');
  });

  test('GET /api/items - filters by search query', async () => {
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));
    const app = createTestApp();

    const res = await request(app).get('/api/items?q=desk');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 5, name: 'Standing Desk', category: 'Furniture', price: 1199 },
    ]);
  });

  test('GET /api/items - limit results', async () => {
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));
    const app = createTestApp();

    const res = await request(app).get('/api/items?limit=2');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('GET /api/items/:id - valid item', async () => {
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));
    const app = createTestApp();

    const res = await request(app).get('/api/items/3');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Ultra‑Wide Monitor');
  });

  test('GET /api/items/:id - not found', async () => {
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));
    const app = createTestApp();

    const res = await request(app).get('/api/items/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Item not found');
  });

  test('POST /api/items - adds new item', async () => {
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));
    fs.writeFile.mockResolvedValueOnce();
    const app = createTestApp();

    const newItem = { name: 'Gaming Mouse', price: 59, category: 'Electronics' };
    const res = await request(app).post('/api/items').send(newItem);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Gaming Mouse');
    expect(res.body).toHaveProperty('id');
    expect(fs.writeFile).toHaveBeenCalled();
  });

  test('Handles JSON parse error in readFile', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn(); // suppress expected error output

    fs.readFile.mockResolvedValueOnce('INVALID JSON');
    const app = createTestApp();

    const res = await request(app).get('/api/items');
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Unexpected token/);

    console.error = originalConsoleError; // restore
  });

  test('Handles readFile failure', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn(); // suppress expected error output

    fs.readFile.mockRejectedValueOnce(new Error('Read failed'));
    const app = createTestApp();

    const res = await request(app).get('/api/items');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Read failed');

    console.error = originalConsoleError;
  });
});
