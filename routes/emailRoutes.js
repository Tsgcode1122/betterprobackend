const express = require("express");
const router = express.Router();
const emailController = require("../Controllers/emailController");

// Route to send verification code
router.post("/formSubmission", emailController.formSubmission);
router.post("/subscriber", emailController.emailSubscriber);
module.exports = router;
