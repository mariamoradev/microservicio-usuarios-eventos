const User = require("../domain/User");
const userRepository = require("../infrastructure/repositories/userRepository");
const kafkaProducer = require("../infrastructure/events/kafkaProducer");
const eventStore = require("../infrastructure/events/eventStore");
const { v4: uuidv4 } = require("uuid");

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

module.exports = {
  registerUser,
};
