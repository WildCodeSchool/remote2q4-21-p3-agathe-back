const connection = require("../db-config");
// const Joi = require('joi');

const db = connection.promise();

const total = () =>
    db.query('SELECT SUM(TotalAmount) AS total FROM orders')
    .then(([results]) => results[0]);

const totalOrders = () => 
    db.query('SELECT COUNT(OrderID) AS totalOrders from orders')
    .then(([results]) => results[0]);


const dailySales = () =>
    db.query('SELECT SUM(o.TotalAmount) AS DailySales\
    FROM Orders AS o\
    JOIN orderstatus AS s ON s.orderid=o.orderid and s.stateid=2\
    WHERE s.StatusDate = CURRENT_DATE()');

const yesterdaySales = () =>
    db.query('SELECT SUM(o.TotalAmount) AS YesterdaySales\
    FROM Orders AS o\
    JOIN orderstatus AS s ON s.orderid=o.orderid and s.stateid=2\
    WHERE s.statusdate = subdate(current_date, 1)')
    .then(([results]) => results[0]);

const lastWeekSales = () => 
    db.query('SELECT SUM(o.totalamount) AS lastWeekSales\
    FROM orders AS o\
    JOIN orderstatus AS s ON s.orderid=o.orderid and s.stateid=2\
    JOIN calendar AS oc ON oc.db_date=s.statusdate\
    JOIN calendar AS c ON c.db_date=date_sub(curdate(), interval 1 WEEK)\
    WHERE oc.year=c.year AND oc.week=c.week')
    .then(([results]) => results[0]);

const lastMonthSales =  () => 
    db.query('SELECT SUM(o.totalamount) AS lastMonthSales\
    FROM orders AS o\
    JOIN orderstatus AS s ON s.orderid=o.orderid and s.stateid=2\
    JOIN calendar AS oc ON oc.db_date=s.statusdate\
    JOIN calendar AS c ON c.db_date=date_sub(curdate(), interval 1 month)\
    WHERE oc.year=c.year AND oc.month=c.month')
    .then(([results]) => results[0]);

const findForUser = (user) => {
    return db
        .query('SELECT o.OrderId, concat(p.sku, "-", p.name) as product,\
         concat(u.firstname," ", u.lastname) as name, l.quantity, l.price * l.quantity as amount,\
         s.statusdate as OrderDate\
        FROM orders o\
        JOIN orderline l on l.orderid=o.orderid\
        JOIN products p on p.productid=l.productid\
        JOIN users u on u.id=o.userid \
        JOIN orderstatus s on s.orderid=o.orderid and s.stateid=1\
        WHERE o.userid=?', [user])
        .then(([results]) => results);
}

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
    findForUser,
    findMany,
    total,
    totalOrders,
    lastMonthSales,
    lastWeekSales,
    dailySales,
    yesterdaySales
    // findOne,
    // create,
    // update,
    // destroy
};