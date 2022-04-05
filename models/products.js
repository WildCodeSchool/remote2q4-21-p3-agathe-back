const connection = require("../db-config");
const Joi = require('joi');

const db = connection.promise();

const count = () =>
    db.query('SELECT count(*) as count FROM products')
    .then(([results]) => results[0]);

const validate = ({
    name,
    price,
    sku,
    characteristic,
    description,
    ingredients_details,
    picture
}) => {
    return Joi.object({
        name: Joi.string().max(250).required(),
        price: Joi.number().max(999).required(),
        sku: Joi.string().max(13).uppercase().required(),
        characteristic: Joi.string().required(),
        description: Joi.string().required(),
        ingredients_details: Joi.string().required(),
        picture: Joi.string(),
    }).validate({
        name,
        price,
        sku,
        characteristic,
        description,
        ingredients_details,
        picture,
    }, {
        abortEarly: false
    })
};

const findMany = () => {
    return db
        .query('SELECT * FROM products where active is true')
        .then(([results]) => results);
}

const findOne = (id) =>
    db
    .query('SELECT * FROM products WHERE id = ?', [id])
    .then(([results]) => results[0]);

const create = ({
    name,
    price,
    sku,
    characteristic,
    description,
    ingredients_details,
    picture
}) => {
    return db
        .query("INSERT INTO products (name, price, sku, characteristic, description, ingredients_details, picture) VALUES (?, ?, ?, ?, ?, ?, ?)", [name, price, sku, characteristic, description, ingredients_details, picture])
        .then(([results]) => {
            const id = results.insertId;
            return {
                id,
                name,
                price,
                sku,
                characteristic,
                description,
                ingredients_details,
                picture,
            };
        });
};

const update = (id, newAttributes) =>
    db.query('UPDATE products SET ? WHERE id = ?', [newAttributes, id]);

const destroy = (id) =>
    db
    .query('DELETE FROM products WHERE id = ?', [id])
    .then(([result]) => result.affectedRows !== 0);

module.exports = {
    count,
    findMany,
    findOne,
    create,
    update,
    destroy,
    validate
};