const express = require("express");
const router = express.Router();
const presencaController = require("../controllers/presencaController");

router.post("/checkin", presencaController.registrarCheckin);
router.post("/checkout", presencaController.registrarCheckout);
router.post("/almoco", presencaController.registrarAlmocoSaida);
router.post("/almocovolta", presencaController.registrarAlmocoVolta);
module.exports = router;
