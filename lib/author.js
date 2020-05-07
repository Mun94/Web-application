const db = require(`./db.js`);
const MySQLTem = require(`./MySQLTem.js`);

exports.author_home = (request, response) => {
    db.query(`select * from topic`, (err, topics) => {
        db.query(`select * from author`, (err2, authors) => {
            let title = "author";
            let list = MySQLTem.List(topics);
            let html = MySQLTem.HTML(title, list, `<a href = /MySQL/authors/create>create</a>`,`${MySQLTem.authorTable(authors)}
            <style>
            table {
                border-collapse:collapse;
            }
            td{
                border: 1px solid black;
            }
            </style>
            `);

            response.writeHead(200);
            response.end(html);
        });
    });
}
