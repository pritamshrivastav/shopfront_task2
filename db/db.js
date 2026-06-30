// Lightweight file-based JSON "database".
// Each collection (users, products, orders) is stored as a JSON array in db/data/*.json.
// Provides a tiny synchronous API: all(), find(), insert(), update(), remove().
// This avoids native module compilation issues while keeping data persisted to disk,
// and the API is intentionally simple to swap out for a real SQL DB later if desired.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function load(collection) {
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) return [];
  const raw = fs.readFileSync(fp, 'utf-8').trim();
  if (!raw) return [];
  return JSON.parse(raw);
}

function save(collection, data) {
  fs.writeFileSync(filePath(collection), JSON.stringify(data, null, 2));
}

let idCounters = {};
function nextId(collection) {
  const items = load(collection);
  const max = items.reduce((m, item) => Math.max(m, item.id || 0), 0);
  return max + 1;
}

const Collection = (name) => ({
  all() {
    return load(name);
  },
  find(predicate) {
    return load(name).find(predicate);
  },
  filter(predicate) {
    return load(name).filter(predicate);
  },
  findById(id) {
    return load(name).find((item) => item.id === Number(id));
  },
  insert(record) {
    const items = load(name);
    const newRecord = { id: nextId(name), ...record };
    items.push(newRecord);
    save(name, items);
    return newRecord;
  },
  update(id, updates) {
    const items = load(name);
    const idx = items.findIndex((item) => item.id === Number(id));
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    save(name, items);
    return items[idx];
  },
  remove(id) {
    const items = load(name);
    const filtered = items.filter((item) => item.id !== Number(id));
    save(name, filtered);
    return filtered.length !== items.length;
  },
});

module.exports = {
  users: Collection('users'),
  products: Collection('products'),
  orders: Collection('orders'),
};
