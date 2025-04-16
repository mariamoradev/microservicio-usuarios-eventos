const User = require("../domain/User");
const userRepository = require("../infrastructure/repositories/userRepository");
const kafkaProducer = require("../infrastructure/events/kafkaProducer");
const eventStore = require("../infrastructure/events/eventStore");
const { v4: uuidv4 } = require("uuid");

// Función para registrar un usuario (ya existente)
async function registerUser(userData) {
  try {
    console.log("✅ Datos recibidos en userService:", userData);

    const user = new User(userData);
    console.log("✅ Instancia de usuario creada:", user);

    await userRepository.save(user);
    console.log("✅ Usuario guardado en MySQL");

    const event = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "user-registration",
      payload: userData,
      snapshot: { userId: user.userId, status: "REGISTERED" },
    };

    await eventStore.saveEvent(event);
    console.log("✅ Evento guardado en MongoDB");

    await kafkaProducer.publish("welcome-flow", {
      name: user.name,
      email: user.email,
      subject: "¡Bienvenido a nuestra plataforma!",
      content: `Hola ${user.name}, gracias por registrarte en nuestro e-commerce.`,
    });
    console.log("✅ Evento publicado en Kafka");

    return user;
  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    throw error;
  }
}

// Función de login: valida email y password
async function loginUser(email, password) {
  try {
    console.log(`🔍 Buscando usuario con email: ${email}`);
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("Credenciales incorrectas: usuario no encontrado");
    }
    // En este ejemplo se comparan las contraseñas en texto plano.
    if (user.password !== password) {
      throw new Error("Credenciales incorrectas: contraseña inválida");
    }
    console.log("✅ Usuario autenticado exitosamente:", user);

    // Opcional: Genera y guarda un evento de login
    const event = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "user-login",
      payload: { email },
      snapshot: { userId: user.userId, status: "LOGGED_IN" },
    };
    await eventStore.saveEvent(event);
    console.log("✅ Evento de login guardado en MongoDB");

    await kafkaProducer.publish("user-login", {
      email: user.email,
      subject: "Inicio de sesión exitoso",
      content: `Hola ${user.name}, has iniciado sesión correctamente.`,
    });
    console.log("✅ Evento de login publicado en Kafka");

    return user;
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    throw error;
  }
}

// Función para actualizar un usuario
async function updateUser(id, newData) {
  try {
    console.log(`✏️ Actualizando usuario con id: ${id}`);
    const updatedUser = await userRepository.updateUser(id, newData);
    console.log("✅ Usuario actualizado:", updatedUser);

    // Genera evento de actualización
    const event = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "user-update",
      payload: newData,
      snapshot: { id, status: "UPDATED" },
    };
    await eventStore.saveEvent(event);
    console.log("✅ Evento de actualización guardado en MongoDB");

    await kafkaProducer.publish("user-update", {
      email: updatedUser.email,
      subject: "Usuario actualizado",
      content: `Los datos del usuario han sido actualizados.`,
    });
    console.log("✅ Evento de actualización publicado en Kafka");

    return updatedUser;
  } catch (error) {
    console.error("❌ Error en updateUser:", error);
    throw error;
  }
}

// Función para eliminar un usuario
async function deleteUser(id) {
  try {
    console.log(`🗑️ Eliminando usuario con id: ${id}`);
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    await userRepository.deleteUser(id);
    console.log("✅ Usuario eliminado en MySQL");

    // Genera evento de eliminación
    const event = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "user-deletion",
      payload: { id },
      snapshot: { status: "DELETED" },
    };
    await eventStore.saveEvent(event);
    console.log("✅ Evento de eliminación guardado en MongoDB");

    await kafkaProducer.publish("user-deletion", {
      email: user.email,
      subject: "Usuario eliminado",
      content: `El usuario con email ${user.email} ha sido eliminado.`,
    });
    console.log("✅ Evento de eliminación publicado en Kafka");

    return user;
  } catch (error) {
    console.error("❌ Error en deleteUser:", error);
    throw error;
  }
}

// Función para obtener usuario por id (se utiliza directamente la función del repositorio)
async function getUserById(id) {
  try {
    console.log(`🔍 Obteniendo usuario con id: ${id}`);
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  } catch (error) {
    console.error("❌ Error en getUserById:", error);
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById, // Se exporta para usar en el controlador
};
