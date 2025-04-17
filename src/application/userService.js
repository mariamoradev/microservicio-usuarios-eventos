const User = require("../domain/User");
const userRepository = require("../infrastructure/repositories/userRepository");
const kafkaProducer = require("../infrastructure/events/kafkaProducer");
const eventStore = require("../infrastructure/events/eventStore");
const { v4: uuidv4 } = require("uuid");

async function registerUser(userData) {
  try {
    console.log("Datos recibidos en userService:", userData);

    // Crear dominio User
    const user = new User(userData);
    console.log("Instancia de usuario creada:", user);

    // Guardar en MySQL
    await userRepository.save(user);
    console.log("Usuario guardado en MySQL");

    // Evento de registro inicial
    const registrationEvent = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "user-registration",
      payload: userData,
      snapshot: { userId: user.userId, status: "REGISTERED" },
    };
    await eventStore.saveEvent(registrationEvent);
    console.log("Evento de registro guardado en MongoDB");

    // Evento de procesamiento (welcome-flow)
    await kafkaProducer.publish("welcome-flow", {
      name: user.name,
      email: user.email,
      subject: "¡Bienvenido a nuestra plataforma!",
      content: `Hola ${user.name}, gracias por registrarte en nuestro e-commerce.`,
    });
    console.log("Evento publicado en Kafka (welcome-flow)");

    // Evento de notificación (notification-topic)
    const notificationEvent = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "notification-topic",
      payload: {
        to: user.email,
        subject: "¡Bienvenido a nuestra plataforma!",
        content: `Hola ${user.name}, gracias por registrarte en nuestro e-commerce.`,
      },
      snapshot: { userId: user.userId, status: "NOTIFIED" },
    };
    await eventStore.saveEvent(notificationEvent);
    console.log("Evento de notificación guardado en MongoDB");

    await kafkaProducer.publish("notification-topic", {
      to: notificationEvent.payload.to,
      subject: notificationEvent.payload.subject,
      content: notificationEvent.payload.content,
    });
    console.log(
      "Evento de notificación publicado en Kafka (notification-topic)"
    );

    return user;
  } catch (error) {
    console.error("Error en registerUser:", error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    console.log(`🔍 Buscando usuario con email: ${email}`);
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("Credenciales incorrectas: usuario no encontrado");
    }
    if (user.password !== password) {
      throw new Error("Credenciales incorrectas: contraseña inválida");
    }
    console.log("Usuario autenticado exitosamente:", user);

    // Evento de login
    const loginEvent = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "user-login",
      payload: { email },
      snapshot: { userId: user.userId, status: "LOGGED_IN" },
    };
    await eventStore.saveEvent(loginEvent);
    console.log("Evento de login guardado en MongoDB");

    await kafkaProducer.publish("user-login", {
      email: user.email,
      subject: "Inicio de sesión exitoso",
      content: `Hola ${user.name}, has iniciado sesión correctamente.`,
    });
    console.log("Evento de login publicado en Kafka (user-login)");

    return user;
  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error;
  }
}

async function updateUser(id, newData) {
  try {
    console.log(`Actualizando usuario con id: ${id}`);
    const updatedUser = await userRepository.updateUser(id, newData);
    console.log("Usuario actualizado:", updatedUser);

    // Evento de actualización
    const updateEvent = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "user-update",
      payload: newData,
      snapshot: { userId: updatedUser.userId, status: "UPDATED" },
    };
    await eventStore.saveEvent(updateEvent);
    console.log("Evento de actualización guardado en MongoDB");

    await kafkaProducer.publish("user-update", {
      email: updatedUser.email,
      subject: "Usuario actualizado",
      content: `Los datos del usuario han sido actualizados.`,
    });
    console.log("Evento de actualización publicado en Kafka (user-update)");

    return updatedUser;
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
}

/*
async function deleteUser(id) {
  try {
    console.log(`Eliminando usuario con id: ${id}`);
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    await userRepository.deleteUser(id);
    console.log("Usuario eliminado en MySQL");

    // Evento de eliminación
    const deletionEvent = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      source: "UserService",
      topic: "user-deletion",
      payload: { userId: user.userId },
      snapshot: { userId: user.userId, status: "DELETED" },
    };
    await eventStore.saveEvent(deletionEvent);
    console.log("Evento de eliminación guardado en MongoDB");

    await kafkaProducer.publish("user-deletion", {
      email: user.email,
      subject: "Usuario eliminado",
      content: `El usuario con email ${user.email} ha sido eliminado.`,
    });
    console.log("Evento de eliminación publicado en Kafka (user-deletion)");

    return user;
  } catch (error) {
    console.error("Error en deleteUser:", error);
    throw error;
  }
}
*/

async function getUserById(id) {
  try {
    console.log(`🔍 Obteniendo usuario con id: ${id}`);
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  } catch (error) {
    console.error("Error en getUserById:", error);
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  // deleteUser, //
  getUserById,
};
