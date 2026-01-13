import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-cizt-lax5.onrender.com/api'
});

const token = localStorage.getItem('token');

if(token){
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export default api;
