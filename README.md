# Real-Time Sync App with Redis & Socket.IO

A real-time checkbox board where multiple users can toggle checkboxes, and the state is instantly synced across all connected clients. 
Built with 
- 🟩 **Node.js**
- 🌐 **Socket.IO**
- 🟥 **Redis**
This app demonstrates advanced backend practices for scaling real-time synchronization.

## 🚀 Advanced Backend Practices to Scale Sync in Real-Time Applications

In real-time applications—especially those involving collaborative interfaces or live dashboards—scaling synchronization across multiple clients becomes increasingly challenging. As the user base grows, maintaining consistent state, low latency, and high availability requires more than just basic socket implementations.

## ✅ Key Topics Covered

- 📡 **Efficient Redis Pub/Sub** for broadcasting state changes across distributed socket servers
- 🧱 **State normalization** using Redis key-value structures to reduce payload size
- 🚀 **Redis caching** with TTL to optimize API performance
- 🔐 **Stateless socket authentication** for scalable, secure client connections
- 🧭 **Horizontal scaling** of Socket.IO using adapters like `socket.io-redis`

## ⚙️ Use Case Example

Imagine a shared board with **1000 checkboxes** 🟩:
- 🔁 State updates are stored & fetched from Redis
- 🔄 Changes broadcasted instantly to **all clients**
- 🧠 Data consistency is maintained across distributed servers

This architecture ensures:
- 📌 All users are **in sync**
- 📈 Server instances can scale horizontally
- ⚡ Minimal latency, even with heavy load

## 🛠️ Tech Stack

| Tool             | Role                                     |
|------------------|------------------------------------------|
| 🟩 Node.js        | Backend runtime environment              |
| 🚀 Express        | Server & routing                         |
| 🌐 Socket.IO      | Real-time bi-directional communication   |
| 🟥 Redis          | In-memory store for Pub/Sub & caching    |

## 🧪 Run Locally

### 🔁 Clone the repository
```bash
git clone https://github.com/malhotraarshdeepsingh/RedioSync
cd RedioSync
```

### 📦 Install Dependencies
```bash
npm install
```

### 🐳 Run Redis
```bash
docker compose up
```
> ⚠️ **Note:** Make sure your **Docker** is up and running before executing this command.

### ▶️ Start the app 
```bash
npm run dev
```
### ➕ To start another instance

🪟 For Windows PowerShell
```bash 
$env:PORT=8080; npm run dev
```

💻 On macOS/Linux
```bash
PORT=8080 && npm run dev
```
