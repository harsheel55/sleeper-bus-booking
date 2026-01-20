const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingSeat = sequelize.define('BookingSeat', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fromStationId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    toStationId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    passengerName: {
        type: DataTypes.STRING
    },
    passengerAge: {
        type: DataTypes.INTEGER
    },
    passengerGender: {
        type: DataTypes.ENUM('male', 'female', 'other')
    }
});

module.exports = BookingSeat;
