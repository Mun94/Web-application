const db = require('../lib/db.js');

module.exports = function (app) {
const pass = require('../lib2/pass.js')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(request, user, done) {
    request.session.num ===undefined ? request.session.num = 1 : request.session.num +=1
    console.log('serializeUser', user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    let user = db.get('users').find({id:id}).value();
    console.log('deserializeUser', id, user);
    done(null, user);
});

passport.use(new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'password' 
    },
    function (username, password, done) {
        console.log('LocalStrategy', username, password);
        if(username === pass.email) {
            console.log(1);
            if(password === pass.password) {
                console.log(2);
                return done(null, pass,{
                    message:'로그인 되었습니다.'
                })}
            else{
            console.log(3)
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }}
        else {
            console.log(4)
            return done(null, false, {
                message: 'Incorrect username'
            })
        }
    }  
  ));
 return passport
}