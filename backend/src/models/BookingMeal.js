const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingMeal = sequelize.define('BookingMeal', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    mealId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    deliveryStationId: {
        type: DataTypes.STRING, // Where to deliver
        allowNull: false
    }
});

module.exports = BookingMeal;
