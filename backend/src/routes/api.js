const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');
const seatController = require('../controllers/seatController');
const bookingController = require('../controllers/bookingController');
const mealController = require('../controllers/mealController');
const { validateBody, bookingSchema } = require('../utils/schemas');

// Station Routes
router.get('/stations', stationController.getStations);

// Seat Routes
router.get('/seats', seatController.getSeats);

// Meal Routes
router.get('/meals', mealController.getMeals);

// Booking Routes
router.post('/bookings', validateBody(bookingSchema), bookingController.createBooking);
router.get('/bookings/:id', bookingController.getBooking);
router.delete('/bookings/:id', bookingController.cancelBooking);

// ML Proxy Route
router.post('/predict', async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error(`ML Service responded with ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("ML Service Error:", err.message);
        res.status(503).json({
            error: "ML Service Unavailable",
            details: err.message,
            mockPrediction: { confirmation_probability: 85.5, note: "Mock fallback" }
        });
    }
});

module.exports = router;
