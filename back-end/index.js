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
    origin: ["https://cryptomern-3.onrender.com/","https://frontend-pied-nu-71.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});


app.use(express.static("public"));
app.use(cors()); // Apply CORS globally

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Define a cron job to fetch data every 10 seconds
  const task = nodeCron.schedule("* * * * * *", async () => {
    try {
      const response = await axios.get("https://api.kucoin.com/api/v1/market/allTickers");
      io.emit("crypto", response.data); // Broadcast to all clients
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  });
  
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  

  
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    task.stop(); // Stop the cron job when the client disconnects
  });
});

server.listen(8080, () => {
  console.log("Server is running at port 8080");
});
