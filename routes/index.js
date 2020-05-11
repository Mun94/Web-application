const express = require('express');
const router = express.Router();
const template = require(`../lib/template.js`);
const check = require(`../lib/check.js`);

let title ='';
let description = '';
let list = '';
let html ='';


router.get('/', (request, response) => {
        title = 'Welcome';
        description = 'Hello nodejs';
        list = template.List(request.list);

        html = template.HTML(title,`${check.UI(request,response)}`, list,
        `<a href = "/topic/create">create</a>`, `<h2>${title}</h2>${description} <p>${Date()}</p>`);
        
        response.send(html);
});

module.exports = router;