const connection = require("../db-config");
// const Joi = require('joi');

const db = connection.promise();

// const findMany = () => {
//     return db
//         .query('SELECT o.OrderId, concat(p.sku, "-", p.name) as product,\
//          concat(u.firstname," ", u.lastname) as name, l.quantity, l.price * l.quantity as amount,\
//          s.statusdate as OrderDate\
//         FROM orders o\
//         JOIN orderline l on l.orderid=o.orderid\
//         JOIN products p on p.productid=l.productid\
//         JOIN users u on u.id=o.userid \
//         JOIN orderstatus s on s.orderid=o.orderid and s.stateid=1')
//         .then(([results]) => results);
// }

// const findOne = (id) => {
//     return db
//         .query('SELECT * FROM ingredients WHERE ingredientID = ?', [id])
//         .then(([results]) => results[0]);
// };

const create = ({ OrderID, StateID, StatusDate }) => {
    // console.log(`OrderStatus.create(${OrderID}, ${StateID}, ${StatusDate})`)
    return db
        .query("INSERT INTO OrderStatus(OrderId, StateID, StatusDate) VALUES (?, ?, ?)", [OrderID, StateID, StatusDate])
        .then(([results]) => {
            const OrderStatusID = results.insertID;
            return { OrderStatusID, OrderID, StateID, StatusDate };
        });
}

// const update = (id, newAttributes) => {
//     return db.query('UPDATE orders SET ? WHERE OrderID = ?', [newAttributes, id]);
// };

// const destroy = (id) => {
//     return db
//         .query('DELETE FROM ingredients WHERE id = ?', [id])
//         .then(([result]) => result.affectedRows !== 0);
// };

module.exports = {
    create,
    // findOne,
    // update,
    // destroy
};