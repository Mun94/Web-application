const http = require('http');
const url = require('url');
const origin = require(`./lib/home.js`);
const mysql = require(`./lib/mysql.js`);
const author = require(`./lib/author.js`);

const app = http.createServer((request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    console.log(url.parse(_url, true));
    const pathname = url.parse(_url, true).pathname;

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
    :   pathname === `/MySQL/authors`? (
        author.author_home(request, response)
    )
    : pathname === `/MySQL/authors/create`?(
        author.author_create(request, response)
    )
    :pathname === `/MySQL/authors/create_process` ? (
        author.author_create_process(request, response)
    )
    :(
        response.writeHead(404),
        response.end('not found')
    )
})
app.listen(4000); 