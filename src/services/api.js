import axios from 'axios';

const API_URL = 'https://api.example.com'; // Placeholder, will be simulated if needed

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
