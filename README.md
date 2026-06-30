# Shopfront — Basic E-Commerce Site

A full-stack e-commerce demo built with **Express.js**, server-rendered **EJS** templates, vanilla **CSS**, and a lightweight file-based JSON database (no native build dependencies, runs anywhere Node runs).

## Features

- **Product listings** — homepage grid with search and category filtering
- **Product detail pages** — full description, stock level, related products
- **Shopping cart** — session-based cart (add, update quantity, remove, clear)
- **User registration / login** — bcrypt-hashed passwords, session auth
- **Order processing** — checkout with shipping form, stock validation/decrement, order confirmation, order history
- **Database** — JSON-file storage for `users`, `products`, `orders` (see "Swapping the database" below)
