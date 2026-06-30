const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Cart is stored in the session as { [productId]: quantity }

function getCartDetails(req) {
  const cart = req.session.cart || {};
  const items = Object.entries(cart)
    .map(([productId, qty]) => {
      const product = db.products.findById(productId);
      if (!product) return null;
      return {
        product,
        quantity: qty,
        subtotal: +(product.price * qty).toFixed(2),
      };
    })
    .filter(Boolean);

  const total = +items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);
  return { items, total };
}

// GET /cart - view cart
router.get('/cart', (req, res) => {
  const { items, total } = getCartDetails(req);
  res.render('cart', { items, total });
});

// POST /cart/add - add item to cart
router.post('/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const product = db.products.findById(productId);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  if (!req.session.cart) req.session.cart = {};
  req.session.cart[productId] = (req.session.cart[productId] || 0) + qty;

  res.redirect(req.get('Referer') || '/cart');
});

// POST /cart/update - update quantity of an item
router.post('/cart/update', (req, res) => {
  const { productId, quantity } = req.body;
  const qty = parseInt(quantity, 10);

  if (!req.session.cart) req.session.cart = {};

  if (qty <= 0) {
    delete req.session.cart[productId];
  } else {
    req.session.cart[productId] = qty;
  }
  res.redirect('/cart');
});

// POST /cart/remove - remove item from cart
router.post('/cart/remove', (req, res) => {
  const { productId } = req.body;
  if (req.session.cart) {
    delete req.session.cart[productId];
  }
  res.redirect('/cart');
});

// POST /cart/clear - empty the cart
router.post('/cart/clear', (req, res) => {
  req.session.cart = {};
  res.redirect('/cart');
});

module.exports = router;
module.exports.getCartDetails = getCartDetails;
