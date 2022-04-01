const connection = require("../db-config");

const db = connection.promise();

const ingredientsForProduct = (productID) => {
    return db
        .query('SELECT * FROM ingredients WHERE productID = ?', [productID])
        .then(([results]) => results);
}

const findOne = (id) => {
    return db
        .query('SELECT * FROM ingredients WHERE ingredientID = ?', [id])
        .then(([results]) => results[0]);
};

const create = (ProductID, Name, Description) => {
    return db
        .query("INSERT INTO ingredients (ProductID, Name, Description) VALUES (?, ?, ?)", [ProductID, Name, Description])
        .then(([results]) => {
            const id = results.insertID;
            return { id, ProductID, Name, Description };
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