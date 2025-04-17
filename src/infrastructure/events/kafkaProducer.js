const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "user-service",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initProducer(maxRetries = 10) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔌 Intentando conectar a Kafka (intento ${attempt})...`);
      await producer.connect();
      console.log("Conexión exitosa con Kafka");
      return;
    } catch (err) {
      console.error(
        `Error conectando a Kafka (intento ${attempt}):`,
        err.message
      );
      if (attempt === maxRetries) throw err;
      await wait(3000); // espera 3 segundos y vuelve a intentar
    }
  }
}

async function publish(topic, message) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}

module.exports = {
  initProducer,
  publish,
};
