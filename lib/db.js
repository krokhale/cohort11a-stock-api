const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('mysql://root:password@localhost/cohort11a-stock-api', {logging: false});
module.exports = {sequelize};
