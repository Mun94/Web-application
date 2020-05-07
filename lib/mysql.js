const db = require('./db.js');
const MySQLTem = require(`./MySQLTem.js`);
const url = require('url');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');


exports.mysql_home = (request, response) => {
    db.query(`select * from topic`, (err, topics) => {
        checkError = (err) => {
            if(err) throw `topics error 확인 바람`;
            else{
                let title = 'welcome';
                let description = 'hello, mysql';
                let list = MySQLTem.List(topics);
                let html = MySQLTem.HTML(title, list, `<a href="/MySQL/create">create</a>`, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(html);
            }
        }
        try{
            checkError(err);
        } catch(e) {
            response.end(`에러 발생 >>> ${e}`);
            console.log(`에러가 발생했습니다. >>> ${e}`);
        } finally {
            console.log('완료');
        } 
    })
}

exports.mysql_page = (request, response) => {
    db.query(`select * from topic`, (err, topics) => {
        const _url = request.url;
        const queryData = url.parse(_url, true).query;
        checkError = (err) => {
            if(err) throw `topics error 확인 바람`;}
            try{
                checkError(err);
            } catch(e) {
                response.end(`에러 발생 >>> ${e}`);
                console.log(`에러가 발생했습니다. >>> ${e}`);
            } finally {
                console.log('완료');
            } 
        db.query(`select * from topic left join author on topic.author_id = author.id where topic.id = ?`, [queryData.id], (err2, topic) => {
            if(err2) throw `topic error 확인 바람`
            else{
                console.log(topic);

                const sanitizedTitle = sanitizeHtml(topic[0].title);
                const sanitizedDescription = sanitizeHtml(topic[0].description);
                let list = MySQLTem.List(topics);
                let html = MySQLTem.HTML(topic[0].title, list,
                `<a href = "/MySQL/create">create</a>
                <a href = "/MySQL/update?id=${queryData.id}">update</a>'
                <form action = "/MySQL/delete_process" method="post" onsubmit="return confirm('do you want to delete this file?')">
                    <input type ="hidden" name = "id" value="${queryData.id}">
                    <input type ="submit" value="delete">
                </form>
                `, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}<p>by ${topic[0].name}</p>`);
                response.writeHead(200);
                response.end(html);
            }
            try{
                checkError(err2);
            } catch(e) {
                response.end(`에러 발생 >>> ${e}`);
                console.log(`에러가 발생했습니다. >>> ${e}`);
            } finally {
                console.log('완료');
            } 
        })
    })
}

exports.mysql_create = (request, response) => {
    db.query(`select * from topic`, (err, topics) => {
        db.query(`select * from author`, (err2, authors) => {
            let title = 'create';
            let list = MySQLTem.List(topics);
            let html = MySQLTem.HTML(title, list,`<a href="/MySQL/create">create</a>` ,`<form action = "/MySQL/create_process" method = "post">
            <p><input type = "text" name = "title" placeholder = "title"></p>
            <p>
                <textarea name = "description" placeholder = "description"></textarea>
            </p>
            <p> ${MySQLTem.authorSelect(authors)}</p>
            <p><input type="submit"></p>
            </form>
            `);
            response.writeHead(200);
            response.end(html);
        })
    })
}

exports.mysql_create_process = (request, response) => {
    let body = "";
    request.on('data', data => {
        body += data;
    }),
    request.on('end', ()=>{
       let post = qs.parse(body);
        console.log(post);
       db.query(`insert into topic (title, description, created, author_id) values (?, ?, now(), ?)`, [post.title, post.description, post.author], (err, result) => {
           console.log(result);
           response.writeHead(302, {Location: `/MySQL?id=${result.insertId}`});
           response.end();
       })
    })
}

exports.mysql_update = (request, response) => {
    db.query(`select * from topic`, (err, topics) => {
        const _url = request.url;
        const queryData = url.parse(_url, true).query;
        db.query(`select * from topic where id = ?`, [queryData.id], function(err2, topic){
        db.query(`select * from author`, (err3, authors)=>{
            let list = MySQLTem.List(topics);
            let html = MySQLTem.HTML(topic[0].title, list, `<a href="/MySQL/create">create</a> <a href = "/MySQL/update?id=${topic[0].id}">update</a>`,`
            <form action ="/MySQL/update_process" method="post">
            <input type = "hidden" name = "id" value = "${topic[0].id}">
            <p><input type = "text" name = "title" value = "${topic[0].title}"></p>
            <p><textarea name = "description">${topic[0].description}</textarea></p>
            <p>${MySQLTem.authorSelect(authors, topic[0].author_id)}</p>
            <p><input type ="submit"></p>
            </form>
            `);
        response.writeHead(200);
        response.end(html);
        })
        })
    })
}

exports.mysql_update_process = (request, response) => {
    let body = "";
    request.on('data', data => {
        body += data;
    }),
    request.on('end', ()=>{
        let post = qs.parse(body);
        console.log(post);
        db.query(`update topic set title = ?, description = ?, author_id = ? where topic.id = ?`, [post.title, post.description, post.author, post.id], (err, result) => {
            response.writeHead(302, {Location: `/MySQL?id=${post.id}`});
            response.end();
        })
    })
}

exports.mysql_delete_process = (request, response) => {
    let body = "";
    request.on('data', data => {
        body += data;
    }),
    request.on('end', () => {
        let post = qs.parse(body);
        db.query(`delete from topic where id = ?`, [post.id], (err, result)=>{
            response.writeHead(302, {Location:`/MySQL`})
            response.end();
        })
    })
}