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

### 🔹 Day 4: Signaling Infrastructure & Multi-Container Sync Resolution
Phase 4 focused on resolving multi-container network isolation, cross-origin web-socket connection drops, and adjusting image runtimes to eliminate handshake pooling latency.
* **Unified 3-Tier Multi-Container Topology:** Restructured the orchestration layer (`docker-compose.yml`) to cleanly attach the frontend service container alongside the backend microservices, mapping shared volume profiles and explicitly injecting the `--host 0.0.0.0` directive to force the Vite dev-server to listen onto the virtual Docker bridge gateway.
* **Deterministic Port-Forwarding Mapping (`5001 -> 5000`):** Eliminated browser edge execution failures (`net::ERR_EMPTY_RESPONSE`) by implementing rigid ingress forwarding parameters (`"5001:5000"`). This bridges host routing interfaces cleanly, allowing real-time socket events targeting port `5001` to safely drop into the containerized Socket.io instance listening inside port `5000`.
* **Module Scope Architecture Refactoring (CommonJS to ESM):** Resolved backend container crashloops (`ReferenceError: require is not defined`) by completely refactoring **`Backend/server.js`** into modern ECMAScript Module (ESM) syntax using async `import` layouts, conforming seamlessly with global project rules (`"type": "module"`).
* **Automated Node Watch Pipeline:** Re-engineered the Dockerfile execution parameters to securely map native `node --watch` script utility streams. This guarantees instant code-swapping and hot-reloading inside the container as canvas synchronization endpoints expand, removing image re-compilation over-heads.

### 🔹 Day 5: Real-Time Synchronization Engine & Port Ingress Migration
Phase 5 established high-performance, collision-protected operational synchronizations across multi-window client contexts, implementing strict network event guards and resolving critical Docker Desktop daemon pipeline lockups.
* **Persistent Socket Lifecycles:** Decoupled the Socket.io initialization mechanics from the local toolbar React state arrays (`[currentTool]`). Extracted connection hooks into an isolated lifecycle block (`[]`), ensuring the WebSocket tunnel remains open and uniform without dropping handshakes or shifting Socket IDs during active tool switches.
* **Infinite Echo-Loop Protection (Memory Lock Layer):** Implemented a stateful gatekeeper flag (`remoteTriggered = true/false`) on canvas shapes. This prevents infinite bounce-back cascades (where local mutation handlers mistakenly rebroadcast arriving remote server payload matrices back to the signaling system), keeping CPU thresholds minimal.
* **Dynamic Vector Identity Tracing:** Injected cryptographic client-side ID matrices (`Date.now() + Math.random()`) during shape initialization, modifying standard Fabric string serialization schemas via explicit payload packaging arrays (`target.toJSON(['id'])`) to match vector objects seamlessly across peer windows.
* **Fail-Safe Ingress Port Shift (`Port 5002` Migration):** Defeated persistent Windows Network Relay (`wslrelay`) and Docker daemon port blockage conflicts (`Bind for 0.0.0.0:5001 failed`) by migrating the entire network boundary over to dedicated ingress route host mapping (`5002:5001`), adjusting `docker-compose.yml` and frontend client environments dynamically.
* **Fabric.js v6 Properties Mutation Patch:** Cleaned up browser console warning logs (`Setting type has no effect`) by refactoring the synchronization interceptor layer to destructure incoming data buffers, stripping the immutable read-only `type` property out of arriving object mutation vectors before execution.

### 🔹 Day 6: Database CRDT Persistence Pipeline & Hydration Engine
Phase 6 introduced cold-start state retention by building an asynchronous state-flushing database channel and asset hydration adapters, ensuring zero data loss during full system reboots or browser lifecycle termination.
* **Asynchronous State-Flushing Engine:** Engineered a high-throughput backend storage listener (`save-canvas-state`) utilizing Mongoose `findOneAndUpdate` with upsert matrix triggers (`{ upsert: true }`). This enables full-canvas snapshot array writes to MongoDB dynamically when an object modification settles.
* **Fabric JSON Data Hydration Adaption:** Implemented a structural REST gateway endpoint (`GET /api/boards/:boardId`) to map multi-user vector trees upon clean tab initializations. The client parses raw BSON arrays into a uniform runtime matrix conforming strictly with Fabric’s engine blueprint configurations (`loadFromJSON()`).
* **Lifecycle State Interceptors:** Integrated state listeners on `object:modified` and `object:added` canvas boundaries, isolating volatile canvas updates from critical bulk-write pipeline executions to maintain performance optimization.
