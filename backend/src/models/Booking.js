const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    pnr: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bookingDate: {
        type: DataTypes.DATEONLY, // The date of journey
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('confirmed', 'cancelled'),
        defaultValue: 'confirmed'
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    }
});

module.exports = Booking;
