import express from 'express';
import Product from '../models/Product.js';
import { adminAuth } from '../middleware/auth.js';

import productsJSON from '../data/products.json' assert { type: 'json' }; 
const router = express.Router();


// Get all products
router.get('/', async (req, res) => {
  try {
    //! DONT USE IN PRODUCTION get products from json file
    res.json(productsJSON);    
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//TODO Get single product

// Create product (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//TODO Update product (admin only)

//TODO Delete product (admin only)

export default router;