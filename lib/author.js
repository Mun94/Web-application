const db = require(`./db.js`);
const MySQLTem = require(`./MySQLTem.js`);
const qs = require(`querystring`);
const url = require(`url`);

function style(self)
  {
return `<style>
  #authortable td {
    border : 1px solid black;
  }
  #authortable {
    border-collapse : collapse;
  }
</style>`
}

exports.author_home = (request, response) => {
    db.query(`select * from topic`, (err, topics) => {
        db.query(`select * from author`, (err2, authors) => {
            let title = "author";
            let list = MySQLTem.List(topics);
            let html = MySQLTem.HTML(title, list, `<a href = /MySQL/authors/create>create</a>`,`${MySQLTem.authorTable(authors)}
            ${style(this)}
            `);

            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.author_create = (request, response) => {
    db.query(`select * from author`, (err, authors) => {
        let title = 'author-create'
        let html = MySQLTem.HTML(title,`${MySQLTem.authorTable(authors)}
        ${style(this)}
        <a href = "/MySQL/authors/create">create</a>
        `,`
        <form action = "/MySQL/authors/create_process" method = "post">
        <p><input type = "text" name = "name" placeholder = "name"></p>
        <p><textarea name = "profile" placeholder = "profile"></textarea></p>
        <input type = "submit"></form>
        `,``);

        response.writeHead(200);
        response.end(html);
    })
}

exports.author_create_process = (request, response) => {
    let body = "";
    request.on('data', data => {
        body += data;
    })
    request.on('end', ()=>{
        let post = qs.parse(body);

        db.query(`insert into author (name, profile) values (?, ?) `,[post.name, post.profile], (err, result) => {
            response.writeHead(302, {Location : `/MySQL/authors/create`})
            response.end();
        })
    })
}

exports.author_update = (request, response) => {
    db.query(`select * from author`, (err, authors) => {
        const _url = request.url;
        const queryData = url.parse(_url, true).query;
        db.query(`select * from author where author.id = ?`, [queryData.id], (err2, author)=> {

            let title = `author-update`;
            let html = MySQLTem.HTML(title, `${MySQLTem.authorTable(authors)} ${style(this)}`, `<form action = "/MySQL/authors/update_process" method = "post">
            <input type ="hidden" name = "id" value = "${queryData.id}">
            <p><input type = "text" name = "name" value = "${author[0].name}"></p>
            <p><textarea name = "profile">${author[0].profile}</textarea></p>
            <input type = "submit">`, ``);

            response.writeHead(200);
            response.end(html);
        })
    })
}

exports.author_update_process = (request, response) => {
    let body = "";
    request.on('data', data => {
        body += data;
    })
    request.on('end', ()=>{
        let post = qs.parse(body);
        
        db.query(`update author set name = ?, profile = ? where author.id = ? `, [post.name, post.profile, post.id], (err, result) => {
            response.writeHead(302, {Location : `/MySQL/authors`});
            response.end();
        })
    })
}

exports.author_delete_process = (request, response) => {
    let body = "";
    request.on('data', data => {
        body += data;
    })
    request.on('end', () => {
        let post = qs.parse(body);

        console.log(post);
        db.query(`delete from author where author.id = ?`, [post.id], (err, result) => {
            response.writeHead(302, {Location : `/MySQL/authors`});
            response.end();
        })
    })
}