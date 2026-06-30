const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { requireLogin } = require('../middleware/auth');
const { getCartDetails } = require('./cart');

// GET /checkout - checkout form (requires login)
router.get('/checkout', requireLogin, (req, res) => {
  const { items, total } = getCartDetails(req);
  if (items.length === 0) {
    return res.redirect('/cart');
  }
  res.render('checkout', { items, total, error: null });
});

// POST /checkout - process the order
router.post('/checkout', requireLogin, (req, res) => {
  const { items, total } = getCartDetails(req);
  if (items.length === 0) {
    return res.redirect('/cart');
  }

  const { fullName, address, city, postalCode, country, paymentMethod } = req.body;
  if (!fullName || !address || !city || !postalCode || !country) {
    return res.render('checkout', { items, total, error: 'Please fill in all shipping fields.' });
  }

  // Check stock availability
  for (const item of items) {
    const current = db.products.findById(item.product.id);
    if (!current || current.stock < item.quantity) {
      return res.render('checkout', {
        items,
        total,
        error: `Sorry, "${item.product.name}" only has ${current ? current.stock : 0} in stock.`,
      });
    }
  }

  // Decrement stock
  items.forEach((item) => {
    const current = db.products.findById(item.product.id);
    db.products.update(item.product.id, { stock: current.stock - item.quantity });
  });

  const order = db.orders.insert({
    userId: req.session.userId,
    items: items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      subtotal: i.subtotal,
    })),
    total,
    shipping: { fullName, address, city, postalCode, country },
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: 'Processing',
    createdAt: new Date().toISOString(),
  });

  req.session.cart = {};
  res.redirect(`/orders/${order.id}/confirmation`);
});

// GET /orders/:id/confirmation - order confirmation page
router.get('/orders/:id/confirmation', requireLogin, (req, res) => {
  const order = db.orders.findById(req.params.id);
  if (!order || order.userId !== req.session.userId) {
    return res.status(404).render('404', { message: 'Order not found.' });
  }
  res.render('order-confirmation', { order });
});

// GET /orders - order history for logged-in user
router.get('/orders', requireLogin, (req, res) => {
  const orders = db.orders
    .filter((o) => o.userId === req.session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.render('orders', { orders });
});

// GET /orders/:id - single order detail
router.get('/orders/:id', requireLogin, (req, res) => {
  const order = db.orders.findById(req.params.id);
  if (!order || order.userId !== req.session.userId) {
    return res.status(404).render('404', { message: 'Order not found.' });
  }
  res.render('order-detail', { order });
});

module.exports = router;
