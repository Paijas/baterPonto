const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.get("/all",usuarioController.getAllUsers)
router.post("/", usuarioController.criarUsuario);
router.post("/login", usuarioController.usuarioLogin);

module.exports = router;
