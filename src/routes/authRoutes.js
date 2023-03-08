const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const {
  loginSchema,
  registerSchema,
} = require("../middleware/validation/validationSchemas");
const { validate } = require("../middleware/validation/validationMiddleware");

router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);

module.exports = router;

//hej
