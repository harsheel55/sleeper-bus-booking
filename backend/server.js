// server.js - Main Express Server
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory database (replace with MongoDB/PostgreSQL in production)
const database = {
  bus: {
    id: 'BUS001',
    name: 'Sleeper Express',
    route: 'Ahmedabad → Mumbai',
    totalSeats: 40,
    layout: 'sleeper', // 2x1 configuration
  },
  stations: [
    { id: 'ST001', name: 'Ahmedabad', arrivalTime: null, departureTime: '22:00', distance: 0 },
    { id: 'ST002', name: 'Vadodara', arrivalTime: '00:30', departureTime: '00:45', distance: 110 },
    { id: 'ST003', name: 'Surat', arrivalTime: '03:00', departureTime: '03:15', distance: 260 },
    { id: 'ST004', name: 'Mumbai', arrivalTime: '07:00', departureTime: null, distance: 530 }
  ],
  seats: generateSeats(40),
  bookings: [],
  meals: [
    { id: 'M001', name: 'Veg Thali', type: 'veg', price: 150, description: 'Dal, Roti, Rice, Sabzi' },
    { id: 'M002', name: 'Paneer Combo', type: 'veg', price: 180, description: 'Paneer Curry, Roti, Rice' },
    { id: 'M003', name: 'Chicken Biryani', type: 'non-veg', price: 220, description: 'Hyderabadi style with raita' },
    { id: 'M004', name: 'Jain Thali', type: 'jain', price: 160, description: 'No onion, no garlic' }
  ]
};

// Helper function to generate seats
function generateSeats(count) {
  const seats = [];
  const types = ['lower', 'upper', 'lower'];
  
  for (let i = 1; i <= count; i++) {
    seats.push({
      id: `S${String(i).padStart(3, '0')}`,
      number: i,
      type: types[(i - 1) % 3],
      isBooked: false,
      bookedSegments: [] // Array of {from, to} station pairs
    });
  }
  return seats;
}

// Helper function to check seat availability for route
function isSeatAvailable(seat, fromStation, toStation) {
  if (!seat.isBooked) return true;
  
  // Check if requested route overlaps with any booked segment
  const fromIndex = database.stations.findIndex(s => s.id === fromStation);
  const toIndex = database.stations.findIndex(s => s.id === toStation);
  
  for (const segment of seat.bookedSegments) {
    const segFromIndex = database.stations.findIndex(s => s.id === segment.from);
    const segToIndex = database.stations.findIndex(s => s.id === segment.to);
    
    // Check for overlap
    if (!(toIndex <= segFromIndex || fromIndex >= segToIndex)) {
      return false; // Overlapping segment found
    }
  }
  return true;
}

// Calculate fare based on distance
function calculateFare(fromStation, toStation) {
  const from = database.stations.find(s => s.id === fromStation);
  const to = database.stations.find(s => s.id === toStation);
  
  if (!from || !to) return 0;
  
  const distance = Math.abs(to.distance - from.distance);
  const baseRate = 0.8; // Rs 0.8 per km
  return Math.round(distance * baseRate);
}

// ==================== API ENDPOINTS ====================

// 1. Get all stations
app.get('/api/stations', (req, res) => {
  res.json({
    success: true,
    data: database.stations
  });
});

// 2. Get available seats for a route
app.get('/api/seats', (req, res) => {
  const { from, to, date } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: 'From and To stations are required'
    });
  }
  
  const availableSeats = database.seats.map(seat => ({
    ...seat,
    available: isSeatAvailable(seat, from, to),
    fare: calculateFare(from, to)
  }));
  
  res.json({
    success: true,
    data: {
      bus: database.bus,
      seats: availableSeats,
      route: {
        from: database.stations.find(s => s.id === from),
        to: database.stations.find(s => s.id === to)
      }
    }
  });
});

// 3. Get meal options
app.get('/api/meals', (req, res) => {
  res.json({
    success: true,
    data: database.meals
  });
});

