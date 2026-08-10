import { Server } from "socket.io";

let io;

export default function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket Connected ${socket.id}`);

    socket.on("joinFlight", (flightCode) => {
      socket.join(flightCode);
    });

    socket.on("disconnect", () => {
      console.log(`Socket Disconnected ${socket.id}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket not initalized in socket.js");
  }
  return io;
}
