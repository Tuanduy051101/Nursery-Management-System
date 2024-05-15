import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/styles/tailwind.css';
import './assets/styles/global.css';

import { io } from 'socket.io-client';

const socket = io('ws://localhost:4001', {
  transports: ['websocket'],
});

// default
socket.on('connect', () => {
  console.log('WebSocket connected');
});

// default
socket.on('disconnect', () => {
  console.log('WebSocket disconnected');
});

socket.on('birthdayNotification', (message) => {
  console.log('Thông báo sinh nhật:', message);
  // Thực hiện hiển thị thông báo trong ứng dụng Vue.js
});

const app = createApp(App);

app.config.globalProperties.$socket = socket;

app.use(router).mount('#app');

app.provide('socket', socket);

