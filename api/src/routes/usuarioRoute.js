const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const middlewareAuth = require("../middleware/auth");

router.get("/all", middlewareAuth(), usuarioController.getAllUsers);
router.get("/:id", middlewareAuth(), usuarioController.getUser);
router.post("/", usuarioController.criarUsuario);
router.post("/login", usuarioController.usuarioLogin);

module.exports = router;
