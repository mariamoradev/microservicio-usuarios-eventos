# Microservicio de Usuarios

## Descripción

Este microservicio de usuarios está implementado en Node.js utilizando:

- **MySQL** para almacenar los datos transaccionales de los usuarios.
- **MongoDB** central para almacenar eventos del sistema (Event Sourcing).
- **Kafka** para la comunicación asíncrona de eventos.
- Arquitectura Hexagonal para separar la lógica del dominio, la aplicación, la infraestructura y los adaptadores.

## Requisitos

- Node.js
- Docker y Docker Compose

## Instalación y Ejecución

1. Clona el repositorio.
2. Ejecuta `npm install` en la raíz del proyecto para instalar todas las dependencias.
3. (Opcional) Asegúrate de haber creado la tabla `users` en MySQL. Puedes usar el siguiente script SQL:
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     userId VARCHAR(36) NOT NULL,
     name VARCHAR(255) NOT NULL,
     lastName VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     password VARCHAR(255) NOT NULL,
     phone VARCHAR(50),
     createdAt DATETIME NOT NULL
   );
   ```
