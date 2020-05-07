const template = require('./template.js');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

let post = '';
let body = '';
let title = '';
let list = '';
let html = '';
let description = '';

exports.home = (request, response) => {
    fs.readdir(`data`, (err, filelist) => {
        title = 'Welcome';
        description = 'Hello nodejs';
        list = template.List(filelist);

        html = template.HTML(title, list,
        `<a href = "/create">create</a>`, `<h2>${title}</h2>${description}`);
        response.writeHead(200);
        response.end(html);
})
}

exports.page = (request, response) => {
    fs.readdir('data', (err, filelist) => {
        const _url = request.url;
        const queryData = url.parse(_url, true).query;
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        list = template.List(filelist);
        const sanitizedTitle = sanitizeHtml(queryData.id);
        const sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1', 'p', 'a'],
            allowedAttributes : {
                'a':['href']
            }
        })
        html = template.HTML(queryData.id, list,`<a href = "/create">create</a>
         <a href = "/update?id=${sanitizedTitle}">update</a>
         <form action = "/delete_process" method = "post" onsubmit="return confirm('do you want to delete this file?')">
         <p><input type = "hidden" name="id" value="${sanitizedTitle}"></p>
         <p><input type="submit" value="delete"></p></form>
         `, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`);
        response.writeHead(200);
        response.end(html);
    })
    })
}

exports.create = (request, response) => {
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
}

exports.create_process = (request, response) => {
    request.on('data', data => {
        body += data;
    }),
    request.on('end', () => {
        post = qs.parse(body);
        title = post.title;
        description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', err => {
            response.writeHead(302,{Location : `/?id=${title}`});
            response.end();
        })
    })
}

exports.update = (request, response) => {
    fs.readdir('data', (err, filelist) => {
        const _url = request.url;
        const queryData = url.parse(_url, true).query;
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
}

exports.update_process = (request, response) => {
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
}

exports.delete_prcess = (request, response) => {
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
}