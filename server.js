require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./src/products/routes/ProductRoutes");
const authRoutes = require("./src/auth/routes/AuthRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(productRoutes);
app.use(authRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
