import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();   
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// fetch single product
router.get('/:id', async (req, res) => {
  console.log("enter into find product",req.params.id);
  try {
    const product = await Product.findByPk(req.params.id); 
    console.log(product);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;