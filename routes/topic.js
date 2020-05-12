const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const template = require(`../lib/template.js`);
const sanitizeHtml = require('sanitize-html');
const check = require('../lib/check.js');
const shortid = require('shortid');
const db = require('../lib/db.js');

let title ='';
let description = '';
let list = '';
let html ='';

router.get('/create', (request, response) => {
    !check.IS(request,response) ? 
    response.send(`로그인이 필요합니다.<p><a href="/auth/login">login</a></p>`) : (
    list =template.List(request.list),
    title = 'WEB - create',
    html = template.HTML(title,`${check.UI(request,response)}`,list,``,`
    <h2>create</h2>
    <form action ="/topic/create_process" method = "post">
    <p><input type = "text" name = "title" placeholder = "title"></p>
    <p><textarea name = "description" placeholder = "description"></textarea></p>
    <p><input type = "submit"></p></form>`),
    
    response.send(html))
})

router.post(`/create_process`, (request, response) => {
    let post = request.body;
    title = post.title;
    description = post.description;
    // fs.writeFile(`data/${title}`, description, 'utf8', err => {
    //     response.redirect(`/topic/${title}`);
    // })
    const id = shortid.generate();
    db.get('topics').push({
        id:id,
        title:title,
        description:description,
        user_id:request.user.id
    }).write();
    response.redirect(`/topic/${id}`);
});


router.get(`/update/:pageId`, (request, response) => {
    const filteredId = path.parse(request.params.pageId).base;

    !check.IS(request,response) ? 
    response.send(`로그인이 필요합니다.<p><a href="/auth/login">login</a></p>`) : (
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        list = template.List(request.list);
        title = request.params.pageId;
        html = template.HTML(title,`${check.UI(request,response)}`, list, `<h2>update</h2>
        <form action = "/topic/update_process" method = "post">
        <input type = "hidden" name = "id" value = "${title}">
        <p><input type = "text" name = "title" value = "${title}"></p>
        <p><textarea name = "description">${description}</textarea></p>
        <p><input type = "submit"></p></form>
        `,``);
        
        response.send(html);
    }))
})
router.post(`/update_process`, (request, response) => {
    let post = request.body;
    let id = post.id;
    title = post.title;
    description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, err => {
        fs.writeFile(`data/${title}`, description, 'utf8', err => {
            response.redirect(`/topic/${title}`);
        })
    })
})


router.post(`/delete_process`, (request, response) => {
    
    let post = request.body;
    let id = post.id;

    !check.IS(request,response) ? 
    response.send(`로그인이 필요합니다.<p><a href="/auth/login">login</a></p>`) : (
    fs.unlink(`data/${id}`, err => {
        response.redirect(`/`);
    }))
})

router.get('/:pageId', (request, response, next) => {
    const topic = db.get('topics').find({
        id:request.params.pageId
    }).value();
    const user = db.get('users').find({
        id:topic.user_id
    }).value();

    // const filteredId = path.parse(request.params.pageId).base;
    //  fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        // if(!err){
        //     next(err);
        // }
        // else{
        list = template.List(request.list);

        const sanitizedTitle = sanitizeHtml(topic.title);
        const sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1', 'p', 'a'],
            allowedAttributes : {
                'a':['href']
            }
        })
        html = template.HTML(title,`${check.UI(request,response)}`, list,`<a href = "/topic/create">create</a>
        <a href = "/topic/update/${sanitizedTitle}">update</a>
        <form action = "/topic/delete_process" method = "post" onsubmit="return confirm('do you want to delete this file?')">
        <p><input type = "hidden" name="id" value="${sanitizedTitle}"></p>
        <p><input type="submit" value="delete"></p></form>
        `, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}
        <p>by ${user.displayName}</p>
        `);
        
        response.send(html);
    //}
//})
})

module.exports = router;
