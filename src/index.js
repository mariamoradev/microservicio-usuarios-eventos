const express = require("express");
const app = express();
const userRoutes = require("./adapters/routes/userRoutes");
const { connectMongo } = require("./infrastructure/events/eventStore");
const kafkaProducer = require("./infrastructure/events/kafkaProducer");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/users", userRoutes);

async function start() {
  try {
    // Conexión a la MongoDB central para eventos
    await connectMongo();
    // Inicializa el productor de Kafka
    await kafkaProducer.initProducer();
    // Inicia el servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando la aplicación", error);
  }
}

start();
