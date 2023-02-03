const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || "10000")
}

const db = mysql.createConnection(dbConfig);

const WIPE_INVENTORY_SQL = `DELETE FROM Items;`;
const wipeInventory = (callback) => db.execute(WIPE_INVENTORY_SQL, callback);
const INSERT_INTO_INVENTORY_SQL = `
INSERT INTO Items
    (name, quantity, description, lastModified)
VALUES
    (?, ?, ?, ?);`
const insertIntoInventory = (name, quantity, description, lastModified, callback) => {
    db.execute(INSERT_INTO_INVENTORY_SQL, [
        name, quantity, description, lastModified
    ], callback);
}
const READ_INVENTORY_SQL = `SELECT * FROM Items`;
const readAllInventory = (callback) => {
    return db.execute(READ_INVENTORY_SQL, callback);
}
const READ_ITEM_INVENTORY_SQL = `
SELECT 
    id, name, quantity, description, lastModified
FROM
    Items
WHERE
    id = ?`;
const readItemInventory = (id, callback) => {
    return db.execute(READ_ITEM_INVENTORY_SQL, [id], callback);
}

const DELETE_ITEM_INVENTORY_SQL = `
DELETE FROM Items
WHERE id = ?
`
const deleteItemInventory = (id, callback) => {
    return db.execute(DELETE_ITEM_INVENTORY_SQL, [id], callback);
}

const UPDATE_ITEM_INVENTORY_SQL = `
UPDATE Items
SET name = ?,
    quantity = ?,
    description = ?,
    lastModified = ?
WHERE
    id = ?
`
const updateItemInventory = (id, name, quantity, description, lastModified, callback) => {
    return db.execute(UPDATE_ITEM_INVENTORY_SQL, [name, quantity, description, lastModified, id], callback);
}

module.exports = {};
module.exports.wipe = wipeInventory;
module.exports.delete = deleteItemInventory;
module.exports.insert = insertIntoInventory;
module.exports.readAll = readAllInventory;
module.exports.read = readItemInventory;
module.exports.update = updateItemInventory;
module.exports.disconnect = () => db.end();