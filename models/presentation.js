const connection = require("../db-config");
const Joi = require('joi');

const db = connection.promise();

const findOne = () => {
  return db
    .query('SELECT * FROM presentation')
    .then(([results]) => results[0]);
};

const update = (textPresentation) => {
  return db.query('UPDATE presentation SET ?', [textPresentation]);
}

module.exports = {
  findOne,
  update,
};