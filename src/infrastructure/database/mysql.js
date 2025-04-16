const mysql = require("mysql2/promise");
const { dbConfig } = require("../../config/config");

let pool;

async function init() {
  pool = await mysql.createPool(dbConfig);
}

async function query(sql, params) {
  if (!pool) await init();
  return pool.execute(sql, params);
}

module.exports = {
  query,
};
