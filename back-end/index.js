const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://cryptomern-3.onrender.com/", "https://frontend-pied-nu-71.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

app.use(express.static("public"));
app.use(cors()); // Apply CORS globally

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Use setInterval to call a function every 1ms
  const interval = setInterval(async () => {
    try {
      const response = await axios.get("https://api.kucoin.com/api/v1/market/allTickers");
      io.emit("crypto", response.data); // Broadcast to all clients
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  }, 1); // 1ms interval

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    clearInterval(interval); // Stop the interval when the client disconnects
  });
});

server.listen(8080, () => {
  console.log("Server is running at port 8080");
});