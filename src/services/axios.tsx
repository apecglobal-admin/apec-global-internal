// src/services/api.js
import axios from 'axios';

const apiAxiosInstance= axios.create({
  baseURL: 'http://192.168.1.71:5000/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiAxiosInstance;

//https://apec-global-backend.onrender.com
//http://192.168.1.71:5000/api/v1 máy a Long