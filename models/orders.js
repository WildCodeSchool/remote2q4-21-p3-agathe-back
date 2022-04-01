const connection = require("../db-config");
// const Joi = require('joi');

const db = connection.promise();

const total = () =>
    db.query('SELECT SUM(TotalAmount) AS total FROM orders')
    .then(([results]) => results[0]);

const count = () =>
    db.query('SELECT COUNT(OrderID) AS count from orders')
    .then(([results]) => results[0]);

const dailySales = () => {
    let select = '\
    SELECT coalesce(SUM(o.total_amount),0) AS sales\
    FROM orders_header AS o\
    WHERE o.payment_date = current_date'
    return db
        .query(select)
        .then(([results]) => results[0]);
}

const yesterdaySales = () => {
    let select = '\
    SELECT coalesce(SUM(o.total_amount),0) AS sales\
    FROM orders_header AS o\
    WHERE o.payment_date = subdate(current_date, 1)'
    return db
        .query(select)
        .then(([results]) => results[0]);
}
const lastWeekSales = () => {
    let select = '\
    SELECT coalesce(SUM(o.total_amount),0) AS sales\
    FROM orders_header AS o \
        JOIN calendar oc on oc.db_date=o.payment_date\
        JOIN calendar AS c ON c.db_date=date_sub(curdate(), interval 1 WEEK) \
    WHERE oc.year=c.year AND oc.week=c.week'
    return db
        .query(select)
        .then(([results]) => results[0]);
}

const lastMonthSales = () => {
    let select = '\
    SELECT coalesce(SUM(o.total_amount),0) AS sales\
    FROM orders_header AS o\
        JOIN calendar oc on oc.db_date=o.payment_date\
        JOIN calendar AS c ON c.db_date = date_sub(curdate(), interval 1 month)\
    WHERE oc.year = c.year AND oc.month = c.month'
    return db
        .query(select)
        .then(([results]) => results[0]);
}

const yearlySales = () =>
    db.query("SELECT c.year, c.month_name, coalesce(sum(o.total_amount),0) AS total_amount\
    from calendar c\
    left join orders_header o on o.creation_date=c.db_date\
    where c.year=year(current_date)\
    group by c.year, c.month_name")
    .then(([results]) => results);

const findForProduct = (product) => {
    let select = '\
    select id, product_id, product, user_id, user_name,\
        quantity, amount, order_date, state\
    from orders_detail\
    where product_id=?'
    return db
        .query(select, [product])
        .then(([results]) => results);
}

const findForUser = (user) => {
    let select = '\
    select id, product_id, product, user_id, user_name,\
        quantity, amount, order_date, state\
    from orders_detail\
    where user_id=?'
    return db
        .query(select, [user])
        .then(([results]) => results);
}

const findMany = () => {
    let select = '\
    select id, product_id, product, user_id, user_name,\
        quantity, amount, order_date, state\
    from orders_detail'
    return db
        .query(select)
        .then(([results]) => results);
}

// const findOne = (id) => {
//     return db
//         .query('SELECT * FROM ingredients WHERE ingredientID = ?', [id])
//         .then(([results]) => results[0]);
// };

const pendingDeliveries = () => {
    let select = '\
    select id, product_id, product, user_id, user_name,\
        quantity, amount, order_date, state\
    from orders_detail\
    where status_id=2\
    order by id'
    return db
        .query(select)
        .then(([results]) => results);
}

const create = ({ UserID, TotalAmount, status_id }) => {
    // console.log(`Orders.create(${UserID}, ${TotalAmount}, ${status_id})`)
    return db
        .query("INSERT INTO orders(UserID, TotalAmount, status_id) VALUES (?, ?, ?)", [UserID, TotalAmount, status_id])
        .then(([results]) => {
            // console.log(results)
            const OrderID = results.insertId;
            return { OrderID, UserID, TotalAmount, status_id };
        });
};

const update = (id, newAttributes) => {
    return db.query('UPDATE orders SET ? WHERE OrderID = ?', [newAttributes, id]);
};

// const destroy = (id) => {
//     return db
//         .query('DELETE FROM ingredients WHERE id = ?', [id])
//         .then(([result]) => result.affectedRows !== 0);
// };

module.exports = {
    count,
    create,
    dailySales,
    findForProduct,
    findForUser,
    findMany,
    lastMonthSales,
    lastWeekSales,
    pendingDeliveries,
    total,
    yesterdaySales,
    yearlySales
    // findOne,
    // update,
    // destroy
};