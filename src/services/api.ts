import axios from 'axios';

const baseURL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
});
