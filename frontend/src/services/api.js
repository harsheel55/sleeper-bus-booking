import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Stations
export const getStations = () => api.get('/stations');

// Seats
export const getSeats = (fromStation, toStation) => 
  api.get('/seats', { params: { from_station: fromStation, to_station: toStation } });

// Meals
export const getMeals = () => api.get('/meals');

// Bookings
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getBooking = (bookingId) => api.get(`/bookings/${bookingId}`);
export const cancelBooking = (bookingId) => api.delete(`/bookings/${bookingId}`);

// ML Prediction
export const getPrediction = (predictionData) => api.post('/predict', predictionData);

export default api;
