import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'x-api-key': import.meta.env.VITE_INTERNAL_API_KEY,
  },
});
