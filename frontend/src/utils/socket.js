// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://bookswap-mi28.onrender.com", {
  transports: ['websocket'],  
  secure: true,               
  withCredentials: true       
});
export default socket;
