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

        request.session.num === undefined ? request.session.num =1 : request.session.num += 1

        html = template.HTML(title,`${check.UI(request,response)}`, list,
        `<a href = "/create">create</a>`, `<h2>${title}</h2>${description} <p>새로고침 수 :${request.session.num}</p>`);
        
        response.send(html);
});

module.exports = router;