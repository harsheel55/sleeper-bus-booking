const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meal = sequelize.define('Meal', {
    id: {
        type: DataTypes.STRING, // M001
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('veg', 'non-veg', 'jain'),
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING // url or placeholder
    }
});

module.exports = Meal;
