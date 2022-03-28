const connection = require("../db-config");
const Joi = require('joi');

const db = connection.promise();

const validate = ({Name,
    Price,
    SKU,
    Characteristic,
    Description,
    Ingredients}) => { return Joi.object({
    Name: Joi.string().max(250).required(),
    Price: Joi.number().max(999).required(),
    SKU: Joi.string().max(13).uppercase().required(),
    Characteristic: Joi.string().required(),
    Description: Joi.string().required(),
    Ingredients: Joi.string().required(),
}).validate({
    Name,
    Price,
    SKU,
    Characteristic,
    Description,
    Ingredients
}, {
    abortEarly: false
})};

const findMany = () => {
    return db
        .query('SELECT * FROM products')
        .then(([results]) => results);
}

const findOne = (id) => {
    return db
        .query('SELECT * FROM products WHERE productid = ?', [id])
        .then(([results]) => results[0]);
};

const create = ({
    ProductID,
    Name,
    Price,
    SKU,
    Characteristic,
    Description,
    Ingredients
}) => {
    return db
        .query("INSERT INTO products (ProductID, Name, Price, SKU, Characteristic , Description, Ingredients) VALUES (?, ?, ?, ?, ?, ?, ?)", [ProductID, Name, Price, SKU, Characteristic, Description, Ingredient])
        .then(([results]) => {
            const id = results.insertID;
            return {
                id,
                ProductID,
                Name,
                Price,
                SKU,
                Characteristic,
                Description,
                Ingredients
            };
        });
};

const update = (id, newAttributes) => {
    validationErrors = Joi.object({
        ProductID: Joi.number().required(),
        Name: Joi.string().max(250).required(),
        Price: Joi.number().max(1000).required(),
        SKU: Joi.string().max(13).required(),
        Characteristic: Joi.string().required(),
        Description: Joi.string().required(),
        Ingredient: Joi.string().required(),
    }).validate({
        ProductID,
        Name,
        Price,
        SKU,
        Characteristic,
        Description,
        Ingredient
    }, {
        abortEarly: false
    }).error;
    if (validationErrors) return Promise.reject('INVALID_DATA');
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
    destroy,
    validate
};