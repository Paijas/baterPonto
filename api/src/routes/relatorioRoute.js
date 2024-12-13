const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");

router.get("/user", relatorioController.getRelatorioUser);
router.post("/gerarRelatorio", relatorioController.gerarRelatorioMesUser);
router.post("/gerarRelatorioGeral", relatorioController.gerarRelatorioMesGeral);

module.exports = router;
