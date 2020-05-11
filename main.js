const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const pass = require('./lib2/pass.js');

const FileStore = require(`session-file-store`)(session);

const app = express();

app.use(compression());
app.use('*',bodyParser.urlencoded({ extended : false}));
app.use(session({
    store : new FileStore(),
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.email);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    done(null, pass);
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
                return done(null, pass);}
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
 
app.post('/auth/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: './loginError'
  }));

app.get('*', (request, response, next) => {
    fs.readdir('./data', (err, filelist) => {
        request.list = filelist;
        next();
    });
});


const indexRouter = require(`./routes/index.js`);
const topicRouter = require('./routes/topic.js');const authRouter = require(`./routes/auth.js`);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use((req,res,next) => {
    res.status(404).send('sorry');
});

app.use((err,req,res,next) => {
    // console.error(err2.stack)
    // res.status(500).send('broke!')
    checkError = (err) => {
        if(err) throw `${err} 확인 바람`;}
        try{
            checkError(err);
        } catch(e) {
            res.status(500).send(`에러 발생 >>> ${e}`);
            console.log(`에러가 발생했습니다. >>> ${e}`);
            console.error(err.stack);
        } finally {
            console.log('완료');
        } 
});

app.listen(4000, ()=>{
    console.log(`app listening on port 4000!`);
})