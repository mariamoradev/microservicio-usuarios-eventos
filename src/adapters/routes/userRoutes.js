const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Registro de usuario
router.post("/register", userController.register);

// Inicio de sesión
router.post("/login", userController.login);

// Obtener usuario por ID
router.get("/:id", userController.getUser);

// Actualizar usuario por ID
router.put("/:id", userController.update);

// Eliminar usuario por ID
router.delete("/:id", userController.remove);

module.exports = router;
