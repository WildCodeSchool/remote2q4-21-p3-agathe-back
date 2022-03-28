const connection = require("../db-config");
// const Joi = require('joi');

const db = connection.promise();

const findMany = () => {
    return db
        .query('SELECT o.OrderId, concat(p.sku, "-", p.name) as product,\
         concat(u.firstname," ", u.lastname) as name, l.quantity, l.price * l.quantity as amount,\
         s.statusdate as OrderDate\
        FROM orders o\
        JOIN orderline l on l.orderid=o.orderid\
        JOIN products p on p.productid=l.productid\
        JOIN users u on u.id=o.userid \
        JOIN orderstatus s on s.orderid=o.orderid and s.stateid=1')
        .then(([results]) => results);
}

// const findOne = (id) => {
//     return db
//         .query('SELECT * FROM ingredients WHERE ingredientID = ?', [id])
//         .then(([results]) => results[0]);
// };

// const create = ({ ProductID, Name, Description }) => {
//     return db
//         .query("INSERT INTO ingredients (ProductID, Name, Description) VALUES (?, ?, ?)", [ProductID, Name, Description])
//         .then(([results]) => {
//             const id = results.insertID;
//             return { id, ProductID, Name, Description };
//         });
// };

// const update = (id, newAttributes) => {
//     return db.query('UPDATE ingredients SET ? WHERE id = ?', [newAttributes, id]);
// };

// const destroy = (id) => {
//     return db
//         .query('DELETE FROM ingredients WHERE id = ?', [id])
//         .then(([result]) => result.affectedRows !== 0);
// };
/*

SELECT o.OrderId, concat(p.sku,"-", p.name) as product, concat(u.firstname," ", u.lastname) as name, o.totalamount
        from orders o
        join orderline l on l.orderid=o.orderid
        join products p on p.productid=l.productid
        join users u on u.id=o.userid

*/
module.exports = {
    findMany,
    // findOne,
    // create,
    // update,
    // destroy
};