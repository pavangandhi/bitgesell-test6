const express = require('express');
const path = require('path');
const { readFile, writeFile } = require('fs').promises; // ✅ for Jest mocking

const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data
async function readData() {
  try {
    const raw = await readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading data file:', error);
    throw error;
  }
}

// Utility to write data
async function writeData(data) {
  try {
    await writeFile(DATA_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
    throw error;
  }
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    console.log('Loaded data:', data); // Debug

    const { q = '', page = 1, limit = 10 } = req.query;
    const query = q.toLowerCase();

    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(query)
    );

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    const paginated = filtered.slice(start, end);

    res.json({
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      items: paginated
    });
  } catch (err) {
    next(err);
  }
});


// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));

    if (!item) {
      const error = new Error('Item not found');
      error.status = 404;
      throw error;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;
    const data = await readData();

    // TODO: Add input validation here
    item.id = Date.now();
    data.push(item);

    await writeData(data);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
