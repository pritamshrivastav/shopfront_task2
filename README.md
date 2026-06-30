# Shopfront — Basic E-Commerce Site

A full-stack e-commerce demo built with **Express.js**, server-rendered **EJS** templates, vanilla **CSS**, and a lightweight file-based JSON database (no native build dependencies, runs anywhere Node runs).

## Features

- **Product listings** — homepage grid with search and category filtering
- **Product detail pages** — full description, stock level, related products
- **Shopping cart** — session-based cart (add, update quantity, remove, clear)
- **User registration / login** — bcrypt-hashed passwords, session auth
- **Order processing** — checkout with shipping form, stock validation/decrement, order confirmation, order history
- **Database** — JSON-file storage for `users`, `products`, `orders` (see "Swapping the database" below)

## Project structure

```
ecommerce/
├── server.js              # App entry point
├── db/
│   ├── db.js               # Tiny file-based DB layer (users/products/orders collections)
│   ├── seed.js              # Seeds sample products on first run
│   └── data/                # JSON data files (created automatically)
├── middleware/
│   └── auth.js               # requireLogin guard + attaches currentUser/cartCount to views
├── routes/
│   ├── auth.js                # /register, /login, /logout
│   ├── products.js             # /, /products/:id
│   ├── cart.js                  # /cart, /cart/add, /cart/update, /cart/remove, /cart/clear
│   └── orders.js                 # /checkout, /orders, /orders/:id, confirmation page
├── views/                          # EJS templates
└── public/css/style.css             # Stylesheet
```

## Running it

```bash
npm install
node server.js
```

Then visit **http://localhost:3000**.

The product catalog is seeded automatically on first run. To reset all data (products/users/orders), stop the server and delete everything in `db/data/`.

## How the pieces fit together

- **Sessions** (`express-session`) hold both the logged-in user ID and the shopping cart (`{ productId: quantity }`), so the cart persists across pages without a database write until checkout.
- **Auth** uses `bcryptjs` to hash passwords on registration and compare on login. `middleware/auth.js` exposes `currentUser` and `cartCount` to every view automatically.
- **Checkout** re-validates stock for every cart item before creating the order, decrements stock, saves the order record (with a snapshot of item prices/names so future product edits don't change historical orders), and clears the cart.
- **Order history** is scoped per-user — `requireLogin` redirects anonymous visitors to `/login` and back.

## Swapping the database

The JSON file store in `db/db.js` exposes a small uniform API (`all`, `find`, `filter`, `findById`, `insert`, `update`, `remove`) per collection. To move to a real database (Postgres, MySQL, MongoDB, SQLite), reimplement that same interface against your DB client — the routes never touch the file system directly, so no route code needs to change.

If you'd prefer this to run on **Django** instead of Express, the same data model (`User`, `Product`, `Order`) and route map (catalog, product detail, cart, checkout, auth) translates directly into Django's `models.py` / `views.py` / Django's built-in auth system — let me know if you'd like that version built out instead.
