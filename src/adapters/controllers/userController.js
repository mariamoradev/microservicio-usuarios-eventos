const userService = require("../../application/userService");

async function register(req, res) {
  try {
    const user = await userService.registerUser(req.body);
    res
      .status(201)
      .json({ message: "Usuario registrado", userId: user.userId });
  } catch (error) {
    console.error("❌ Error en register:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    res
      .status(200)
      .json({ message: `Bienvenido ${user.name}`, userId: user.userId });
  } catch (error) {
    console.error("❌ Error en login:", error);
    // Si las credenciales son incorrectas, enviamos error 401.
    res.status(401).json({ message: error.message });
  }
}

async function getUser(req, res) {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error en getUser:", error);
    res.status(404).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const updatedUser = await userService.updateUser(id, req.body);
    res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    console.error("❌ Error en update:", error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    await userService.deleteUser(id);
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("❌ Error en remove:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
}

module.exports = {
  register,
  login,
  getUser,
  update,
  remove,
};
