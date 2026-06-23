import { io } from 'socket.io-client';

// Docker Compose ke environment variable se URL uthayenge, 
// aur fallback ke taur par local map port 5001 rakhenge.
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

// Real-time infrastructure testing triggers
socket.on('connect', () => {
  console.log(`📡 MERN Signaling Connection Established. Socket ID: ${socket.id}`);
});

socket.on('connect_error', (error) => {
  console.error('❌ MERN Socket Tunnel Handshake Failed:', error);
});