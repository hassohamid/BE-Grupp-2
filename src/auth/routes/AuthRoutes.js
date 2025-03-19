const express = require("express");
const {
  register,
  signIn,
  verifyToken,
  admin,
} = require("../controllers/AuthControllers");

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/signin", signIn);
router.get("/auth/verify", verifyToken);
router.post("/auth/admin", admin);

module.exports = router;
