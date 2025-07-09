// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();
// const DATA_PATH = path.join(__dirname, '../../data/items.json');

// // GET /api/stats
// router.get('/', (req, res, next) => {
//   fs.readFile(DATA_PATH, (err, raw) => {
//     if (err) return next(err);

//     const items = JSON.parse(raw);
//     // Intentional heavy CPU calculation
//     const stats = {
//       total: items.length,
//       averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
//     };

//     res.json(stats);
//   });
// });

// module.exports = router;

const express = require('express');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cachedStats = null;
let lastModifiedTime = null;

// Recalculate stats
async function calculateStats() {
  const raw = await fsp.readFile(DATA_PATH, 'utf8');
  const items = JSON.parse(raw);
  cachedStats = {
    total: items.length,
    averagePrice:
      items.reduce((acc, cur) => acc + cur.price, 0) / items.length,
  };
}

// Check file modification time and update cache if needed
async function getStats() {
  const { mtimeMs } = await fsp.stat(DATA_PATH);
  if (!cachedStats || mtimeMs !== lastModifiedTime) {
    lastModifiedTime = mtimeMs;
    await calculateStats();
  }
  return cachedStats;
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
