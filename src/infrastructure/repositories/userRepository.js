const db = require("../database/mysql");

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

module.exports = {
  save,
};
