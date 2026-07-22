import { io } from "socket.io-client";

const token = localStorage.getItem("token") || sessionStorage.getItem("token");
export const socket = io("http://localhost:5001", {
  autoConnect: true,
  auth: { token },
});
