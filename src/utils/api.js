import axios from 'axios';

const API = axios.create({
    baseURL: 'https://dev-blogs-mu.vercel.app/' // Aapka backend base URL
});

// Automatically har request ke sath JWT token attach karne ke liye interceptor
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;