// Middleware helpers for authentication and making the logged-in user / cart count
// available to every EJS view via res.locals.

const db = require('../db/db');

function attachUser(req, res, next) {
  if (req.session.userId) {
    const user = db.users.findById(req.session.userId);
    res.locals.currentUser = user ? { id: user.id, name: user.name, email: user.email } : null;
  } else {
    res.locals.currentUser = null;
  }
  const cart = req.session.cart || {};
  res.locals.cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  next();
}

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    req.session.redirectAfterLogin = req.originalUrl;
    return res.redirect('/login');
  }
  next();
}

module.exports = { attachUser, requireLogin };
