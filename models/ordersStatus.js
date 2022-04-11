const connection = require("../db-config");

const db = connection.promise();

const create = ({ order_id, state_id, status_date }) => {
    return db
        .query("INSERT INTO orders_status(order_id, state_id, status_date) VALUES (?, ?, ?)", [order_id, state_id, status_date])
        .then(([results]) => {
            const id = results.insertID;
            return { id, order_id, state_id, status_date };
        });
}

module.exports = {
    create,
};