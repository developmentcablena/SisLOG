import axios from 'axios';

const api = axios.create({ baseURL: 'http://192.168.0.249:5401' });

export default api;