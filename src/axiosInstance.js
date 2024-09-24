import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : 'https://restate-json.onrender.com/',
    headers: {'Content-Type': 'application/json'}
});

export default axiosInstance;