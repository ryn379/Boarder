import { io } from "socket.io-client";

const socket = io("http://localhost:8008", {
  withCredentials: true,
});

export default socket;
