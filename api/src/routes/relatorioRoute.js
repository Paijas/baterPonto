const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const {middlewareAuth} = require("../middleware/auth");


router.post("/gerarRelatorio", middlewareAuth(),relatorioController.gerarRelatorioMesUser);
router.post("/gerarRelatorioGeral", middlewareAuth(), relatorioController.gerarRelatorioMesGeral);

router.get("/user", middlewareAuth(), relatorioController.getRelatorioUser);

module.exports = router;
