// routes/usuarioRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const usuarioController = require("../controllers/usuarioController");

const upload = multer({});
router.get("/findAll", usuarioController.findAll);
router.get("/findById/:id", usuarioController.findById);
router.get("/findByEmail", usuarioController.findByEmail);
router.post("/create", usuarioController.create);
router.post("/signin", usuarioController.signin);
router.put("/inativar/:id", usuarioController.inativar);
router.put("/reativar/:id", usuarioController.reativar);
router.put("/alterarSenha/:id", usuarioController.alterarSenha);
router.put(
  "/alterar/:id",
  upload.single("file"),
  usuarioController.alterarDados
);

module.exports = router;
