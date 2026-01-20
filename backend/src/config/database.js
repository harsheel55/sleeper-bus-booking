const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../sleeper_bus.sqlite'),
  logging: false
});

module.exports = sequelize;
