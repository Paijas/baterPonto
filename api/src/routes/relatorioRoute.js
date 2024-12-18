const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const {middlewareAuth} = require("../middleware/auth");


router.post("/gerarRelatorio", middlewareAuth(),relatorioController.gerarRelatorioMesUser);
router.post("/gerarRelatorioAnual", middlewareAuth(), relatorioController.gerarRelatorioAnual);
router.post("/gerarRelatorioGeral", middlewareAuth(), relatorioController.gerarRelatorioMesGeral);


module.exports = router;
