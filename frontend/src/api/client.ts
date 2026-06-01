import axios from 'axios';

// Create an Axios instance
// This points to the backend running locally. When deploying, we can replace this with an env variable.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});
