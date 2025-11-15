import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth', { username, password });
    return response.data;
  },
};

export const bookingAPI = {
  getBookings: async () => {
    const response = await api.get('/booking');
    return response.data;
  },

  getBooking: async (id) => {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/booking', bookingData);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/booking/${id}`, bookingData);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/booking/${id}`);
    return response.data;
  },
};

export const healthAPI = {
  ping: async () => {
    const response = await api.get('/ping');
    return response.data;
  },
};

// Export individual functions for easier imports
export const { getBookings, getBooking, createBooking, updateBooking, deleteBooking } = bookingAPI;
export const { login } = authAPI;
export const { ping } = healthAPI;