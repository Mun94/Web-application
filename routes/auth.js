const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const template = require('../lib/template.js');

let title = "";
let list = "";
let html = "";

router.get('/login', (request, response) => {
    title = `web-login`;
    list = template.List(request.list);
    html = template.HTML(title, list, `<form action="/auth/login_process" method = "post">
    <p><input type = "text" name = "email" placeholder = "email"></p>
    <p><input type = "password" name = "password" placeholder="password"></p>
    <p><input type = "submit" value = "login"></p></form>
    `,'');
    
    response.send(html);
})

module.exports = router;
