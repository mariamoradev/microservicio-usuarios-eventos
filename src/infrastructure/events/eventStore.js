const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventId: String,
    timestamp: String,
    source: String,
    topic: String,
    payload: Object,
    snapshot: Object,
  },
  {
    collection: "events",
  }
);

// Crear índices obligatorios:
eventSchema.index({ timestamp: 1 });
eventSchema.index({ source: 1 });
eventSchema.index({ topic: 1 });

const Event = mongoose.model("Event", eventSchema);

// Función para conectar a MongoDB
async function connectMongo() {
  await mongoose.connect("mongodb://mongodb:27017/event_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Función para guardar un evento
async function saveEvent(eventData) {
  const event = new Event(eventData);
  await event.save();
}

// Exporta ambas funciones
module.exports = {
  connectMongo,
  saveEvent,
};
