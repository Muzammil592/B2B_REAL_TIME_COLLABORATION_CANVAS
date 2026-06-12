# B2B Real-Time Collaboration Canvas (Miro Clone)

A high-performance, scalable B2B real-time multi-user collaborative whiteboard application built using the MERN stack, Fabric.js, WebSockets (Socket.io), and CRDT-based state conflict resolution.

---

## 🚀 Development Progress Logs

### 🔹 Day 1: Foundation (Project Scaffold + Git Setup)
In the initial phase, the complete monorepo foundation and multi-container orchestration architecture were established to support localized development pipelines.
* **Monorepo Architecture Blueprint:** Designed a clean, decoupled folder structure separating the `Frontend/` client and `Backend/` API systems for complete service isolation.
* **Docker Compose Orchestration:** Configured a unified `docker-compose.yml` multi-container architecture mapping networks seamlessly between services.
* **Deterministic Environment Management:** Setup automated tracking layers using `.env` configurations to isolate service connection strings across global runtimes.

### 🔹 Day 2: Auth + DB (Authentication System & MongoDB Schemas)
Phase 2 focused on creating a secure, isolated authentication matrix and persistent data-layer architecture.
* **MongoDB Container Integration:** Spun up a decoupled database cluster inside the Docker internal network, securely routing data operations from the Node/Express environment.
* **Mongoose Schema Modeling:** * `User Schema`: Handles secure profiles with automated password encryption utilizing `bcryptjs`.
  * `Board Schema`: Modeled to support high-frequency infinite canvas layouts, element arrays, metadata structures, and access roles.
* **JWT Secure Cryptography Matrix:** Developed custom authorization middleware stacks verifying individual JSON Web Tokens (JWT) via environmental `JWT_SECRET` key verification.
* **Reliable API Health Optimization:** Registered production-standard automated debugging loops (`/health` route structures) to track and return operational connection matrices between Express and MongoDB.

---

## 🛠️ Current Technology Stack Matrix

* **Frontend Engine:** React.js, Vite, Tailwind CSS, Axios
* **Backend Runtime:** Node.js, Express.js (ES Modules syntax)
* **Database Cluster:** MongoDB, Mongoose ODM
* **DevOps Pipelines:** Docker, Docker Compose Core Networks

---

## 🚦 Local Installation & Run Infrastructure

To launch the multi-service cluster context locally, execute the standard orchestration build commands from the root directory:

```bash
# Spin up all microservices with automatic build cache updates
docker compose up --build

# Verify all cluster nodes are up and running cleanly
docker ps
