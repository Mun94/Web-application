const express = require('express');
const router = express.Router();
const template = require(`../lib/template.js`);

let title ='';
let description = '';
let list = '';
let html ='';

router.get('/', (request, response) => {
        title = 'Welcome';
        description = 'Hello nodejs';
        list = template.List(request.list);

        html = template.HTML(title, list,
        `<a href = "/create">create</a>`, `<h2>${title}</h2>${description}`);
        
        response.send(html);
});

module.exports = router;