const db = require('../lib/db.js');
const bcrypt = require('bcrypt');

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
        const user = db.get('users').find({
            email : username
        }).value();

        if(user) {
            bcrypt.compare(password, user.password, function(err, result){
                if(result){
                    return done(null, user, {
                        message:'welcome'
                    });
                }
                else {
                    return done(null, false, {
                        message: '비밀번호가 틀렸습니다.'
                    })
                }
            })       
        } else {
            return done(null, false, {
                message: '없는 email입니다.'
            })
        }
    }  
  ));
 return passport
}