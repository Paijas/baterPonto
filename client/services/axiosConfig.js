import { API_BASE_URL } from '@env';
import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: API_BASE_URL || "http://10.10.1.38:3001", 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosConfig;