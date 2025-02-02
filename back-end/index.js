const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const nodeCron = require("node-cron");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Change this to your frontend domain for production
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));
app.use(cors()); // Apply CORS globally

let task = null; // Global cron job
let clientsConnected = 0; // Track active connections

io.on("connection", (socket) => {
  console.log("Client connected");
  clientsConnected++;

  // Start cron job only if it's not already running
  if (!task) {
    task = nodeCron.schedule("* * * * * *", async () => {
      try {
        const response = await axios.get(
          "https://api.kucoin.com/api/v1/market/allTickers"
        );
        console.log("Crypto Data Sent", response.data);
        io.emit("crypto", response.data); // Emit to all connected clients
      } catch (error) {
        console.error("Error fetching crypto data:", error.message);
      }
    });

    console.log("Cron job started");
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clientsConnected--;

    // Stop the cron job if no clients are connected
    if (clientsConnected === 0 && task) {
      task.stop();
      task = null;
      console.log("Cron job stopped");
    }
  });
});

server.listen(8080, () => {
  console.log("Server is running at port 8080");
});
