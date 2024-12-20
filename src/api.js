import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.190.96.197:5000/api ',  // http://172.190.96.197:5000/api  // http://127.0.0.1:5000/api
});

export default api;
