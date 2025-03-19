const express = require("express");
const {
  addProduct,
  getProducts,
  getCategories,
} = require("../controllers/Products");
const { authenticateToken } = require("../../auth/controllers/AuthControllers");

const router = express.Router();

router.post("/admin/products/add", authenticateToken, addProduct);
router.get("/products", getProducts);
router.get("/categories", getCategories);

module.exports = router;
