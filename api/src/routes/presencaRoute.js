const express = require("express");
const router = express.Router();
const presencaController = require("../controllers/presencaController");

const {middlewareAuth} = require("../middleware/auth");

router.get("/ultimaspresencas/:quantidade",middlewareAuth(), presencaController.ultimasPresencas);

router.post("/checkin/:id",middlewareAuth(), presencaController.registrarCheckin);
router.post("/checkout/:id",middlewareAuth(), presencaController.registrarCheckout);
router.post("/almoco/:id",middlewareAuth(), presencaController.registrarAlmocoSaida);
router.post("/almocovolta/:id",middlewareAuth(), presencaController.registrarAlmocoVolta);

module.exports = router;
