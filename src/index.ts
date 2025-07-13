// import necessary modules
import express from "express";
import axios from "axios";
import Redis from "ioredis";
import http from "http";
import { Server, Socket } from "socket.io";

// neccessary variables
const app = express();
const PORT = process.env.PORT || 8000;

// freeapi endpoint
const API_URL = "https://api.freeapi.app/api/v1/public/books";

// initialize Redis client
const redis = new Redis({
  host: "localhost",
  port: Number(6379), // Default Redis port
});

const publisher = new Redis({
  host: "localhost",
  port: Number(6379), // Default Redis port
});
const subscriber = new Redis({
  host: "localhost",
  port: Number(6379), // Default Redis port
});

// initialize state
redis.setnx("state", JSON.stringify(new Array(1000).fill(false)));

// static file serving
app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server);

subscriber.subscribe("server:broker", (err) => {
  if (err) {
    console.error("Failed to subscribe to channel:", err);
  } else {
    console.log("Subscribed to channel: server:broker");
  }
});

subscriber.on("message", (channel, message) => {
  const { event, data } = JSON.parse(message);
  io.emit(event, data);
});

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  //   socket.on("message", (msg: string) => {
  //     console.log("Message received:", msg);
  //     // Broadcast the message to all connected clients
  //     io.emit("broadcast_message", msg);
  //   });

  socket.on("checkbox_change", async (data) => {
    const state = await redis.get("state");
    if (state) {
      const parseState = JSON.parse(state);
      parseState[data.index] = data.value; // Update the state array
      await redis.set("state", JSON.stringify(parseState)); // Store the updated state in Redis
    }

    await publisher.publish(
      "server:broker",
      JSON.stringify({ event: "checkbox_change", data })
    );
    // Broadcast the checkbox change event to all connected clients
    // const { index, value } = data;
    // state[index] = value; // Update the state array
    // io.emit("checkbox_change", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

// endpoint to fetch books from the API
app.get("/books", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// endpoint to get the total number of books with caching
app.get("/books/total", async (req, res) => {
  const cachedData = await redis.get("books_total");

  if (!cachedData) {
    try {
      const response = await axios.get(API_URL);

      if (!response.data) {
        return res.status(500).json({ error: "data not recieved" });
      }

      const totalBooks = response.data.data.data.length;

      // Store the total number of books in Redis with an expiration time
      await redis.set("books_total", totalBooks, "EX", 3600); // Cache for 1 hour

      res.json({ totalBooks });
    } catch (error) {
      console.error("Error fetching books:", error);

      res.status(500).json({ error: "Failed to fetch books" });
    }
  } else {
    res.json({ totalBooks: Number(cachedData) });
  }
});

// endpoint to get state
app.get("/state", async (req, res) => {
  const state = await redis.get("state");

  if (state) {
    const parseState = JSON.parse(state);
    return res.json({ state: parseState });
  }

  res.json({ state: [] });
});

// start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
