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

        const fmsg = request.flash().success;
        let feedback = '';
        if(fmsg)
        {
           feedback = fmsg[0];
        } 

        html = template.HTML(title,`${check.UI(request,response)} ${feedback}`, list,
        `<a href = "/topic/create">create</a>`, `<h2>${title}</h2>${description} <p>${Date()}</p><p>${request.session.num}</p>`);
        
        response.send(html);
});

module.exports = router;