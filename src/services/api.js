import axios from 'axios';
const cors = require('cors');

const api = axios.create({
    baseURL: 'https://backend-cizt-lax5.onrender.com/api'
});

const token = localStorage.getItem('token');

if(token){
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

const allowedOrigins = ['https://frontend2-nine-rho.vercel.app'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

export default api;
