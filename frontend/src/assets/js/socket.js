import { reactive, readonly } from 'vue';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Thay thế bằng URL của WebSocket server

const state = reactive({
  isConnected: false,
  message: '',
});

socket.on('connect', () => {
  state.isConnected = true;
});

socket.on('disconnect', () => {
  state.isConnected = false;
});

socket.on('message', (data) => {
  state.message = data;
});

export const useSocket = () => {
    const sendMessage = (message) => {
      socket.emit('send-message', message);
    };
  
    return {
      isConnected: readonly(state.isConnected),
      message: readonly(state.message),
      sendMessage,
    };
  };
