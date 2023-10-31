// socket.js
import { io } from 'socket.io-client';

export const initSocket = (url) => {
  const socket = io(url);

  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      console.log('Socket connected');
      resolve(socket);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      reject(error);
    });
  });
};
