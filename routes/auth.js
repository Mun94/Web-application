const express = require('express');
const router = express.Router();
const template = require('../lib/template.js');
const check = require('../lib/check.js');

let title = "";
let list = "";
let html = "";

module.exports = function(passport) {
    
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

router.post('/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: './loginError',
    failureFlash:true,
    successFlash:true
  }));

router.get('/logout', (request, response) => {
    request.logout();
    request.session.save(function() {
        response.redirect('/');
    })
});

router.get('/loginError', function(request, response){
    const fmsg = request.flash().error;
    let feedback = '';
    if(fmsg)
    {
       feedback = fmsg[0];
    } 
var errorPage = `
<html>
<head>
<meta http-equiv="refresh" content="5;url=/auth/login">
</head>
<body>
<div style="color:red">${feedback}</div>
로그인 실패 5초 후 로그인 페이지로 돌아갑니다.
</body>
</html>
`;
response.send(errorPage);
});
 return router;
}
