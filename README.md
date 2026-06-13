# B2B Real-Time Collaboration Canvas (Miro Clone)

A high-performance, enterprise-grade, scalable B2B real-time multi-user collaborative whiteboard application built using the MERN stack, Fabric.js vector canvas engines, WebSockets (Socket.io), and CRDT-based operational state synchronizations.

---

## 📅 Architectural Development Progress Logs

### 🔹 Day 1: System Foundation (Project Scaffold & Docker Integration)
In the initial phase, a unified monorepo environment and multi-container orchestration layer were established to support an isolated local development ecosystem.
* **Monorepo System Architecture:** Scaffolded a clean, decoupled folder structure separating the frontend client interface (`Frontend/`) from the backend microservice engine (`Backend/`) to enforce continuous separation of concerns.
* **Docker Compose Orchestration Engine:** Configured a core `docker-compose.yml` multi-container matrix to spin up local client, server, and network layers deterministically with persistent data layers.
* **Isolated Environment Management:** Engineered automated environment tracking variables using isolated local `.env` setups to safely bridge system-wide access tokens without deployment exposure.

### 🔹 Day 2: Security & Persistent Layer (JWT Auth + MongoDB Schemas)
Phase 2 transformed the backend application context into a persistent, production-secure REST server framework by validating database pipelines and asset authentication middleware.
* **MongoDB Decoupled Container Isolation:** Implemented a secure database instance mounted fully within Docker's virtual bridge network, binding API request pipelines across the backend ecosystem using deterministic domain routes (`mongodb://mongodb:27017/miro_db`).
* **Relational Mongoose Object Modeling:** * `User Schema`: Designed secure demographic profiles using automated runtime salt password encryption via `bcryptjs`.
  * `Board Schema`: Modeled highly flexible dataset structures capable of storing complex geometric arrays, absolute transform matrix positions, ownership metadata, and canvas permissions.
* **Cryptographic JWT Security Matrix:** Deployed modular custom endpoint guard-gates using JSON Web Tokens (`jsonwebtoken`) to handle credential verification loops seamlessly under protected authorization states.
* **API Framework Reliability Health Check:** Registered a production-standard, automated service loop endpoint (`GET /health`) that instantly monitors and verifies data-layer socket connectivity between the Express instance and the MongoDB service container.

### 🔹 Day 3: Graphics Layer Baseline (Infinite Canvas & Fabric.js Engine)
Phase 3 introduced the complete vector processing mechanics, enabling a standalone, infinite spatial drawing dashboard using mathematical viewport transformations.
* **Fabric.js Object-Oriented Framework Integration:** Embedded a complex HTML5-canvas abstraction wrapper layer inside the client app directory to track canvas modifications as concrete stateful objects rather than raw visual bitmaps.
* **Infinite Workspace Viewport Matrix (Panning Layer):** Engineered a 2D Transformation Matrix ($VPT$) mapping pipeline using `mouse:down`, `mouse:move`, and `mouse:up` triggers. By manipulating matrix parameters `vpt[4]` (X-offset translation) and `vpt[5]` (Y-offset translation), users can pan anywhere across an infinite whiteboard workspace plane via grabbing mechanics or `Alt + Click` shortcuts.
* **Exponential Centered Zoom Mechanics:** Formulated a smooth magnifying wheel engine using an exponential scale variable calculation factor (`0.999 ** delta`). Integrated the target coordinate vector point rule (`zoomToPoint({x, y}, zoom)`), focusing the scale center directly on the user's cursor tip location to eliminate visual clipping errors.
* **Vector Object Lifecycle Generation & Modifiers:** Created structural helper methods to stamp real-time premium vector shapes onto coordinate arrays (Rounded Rectangles with smooth `rx/ry` corner rounding adjustments, and Circle configurations) with default object bounding selector controls.
* **Adaptive Boundary Resize Observer:** Wired a window resize hook mechanism utilizing event-driven `.setDimensions` updates, causing the workspace frame parameters to scale dynamically according to client window mutations.

---

## 🛠️ Unified System Technology Stack

* **Frontend Engine:** React.js, Vite, Fabric.js (Vector Graphics Vector Core), Axios
* **Backend Runtime:** Node.js, Express.js (Native ES Modules Compilation System)
* **Database Cluster:** MongoDB, Mongoose ODM
* **DevOps Pipelines:** Docker, Docker Compose Structural Container Networks

---

## 🚦 Local Installation & Service Upstream Manual

To spin up your local sandbox multi-container environment, execute the clean pipeline orchestration commands from the root project directory:

```bash
# Terminate active runtime artifacts and clear cache structures
docker compose down

# Spin up all microservices and automatically assemble fresh package changes
docker compose up --build

# Verify all cluster instances (Frontend, Backend, DB) are successfully running
docker ps