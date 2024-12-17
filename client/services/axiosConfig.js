import axios from 'axios';

axios.defaults.baseURL = process.env.PORTA || "http://localhost:3001";
axios.defaults.withCredentials = true;

export default axios;