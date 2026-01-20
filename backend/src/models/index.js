const sequelize = require('../config/database');
const Station = require('./Station');
const Seat = require('./Seat');
const Booking = require('./Booking');
const BookingSeat = require('./BookingSeat');
const Meal = require('./Meal');
const BookingMeal = require('./BookingMeal');

// Relations
Booking.hasMany(BookingSeat, { foreignKey: 'bookingId' });
BookingSeat.belongsTo(Booking, { foreignKey: 'bookingId' });

BookingSeat.belongsTo(Seat, { foreignKey: 'seatNumber', targetKey: 'seatNumber' });
Seat.hasMany(BookingSeat, { foreignKey: 'seatNumber' });

Booking.hasMany(BookingMeal, { foreignKey: 'bookingId' });
BookingMeal.belongsTo(Booking, { foreignKey: 'bookingId' });

BookingMeal.belongsTo(Meal, { foreignKey: 'mealId' });

module.exports = {
    sequelize,
    Station,
    Seat,
    Booking,
    BookingSeat,
    Meal,
    BookingMeal
};
