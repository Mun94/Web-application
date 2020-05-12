const express = require('express');
const router = express.Router();
const template = require(`../lib/template.js`);
const check = require(`../lib/check.js`);

let title ='';
let description = '';
let list = '';
let html ='';


router.get('/', (request, response) => {
        console.log('/', request.user);
        console.log('request.session ===>',request.session);
        title = 'Welcome';
        description = 'Hello nodejs';
        list = template.List(request.list);

        html = template.HTML(title,`${check.UI(request,response)}`, list,
        `<a href = "/topic/create">create</a>`, `<h2>${title}</h2>${description} <p>${Date()}</p><p>${request.session.num}</p>`);
        
        response.send(html);
});

module.exports = router;