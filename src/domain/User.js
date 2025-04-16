const { v4: uuidv4 } = require("uuid");

class User {
  constructor({ name, lastName, email, password, phone }) {
    this.userId = uuidv4();
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.password = password; // En producción, encriptación de la contraseña.
    this.phone = phone;
    this.createdAt = new Date();
  }
}

module.exports = User;
