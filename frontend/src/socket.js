import { io } from "socket.io-client";

export const socket = io("https://websocket-kanban-board-5z77.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
});
