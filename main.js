const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require(`./lib/template.js`);

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

                html = template.HTML(title, list,`<a href = "/create">create</a>
                 <a href = "/update?id=${title}">update</a>
                 <form action = "/delete_process" method = "post" onsubmit="return confirm('do you want to delete this file?')">
                 <p><input type = "hidden" name="id" value="${title}"></p>
                 <p><input type="submit" value="delete"></p></form>
                 `, `<h2>${title}</h2>${description}`);
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
    :(
        response.writeHead(404),
        response.end('not found')
    )
})
app.listen(4000);