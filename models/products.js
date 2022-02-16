const connection = require("../db-config");
const Joi = require('joi');

const db = connection.promise();

const findMany = () => {
    return db
    .query('SELECT * FROM products')
    .then(([results]) => results);
}

const findOne = (id) => {
  return db
  .query('SELECT * FROM products WHERE id = ?', [id])
  .then(([results]) => results[0]);
};

const create = ({ProductID, Name, Price, SKU, Characteristic , Description, Ingredient}) => {
  return db
  .query("INSERT INTO products (ProductID, Name, Price, SKU, Characteristic , Description, Ingredient) VALUES (?, ?, ?, ?, ?, ?, ?)", [ProductID, Name, Price, SKU, Characteristic , Description, Ingredient])
  .then(([results]) => {
    const id = result.insertID;
    return { ProductID, Name, Price, SKU, Characteristic , Description, Ingredient };
  });
};

const update = (id, newAttributes) => {
  return db.query('UPDATE products SET ? WHERE id = ?', [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query('DELETE FROM products WHERE id = ?', [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findMany,
  findOne,
  create,
  update,
  destroy
};