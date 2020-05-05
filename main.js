const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

templateList = filelist => {
    let list = "<ul>";
    for(let i=0; i<filelist.length; i++)
    {
        list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`
    }
    list = list + "</ul>";
    return list;
}

templateHTML = (title, list, control, body) => {
    return `<!doctype html>
            <html>
            <head>
                <meta charset = "utf-8">
                <title>${title} page</title>
            <head>

            <body>
                <h1><a href = '/'>WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
            </html>`;
}

const app = http.createServer((request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    console.log(url.parse(_url, true));
    const pathname = url.parse(_url, true).pathname;
    
    let title = queryData.id;
    let list = "";
    let description = "";
    let body = "";
    let template = "";

    pathname === '/'? (
        queryData.id === undefined ? (
            fs.readdir(`data`, (err, filelist) => {
                title = 'Welcome';
                description = 'Hello nodejs';
                list = templateList(filelist);

                template = templateHTML(title, list,
                `<a href = "/create">create</a>`, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
        })
        ) 
        : (
            fs.readdir('data', (err, filelist) => {
                fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
                list = templateList(filelist);

                template = templateHTML(title, list,`<a href = "/create">create</a> <a href = "/update?id=${title}">update</a>`, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
            })
            })
            ))
    : pathname === '/create' ? (
        fs.readdir('data', (err, filelist) => {
            list =templateList(filelist);
            title = 'WEB - create';
            template = templateHTML(title,list,``,`
            <h2>create</h2>
            <form action ="/create_process" method = "post">
            <p><input type = "text" name = "title" placeholder = "title"></p>
            <p><textarea name = "description" placeholder = "description"></textarea></p>
            <p><input type = "submit"></p></form>`);
            response.writeHead(200);
            response.end(template);
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
                list = templateList(filelist);
                title = queryData.id;
                template = templateHTML(title, list, `<h2>update</h2>
                <form action = "/update_process" method = "post">
                <input type = "hidden" name = "id" value = "${title}">
                <p><input type = "text" name = "title" value = "${title}"></p>
                <p><textarea name = "description">${description}</textarea></p>
                <p><input type = "submit"></p></form>
                `,``);
                response.writeHead(200);
                response.end(template);
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
    )
    :(
        response.writeHead(404),
        response.end('not found')
    )
})
app.listen(4000);