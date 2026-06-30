require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const seed = require('./db/seed');
const { attachUser } = require('./middleware/auth');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Seed sample products on startup (no-op if already seeded)
seed();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

// Sessions (cart + auth state). Uses an in-memory store, fine for a demo project.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
  })
);

// Make currentUser / cartCount available in every view
app.use(attachUser);

// Routes
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
