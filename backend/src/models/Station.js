const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Station = sequelize.define('Station', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    distanceFromSource: {
        type: DataTypes.INTEGER, // in km
        allowNull: false
    },
    arrivalTime: {
        type: DataTypes.STRING, // HH:mm
        allowNull: true
    },
    departureTime: {
        type: DataTypes.STRING, // HH:mm
        allowNull: true
    }
});

module.exports = Station;
