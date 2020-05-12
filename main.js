const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const pass = require('./lib2/pass.js');
const flash = require('connect-flash');
//const FileStore = require(`session-file-store`)(session);
const LokiStore = require('connect-loki')(session)
const app = express();

app.use(compression());
app.use('*',bodyParser.urlencoded({ extended : false}));
app.use(session({
    store: new LokiStore(),
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use(flash());

const passport = require('./lib/passport.js')(app);

app.get('*', (request, response, next) => {
    fs.readdir('./data', (err, filelist) => {
        request.list = filelist;
        next();
    });
});

const indexRouter = require(`./routes/index.js`);
const topicRouter = require('./routes/topic.js');const authRouter = require(`./routes/auth.js`)(passport);

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