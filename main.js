const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require(`./lib/template.js`);
const sanitizeHtml = require('sanitize-html');
const MySQLTem = require(`./lib/MySQLTem.js`);
const db = require(`./lib/db.js`);

const app = http.createServer((request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    console.log(url.parse(_url, true));
    const pathname = url.parse(_url, true).pathname;
    
    let title = queryData.id;
    let list = "";
    let description = "";
    let body = "";
    let html = "";

    pathname === '/'? (
        queryData.id === undefined ? (
            fs.readdir(`data`, (err, filelist) => {
                title = 'Welcome';
                description = 'Hello nodejs';
                list = template.List(filelist);

                html = template.HTML(title, list,
                `<a href = "/create">create</a>`, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(html);
        })
        ) 
        : (
            fs.readdir('data', (err, filelist) => {
                fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
                list = template.List(filelist);

                const sanitizedTitle = sanitizeHtml(title);
                const sanitizedDescription = sanitizeHtml(description, {
                    allowedTags:['h1', 'p', 'a'],
                    allowedAttributes : {
                        'a':['href']
                    }
                })
                html = template.HTML(title, list,`<a href = "/create">create</a>
                 <a href = "/update?id=${sanitizedTitle}">update</a>
                 <form action = "/delete_process" method = "post" onsubmit="return confirm('do you want to delete this file?')">
                 <p><input type = "hidden" name="id" value="${sanitizedTitle}"></p>
                 <p><input type="submit" value="delete"></p></form>
                 `, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`);
                response.writeHead(200);
                response.end(html);
            })
            })
            ))
    : pathname === '/create' ? (
        fs.readdir('data', (err, filelist) => {
            list =template.List(filelist);
            title = 'WEB - create';
            html = template.HTML(title,list,``,`
            <h2>create</h2>
            <form action ="/create_process" method = "post">
            <p><input type = "text" name = "title" placeholder = "title"></p>
            <p><textarea name = "description" placeholder = "description"></textarea></p>
            <p><input type = "submit"></p></form>`);
            response.writeHead(200);
            response.end(html);
        })
    ) : pathname === '/create_process' ? (
        request.on('data', data => {
            body = body + data;
        }),
        request.on('end', () => {
            let post = qs.parse(body);
            title = post.title;
            description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', err => {
                response.writeHead(302,{Location : `/?id=${title}`});
                response.end();
            })
        })
    ) : pathname === '/update' ? (
        fs.readdir('data', (err, filelist) => {
            fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
                list = template.List(filelist);
                title = queryData.id;
                html = template.HTML(title, list, `<h2>update</h2>
                <form action = "/update_process" method = "post">
                <input type = "hidden" name = "id" value = "${title}">
                <p><input type = "text" name = "title" value = "${title}"></p>
                <p><textarea name = "description">${description}</textarea></p>
                <p><input type = "submit"></p></form>
                `,``);
                response.writeHead(200);
                response.end(html);
            })
        })
    ) : pathname === '/update_process' ? (
        request.on('data', data => {
            body = body + data;
        }),
        request.on('end', ()=>{
            let post = qs.parse(body);
            let id = post.id;
            title = post.title;
            description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, err => {
                fs.writeFile(`data/${title}`, description, 'utf8', err => {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            })
        })
    ) : pathname === '/delete_process' ? (
        request.on('data', data => {
            body += data;
        }),
        request.on('end', () => {
            let post = qs.parse(body);
            let id = post.id;

            fs.unlink(`data/${id}`, err => {
                response.writeHead(302, {Location:`/`});
                response.end();
            })
        })
    ) 

    : pathname === '/MySQL' ? (
        queryData.id === undefined ? (db.query(`select * from topic`, (err, topics) => {
            checkError = (err) => {
                if(err) throw `topics error 확인 바람`;
                else{
                    title = 'welcome';
                    description = 'hello, mysql';
                    list = MySQLTem.List(topics);
                    html = template.HTML(title, list, `<a href="/MySQL/create">create</a>`, `<h2>${title}</h2>${description}`);
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
        }))       
        :(db.query(`select * from topic`, (err, topics) => {
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
                    list = MySQLTem.List(topics);
                    html = MySQLTem.HTML(title, list,
                    `<a href = "/MySQL/create">create</a>
                    <a href = "/MySQL/update?id=${queryData.id}">update</a>'
                    <form action = "/MySQL/delete_process" method="post">
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
    )) : pathname === '/MySQL/create' ? 
    (db.query(`select * from topic`, (err, topics) => {
        db.query(`select * from author`, (err2, authors) => {
            title = 'create';
            list = MySQLTem.List(topics);
            html = MySQLTem.HTML(title, list,`<a href=/MySQL/create">create</a>` ,`<form action = "/MySQL/create_process" method = "post">
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
    }))   
    : pathname === '/MySQL/create_process' ? (
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
    ) : pathname === '/MySQL/update' ? (
        db.query(`select * from topic`, (err, topics) => {
        db.query(`select * from topic where id = ?`, [queryData.id], function(err2, topic){
        db.query(`select * from author`, (err3, authors)=>{
            list = MySQLTem.List(topics);
            html = MySQLTem.HTML(topic[0].title, list, `<a href="/MySQL/create">create</a> <a href = "/MySQL/update?id=${topic[0].id}">update</a>`,`
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
    }))
    : pathname === '/MySQL/update_process' ? (
        request.on('data', data => {
            body += data;
        }),
        request.on('end', ()=>{
            post = qs.parse(body);
            console.log(post);
            db.query(`update topic set title = ?, description = ?, author_id = ? where topic.id = ?`, [post.title, post.description, post.author, post.id], (err, result) => {
                response.writeHead(302, {Location: `/?id=${post.id}`});
                response.end();
            })
        })
    )
    :(
        response.writeHead(404),
        response.end('not found')
    )
})
app.listen(4000); 