const connection = require("../db-config");
const Joi = require('joi');

const db = connection.promise();

const count = () =>
    db.query('SELECT count(*) as count FROM products')
    .then(([results]) => results[0]);

const validate = ({
    Name,
    Price,
    SKU,
    Characteristic,
    Description,
    Ingredients_details
}) => {
    return Joi.object({
        Name: Joi.string().max(250).required(),
        Price: Joi.number().max(999).required(),
        SKU: Joi.string().max(13).uppercase().required(),
        Characteristic: Joi.string().required(),
        Description: Joi.string().required(),
        Ingredients_details: Joi.string().required(),
    }).validate({
        Name,
        Price,
        SKU,
        Characteristic,
        Description,
        Ingredients_details
    }, {
        abortEarly: false
    })
};

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

const create = ({
    Name,
    Price,
    SKU,
    Characteristic,
    Description,
    Ingredients_details
}) => {
    return db
        .query("INSERT INTO products (name, price, sku, characteristic, description, ingredients_details) VALUES (?, ?, ?, ?, ?, ?)", [name, price, sku, characteristic, description, ingredients_details])
        .then(([results]) => {
            const id = results.insertId;
            return {
                id,
                name,
                price,
                sku,
                characteristic,
                description,
                ingredients_details
            };
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
    count,
    findMany,
    findOne,
    create,
    update,
    destroy,
    validate
};