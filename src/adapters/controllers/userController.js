const userService = require('../../application/userService');

async function register(req, res) {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: 'Usuario registrado', userId: user.userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
}

module.exports = { register };
