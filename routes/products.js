const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET / - homepage with product listings (search + category filter)
router.get('/', (req, res) => {
  let products = db.products.all();
  const { q, category } = req.query;

  if (q) {
    const term = q.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    );
  }
  if (category && category !== 'All') {
    products = products.filter((p) => p.category === category);
  }

  const categories = ['All', ...new Set(db.products.all().map((p) => p.category))];

  res.render('index', {
    products,
    categories,
    activeCategory: category || 'All',
    query: q || '',
  });
});

// GET /products/:id - product details page
router.get('/products/:id', (req, res) => {
  const product = db.products.findById(req.params.id);
  if (!product) {
    return res.status(404).render('404', { message: 'Product not found.' });
  }
  // simple "related products" - same category, excluding current
  const related = db.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.render('product-detail', { product, related });
});

module.exports = router;
