const mysql = require('mysql');

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'munsw1726',
    database : 'githubnodejsmysql'
})
db.connect();
module.exports = db;