// Seeds the products collection with sample data if it's empty.
// Run automatically on server start (see server.js).

const db = require('./db');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.',
    price: 89.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stock: 25,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness-focused smartwatch with heart-rate monitoring, GPS tracking, sleep analysis, and a always-on AMOLED display.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    stock: 18,
  },
  {
    name: 'Leather Backpack',
    description: 'Handcrafted full-grain leather backpack with a padded 15" laptop sleeve, water-resistant lining, and brass hardware.',
    price: 119.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    stock: 12,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handmade ceramic mugs, microwave and dishwasher safe, each with a unique glazed finish.',
    price: 34.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
    stock: 40,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and a durable rubber outsole.',
    price: 79.99,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    stock: 30,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours. 750ml capacity.',
    price: 24.99,
    category: 'Outdoors',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    stock: 50,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Compact 75% mechanical keyboard with hot-swappable switches, RGB backlighting, and a aluminum frame.',
    price: 109.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80',
    stock: 15,
  },
  {
    name: 'Wool Throw Blanket',
    description: 'Soft merino wool blend throw blanket, perfect for the couch or bed. Available in a versatile neutral tone.',
    price: 59.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1580301762395-83f31a356a37?w=600&q=80',
    stock: 22,
  },
];

function seed() {
  const existing = db.products.all();
  if (existing.length > 0) {
    console.log(`Products already seeded (${existing.length} items). Skipping.`);
    return;
  }
  sampleProducts.forEach((p) => db.products.insert(p));
  console.log(`Seeded ${sampleProducts.length} products.`);
}

module.exports = seed;

if (require.main === module) {
  seed();
}
