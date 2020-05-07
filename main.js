const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require(`./lib/template.js`);
const sanitizeHtml = require('sanitize-html');
const MySQLTem = require(`./lib/MySQLTem.js`);
const db = require(`./lib/db.js`);
const origin = require(`./lib/home.js`);
const mysql = require(`./lib/mysql.js`);

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
           origin.home(request, response)
        ) 
        : ( origin.page(request, response)
        ))
    : pathname === '/create' ? (
        origin.create(request, response)
    ) : pathname === '/create_process' ? (
        origin.create_process(request, response)
    ) : pathname === '/update' ? (
        origin.update(request, response)
    ) : pathname === '/update_process' ? (
        origin.update_process(request, response)
    ) : pathname === '/delete_process' ? (
        origin.delete_prcess(request, response)
    ) 

    : pathname === '/MySQL' ? (
        queryData.id === undefined ? (
            mysql.mysql_home(request, response))       
        :( mysql.mysql_page(request, response)
    )) : pathname === '/MySQL/create' ? 
    (   mysql.mysql_create(request, response))   
    : pathname === '/MySQL/create_process' ? (
        mysql.mysql_create_process(request, response)
    ) : pathname === '/MySQL/update' ? (
        mysql.mysql_update(request, response)    
    ): pathname === '/MySQL/update_process' ? (
       mysql.mysql_update_process(request, response)
    ) : pathname === `/MySQL/delete_process` ? (
       mysql.mysql_delete_process(request, response)
    )
    :(
        response.writeHead(404),
        response.end('not found')
    )
})
app.listen(4000); 