import { io } from "socket.io-client";

const backendURL = import.meta.env.VITE_BACKEND_URL || 
                   import.meta.env.PROD 
                   ? "https://websocket-kanban-board-5z77.onrender.com" 
                   : "http://localhost:5000";

console.log("BACKEND URL:", backendURL);
console.log("ENV VALUE:", import.meta.env.VITE_BACKEND_URL);
console.log("IS PROD:", import.meta.env.PROD);

export const socket = io(backendURL, {
  transports: ["websocket"],
  autoConnect: true,
});