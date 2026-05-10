// scripts/seedProducts.js
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Fix dotenv path — always load from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") }); // ← points to root .env

import Product from "../models/Product.js";
import sequelize from "../../config/db.js";

const products = [
  // ── Electronics ──────────────────────────────────────────────────────────
  { title: "iPhone 15", price: 999.99, category: "Electronics", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", description: "Latest Apple iPhone 15 with Dynamic Island and 48MP camera." },
  { title: "Samsung Galaxy S24", price: 899.99, category: "Electronics", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", description: "Samsung flagship with AI features and 200MP camera." },
  { title: "MacBook Pro 14", price: 1999.99, category: "Electronics", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", description: "Apple M3 chip, 16GB RAM, stunning Liquid Retina display." },
  { title: "iPad Air M1", price: 749.99, category: "Electronics", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", description: "Thin, powerful iPad with M1 chip and 10.9-inch display." },
  { title: "Sony WH-1000XM5", price: 349.99, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", description: "Industry-leading noise cancelling wireless headphones." },
  { title: "boAt Rockerz 450", price: 29.99, category: "Electronics", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", description: "Wireless on-ear headphones with 15 hours battery life." },
  { title: "Canon EOS R50", price: 679.99, category: "Electronics", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400", description: "Compact mirrorless camera with 24.2MP APS-C sensor." },
  { title: 'Dell 27" Monitor', price: 429.99, category: "Electronics", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400", description: "4K UHD IPS monitor with USB-C connectivity." },
  { title: "Logitech MX Master 3", price: 99.99, category: "Electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", description: "Advanced wireless mouse for power users." },
  { title: "Apple Watch Series 9", price: 499.99, category: "Electronics", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400", description: "Smartwatch with health sensors and always-on display." },

  // ── Footwear ──────────────────────────────────────────────────────────────
  { title: "Nike Running Shoes", price: 120.50, category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", description: "Lightweight and breathable running shoes for daily training." },
  { title: "Adidas Ultraboost 23", price: 180.00, category: "Footwear", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", description: "Premium running shoes with BOOST midsole cushioning." },
  { title: "Nike Air Force 1", price: 110.00, category: "Footwear", image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400", description: "Classic low-top sneakers with iconic Nike branding." },
  { title: "Puma RS-X", price: 89.99, category: "Footwear", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400", description: "Retro-inspired chunky sneakers with RS cushioning." },
  { title: "Clarks Desert Boot", price: 130.00, category: "Footwear", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400", description: "Iconic suede ankle boots for casual and smart looks." },

  // ── Clothing ──────────────────────────────────────────────────────────────
  { title: "Levi's 511 Slim Jeans", price: 59.99, category: "Clothing", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", description: "Classic slim fit jeans in stretch denim." },
  { title: "Allen Solly Formal Shirt", price: 39.99, category: "Clothing", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", description: "Premium cotton formal shirt for office wear." },
  { title: "H&M Crew Neck Tee", price: 19.99, category: "Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", description: "Essential cotton T-shirt in a relaxed fit." },
  { title: "Zara Puffer Jacket", price: 89.99, category: "Clothing", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", description: "Lightweight puffer jacket for cold weather." },
  { title: "United Colors Hoodie", price: 49.99, category: "Clothing", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400", description: "Comfortable fleece hoodie for casual wear." },

  // ── Accessories ───────────────────────────────────────────────────────────
  { title: "Fossil Gen 6 Watch", price: 249.99, category: "Accessories", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", description: "Hybrid smartwatch with classic analogue design." },
  { title: "Ray-Ban Aviator", price: 159.99, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", description: "Iconic gold frame aviator sunglasses with green lenses." },
  { title: "Leather Wallet", price: 34.99, category: "Accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400", description: "Slim genuine leather bifold wallet with RFID blocking." },
  { title: "Canvas Backpack", price: 54.99, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", description: "Durable 30L canvas backpack for travel and work." },
];

// Connect and sync tables
await sequelize.authenticate();
await sequelize.sync({ alter: true });
console.log("Connected to MySQL");

// Clear existing products
await Product.destroy({ where: {} });
console.log("Cleared existing products");

// Insert all products
await Product.bulkCreate(products);
console.log(`✅ Seeded ${products.length} products successfully`);

process.exit();