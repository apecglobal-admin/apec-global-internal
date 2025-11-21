// src/services/api.js
import axios from 'axios';

const apiAxiosInstance= axios.create({
  baseURL: 'https://apec-global-backend.vercel.app/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiAxiosInstance;


//https://apec-global-backend.vercel.app/
//https://apec-global-backend.onrender.com
//http://192.168.1.71:5000 máy a Long