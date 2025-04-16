module.exports = {
  dbConfig: {
    host: "mysql", // Nombre del servicio en docker-compose
    user: "root",
    password: "rootpassword",
    database: "users_db",
    port: 3306,
  },
  kafka: {
    clientId: "user-service",
    brokers: ["kafka:9092"],
  },
  mongoUri: "mongodb://mongodb:27017/event_db",
};
