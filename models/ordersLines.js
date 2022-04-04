const connection = require("../db-config");

const db = connection.promise();

const create = ({ order_id, id, quantity, price }) => {
    // console.log(`orderslines.create(${order_id}, ${id}, ${quantity}, ${price})`)
    return db
        .query("INSERT INTO orders_lines(order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", [order_id, id, quantity, price])
        .then(([results]) => {
            const id = results.insertId;
            return { id, order_id, product_id: id, quantity, price };
        });
}

module.exports = {
    create,
};