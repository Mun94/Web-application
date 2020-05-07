const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const template = require(`./lib/template.js`);
const bodyParser = require('body-parser');
const sanitizeHtml = require('sanitize-html');
const compression = require('compression');

app.use(compression());

app.post('*',bodyParser.urlencoded({ extended : false}));
app.get('*', (request, response, next) => {
    fs.readdir('./data', (err, filelist) => {
        request.list = filelist;
        next();
    });
});

let title ='';
let description = '';
let list = '';
let html ='';

app.get('/', (request, response) => {
        title = 'Welcome';
        description = 'Hello nodejs';
        list = template.List(request.list);

        html = template.HTML(title, list,
        `<a href = "/create">create</a>`, `<h2>${title}</h2>${description}`);
        
        response.send(html);
});

app.get('/page/:pageId', (request, response, next) => {
        const filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (err2, description) => {
            if(err2){
                next(err2);
            }
            else{
        title = request.params.pageId
        list = template.List(request.list);

        const sanitizedTitle = sanitizeHtml(title);
        const sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1', 'p', 'a'],
            allowedAttributes : {
                'a':['href']
            }
        })
        html = template.HTML(title, list,`<a href = "/create">create</a>
         <a href = "/update/${sanitizedTitle}">update</a>
         <form action = "/delete_process" method = "post" onsubmit="return confirm('do you want to delete this file?')">
         <p><input type = "hidden" name="id" value="${sanitizedTitle}"></p>
         <p><input type="submit" value="delete"></p></form>
         `, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`);
        
         response.send(html);
        }})
})

app.get('/create', (request, response) => {
        list =template.List(request.list);
        title = 'WEB - create';
        html = template.HTML(title,list,``,`
        <h2>create</h2>
        <form action ="/create_process" method = "post">
        <p><input type = "text" name = "title" placeholder = "title"></p>
        <p><textarea name = "description" placeholder = "description"></textarea></p>
        <p><input type = "submit"></p></form>`);
        
        response.send(html);
    })

app.post(`/create_process`, (request, response) => {
        let post = request.body;
        title = post.title;
        description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', err => {
            response.redirect(`/page/${title}`);
        })
    })


app.get(`/update/:pageId`, (request, response) => {
        const filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
            list = template.List(request.list);
            title = request.params.pageId;
            html = template.HTML(title, list, `<h2>update</h2>
            <form action = "/update_process" method = "post">
            <input type = "hidden" name = "id" value = "${title}">
            <p><input type = "text" name = "title" value = "${title}"></p>
            <p><textarea name = "description">${description}</textarea></p>
            <p><input type = "submit"></p></form>
            `,``);
            
            response.send(html);
        })
})
app.post(`/update_process`, (request, response) => {
        let post = request.body;
        let id = post.id;
        title = post.title;
        description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, err => {
            fs.writeFile(`data/${title}`, description, 'utf8', err => {
                response.redirect(`/page/${title}`);
            })
        })
    })


app.post(`/delete_process`, (request, response) => {
        let post = request.body;
        let id = post.id;

        fs.unlink(`data/${id}`, err => {
            response.redirect(`/`);
        })
    })

app.use((req,res,next) => {
    res.status(404).send('sorry');
});

app.use((err2,req,res,next) => {
    // console.error(err2.stack)
    // res.status(500).send('broke!')
    checkError = (err2) => {
        if(err2) throw `topics err2or 확인 바람`;}
        try{
            checkError(err2);
        } catch(e) {
            res.status(500).send(`에러 발생 >>> ${e}`);
            console.log(`에러가 발생했습니다. >>> ${e}`);
            console.error(err2.stack);
        } finally {
            console.log('완료');
        } 
});

app.listen(4000, ()=>{
    console.log(`app listening on port 4000!`);
})