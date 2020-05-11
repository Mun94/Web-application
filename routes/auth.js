const express = require('express');
const router = express.Router();
//const fs = require('fs');
//const path = require('path');
const template = require('../lib/template.js');
const pass = require('../lib2/pass.js');
const check = require('../lib/check.js');

let title = "";
let list = "";
let html = "";
let post = "";

router.get('/login', (request, response) => {
    title = `web-login`;
    list = template.List(request.list);
    html = template.HTML(title,`${check.UI(request,response)}`, list, `<form action="/auth/login_process" method = "post">
    <p><input type = "text" name = "email" placeholder = "email"></p>
    <p><input type = "password" name = "password" placeholder="password"></p>
    <p><input type = "submit" value = "login"></p></form>
    `,'');
    
    response.send(html);
});

/*
router.post('/login_process', (request, response) => {
    post = request.body;
    console.log(post); console.log(pass);
    
    post.email === pass.email && post.password === pass.password ? (
    request.session.is_logined = true,
    request.session.nickname = pass.nickname,
    request.session.todayIs = Date(),
    request.session.save( ()=>{
        response.redirect('/')
    })) :
     response.redirect('./loginError')
});
*/

router.get('/logout', (request, response) => {
    request.session.destroy( err => {
        response.redirect('/');
    })
});

router.get('/loginError', function(request, response){
var errorPage = `
<html>
<head>
<meta http-equiv="refresh" content="3;url=/" />
</head>
<body>
로그인 실패 3초 후 홈페이지로 돌아갑니다.
</body>
</html>
`;
response.send(errorPage);
});

module.exports = router;
