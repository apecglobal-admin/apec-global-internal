// src/services/api.js
import axios from 'axios';

const apiAxiosInstance= axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}api/v1`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiAxiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiAxiosInstance;

//https://api.apecglobal.net/
//https://apec-global-backend.vercel.app/
//https://apec-global-backend.onrender.com
//http://192.168.1.71:5000 máy a Long