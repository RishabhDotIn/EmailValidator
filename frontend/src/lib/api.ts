import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:10000';

export const api = axios.create({ baseURL, withCredentials: true });

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}
