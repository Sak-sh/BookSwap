// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://bookswap-mi28.onrender.com"); // Or Vercel/backend URL if deployed

export default socket;
