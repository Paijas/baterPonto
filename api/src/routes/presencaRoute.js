const express = require("express");
const router = express.Router();
const presencaController = require("../controllers/presencaController");

router.get("/ultimaspresencas/:quantidade", presencaController.ultimasPresencas);

router.post("/checkin/:id", presencaController.registrarCheckin);
router.post("/checkout/:id", presencaController.registrarCheckout);
router.post("/almoco/:id", presencaController.registrarAlmocoSaida);
router.post("/almocovolta/:id", presencaController.registrarAlmocoVolta);

router.post("/gerarRelatorio", presencaController.gerarRelatorioMesUser);
router.post("/gerarRelatorioGeral", presencaController.gerarRelatorioMesGeral);

module.exports = router;
