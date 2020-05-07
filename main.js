const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require('./routes/topic.js');
const indexRouter = require(`./routes/index.js`);

app.use(compression());

app.post('*',bodyParser.urlencoded({ extended : false}));
app.get('*', (request, response, next) => {
    fs.readdir('./data', (err, filelist) => {
        request.list = filelist;
        next();
    });
});

app.use('/topic', topicRouter);
app.use('/', indexRouter);

app.use((req,res,next) => {
    res.status(404).send('sorry');
});

app.use((err2,req,res,next) => {
    // console.error(err2.stack)
    // res.status(500).send('broke!')
    checkError = (err2) => {
        if(err2) throw `topics err2or 확인 바람`;}
        try{
            checkError(err2);
        } catch(e) {
            res.status(500).send(`에러 발생 >>> ${e}`);
            console.log(`에러가 발생했습니다. >>> ${e}`);
            console.error(err2.stack);
        } finally {
            console.log('완료');
        } 
});

app.listen(4000, ()=>{
    console.log(`app listening on port 4000!`);
})