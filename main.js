const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer((request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    let title = queryData.id;
    console.log(url.parse(_url, true));
    const pathname = url.parse(_url, true).pathname;

    pathname === '/'? (
    queryData.id === undefined ?
    (
        fs.readdir(`data`, (err, filelist) => {
            title = 'Welcome';
            const description = 'Hello nodejs';

            let list = "<ul>";
            for(let i=0; i<filelist.length; i++)
            {
                list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`
            }
            list = list + "</ul>";

            const template = `<!doctype html>
            <html>
            <head>
                <meta charset = "utf-8">
                <title>${title} page</title>
            <head>

            <body>
                <h1><a href = '/'>WEB</a></h1>
                ${list}
                <h2>${title}</h2>
                ${description}
            </body>
            </html>`;
        response.writeHead(200);
        response.end(template);
    })
    ) :
    (
        fs.readdir('data', (err, filelist) => {
            let list = "<ul>";
            for(let i=0; i<filelist.length; i++)
            {
                list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`
            }
            list = list + "</ul>";

            fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
            
                const template = `<!doctype html>
                <html>
                <head>
                    <meta charset = "utf-8">
                    <title>${title} page</title>
                <head>
    
                <body>
                    <h1><a href = '/'>WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    ${description}
                </body>
                </html>`;
            response.writeHead(200);
            response.end(template);
        })
        })
        ))
       :
    (
        response.writeHead(404),
        response.end('not found')
    )
})
app.listen(4000);