const express = require("express");
const router = express.Router();
const presencaController = require("../controllers/presencaController");

router.post("/checkin", presencaController);
router.post("/checkout", presencaController)
module.exports = router;
