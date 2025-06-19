// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Or Vercel/backend URL if deployed

export default socket;
