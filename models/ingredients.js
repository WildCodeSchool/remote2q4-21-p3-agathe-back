const connection = require("../db-config");

const db = connection.promise();

const ingredientsForProduct = (product_id) => {
    return db
        .query('SELECT * FROM ingredients WHERE product_id = ?', [product_id])
        .then(([results]) => results);
}

const findOne = (id) => {
    return db
        .query('SELECT * FROM ingredients WHERE id = ?', [id])
        .then(([results]) => results[0]);
};

const create = (product_id, name, description) => {
    return db
        .query("INSERT INTO ingredients(product_id, name, description) VALUES (?, ?, ?)", [product_id, name, description])
        .then(([results]) => {
            const id = results.insertID;
            return { id, product_id, name, description };
        });
};

const update = (id, newAttributes) => {
    return db.query('UPDATE ingredients SET ? WHERE id = ?', [newAttributes, id]);
};

const destroy = (id) => {
    return db
        .query('DELETE FROM ingredients WHERE id = ?', [id])
        .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
    ingredientsForProduct,
    findOne,
    create,
    update,
    destroy
};