// 4. Create booking
app.post('/api/bookings', (req, res) => {
  const { seatIds, fromStation, toStation, passenger, meals } = req.body;
  
  // Validation
  if (!seatIds || !fromStation || !toStation || !passenger) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  // Check seat availability
  const unavailableSeats = [];
  for (const seatId of seatIds) {
    const seat = database.seats.find(s => s.id === seatId);
    if (!seat || !isSeatAvailable(seat, fromStation, toStation)) {
      unavailableSeats.push(seatId);
    }
  }
  
  if (unavailableSeats.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Some seats are not available',
      unavailableSeats
    });
  }
  
  // Create booking
  const bookingId = `BK${Date.now()}`;
  const baseFare = calculateFare(fromStation, toStation);
  const seatCharges = baseFare * seatIds.length;
  
  let mealCharges = 0;
  const mealDetails = [];
  if (meals && meals.length > 0) {
    meals.forEach(mealOrder => {
      const meal = database.meals.find(m => m.id === mealOrder.mealId);
      if (meal) {
        const itemTotal = meal.price * mealOrder.quantity;
        mealCharges += itemTotal;
        mealDetails.push({
          ...meal,
          quantity: mealOrder.quantity,
          deliveryStation: mealOrder.deliveryStation,
          total: itemTotal
        });
      }
    });
  }
  
  const booking = {
    id: bookingId,
    seatIds,
    fromStation,
    toStation,
    passenger,
    meals: mealDetails,
    fare: {
      seatCharges,
      mealCharges,
      total: seatCharges + mealCharges
    },
    status: 'confirmed',
    bookingTime: new Date().toISOString(),
    pnr: `PNR${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };
  
  // Update seat status
  seatIds.forEach(seatId => {
    const seat = database.seats.find(s => s.id === seatId);
    if (seat) {
      seat.isBooked = true;
      seat.bookedSegments.push({
        from: fromStation,
        to: toStation,
        bookingId
      });
    }
  });
  
  database.bookings.push(booking);
  
  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully',
    data: booking
  });
});

// 5. Get booking details
app.get('/api/bookings/:bookingId', (req, res) => {
  const booking = database.bookings.find(b => b.id === req.params.bookingId);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  res.json({
    success: true,
    data: booking
  });
});

// 6. Cancel booking
app.delete('/api/bookings/:bookingId', (req, res) => {
  const bookingIndex = database.bookings.findIndex(b => b.id === req.params.bookingId);
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  const booking = database.bookings[bookingIndex];
  
  // Release seats
  booking.seatIds.forEach(seatId => {
    const seat = database.seats.find(s => s.id === seatId);
    if (seat) {
      seat.bookedSegments = seat.bookedSegments.filter(
        seg => seg.bookingId !== booking.id
      );
      if (seat.bookedSegments.length === 0) {
        seat.isBooked = false;
      }
    }
  });
  
  // Update booking status
  booking.status = 'cancelled';
  
  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking
  });
});

// 7. Add meal to existing booking
app.post('/api/bookings/:bookingId/meals', (req, res) => {
  const booking = database.bookings.find(b => b.id === req.params.bookingId);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  const { mealId, quantity, deliveryStation } = req.body;
  const meal = database.meals.find(m => m.id === mealId);
  
  if (!meal) {
    return res.status(404).json({
      success: false,
      message: 'Meal not found'
    });
  }
  
  const mealItem = {
    ...meal,
    quantity,
    deliveryStation,
    total: meal.price * quantity
  };
  
  booking.meals.push(mealItem);
  booking.fare.mealCharges += mealItem.total;
  booking.fare.total = booking.fare.seatCharges + booking.fare.mealCharges;
  
  res.json({
    success: true,
    message: 'Meal added successfully',
    data: booking
  });
});

// 8. Get booking statistics (for ML prediction)
app.get('/api/statistics', (req, res) => {
  const totalBookings = database.bookings.length;
  const confirmedBookings = database.bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = database.bookings.filter(b => b.status === 'cancelled').length;
  
  res.json({
    success: true,
    data: {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      confirmationRate: totalBookings > 0 ? (confirmedBookings / totalBookings * 100).toFixed(2) : 0,
      occupancyRate: ((database.seats.filter(s => s.isBooked).length / database.seats.length) * 100).toFixed(2)
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚌 Sleeper Bus Booking API running on port ${PORT}`);
});