const db = require("../database/mysql");

// Guarda un nuevo usuario en MySQL
async function save(user) {
  const sql =
    "INSERT INTO users (userId, name, lastName, email, password, phone, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const params = [
    user.userId,
    user.name,
    user.lastName,
    user.email,
    user.password,
    user.phone,
    user.createdAt,
  ];
  await db.query(sql, params);
}

// Retorna el primer usuario encontrado que coincida con el email
async function getUserByEmail(email) {
  const sql = "SELECT * FROM users WHERE email = ?";
  const [rows] = await db.query(sql, [email]);
  return rows[0];
}

// Retorna un usuario por su id
async function getUserById(id) {
  const sql = "SELECT * FROM users WHERE id = ?";
  const [rows] = await db.query(sql, [id]);
  return rows[0];
}

// Actualiza un usuario con el id especificado usando los nuevos datos
async function updateUser(id, newData) {
  const sql =
    "UPDATE users SET name = ?, lastName = ?, email = ?, password = ?, phone = ? WHERE id = ?";
  const params = [
    newData.name,
    newData.lastName,
    newData.email,
    newData.password,
    newData.phone,
    id,
  ];
  await db.query(sql, params);
  return getUserById(id); // Retorna el usuario actualizado
}

// Elimina un usuario con el id especificado
// async function deleteUser(id) {
//   const sql = "DELETE FROM users WHERE id = ?";
//   await db.query(sql, [id]);
// }

module.exports = {
  save,
  getUserByEmail,
  getUserById,
  updateUser,
  // deleteUser, //
};
