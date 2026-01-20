const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seat = sequelize.define('Seat', {
    seatNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('upper', 'lower'),
        allowNull: false
    },
    isLadies: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Seat;
