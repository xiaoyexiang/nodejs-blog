const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function() {
    console.log('Connected to Mongodb..');
})

db.on('error', function(err) {
    console.log(err);
})

var app = express();

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// 路由
let articlesRouter = require('./routes/articles');
app.use('/articles', articlesRouter);
let usersRouter = require('./routes/users');
app.use('/users', usersRouter);

let Article = require('./models/article');

app.get('/', function(req, res, next) {
    Article.find({}, function(err, articles) {
        // console.log(articles);
        res.render('articles/index', {
            articles: articles
        });
    })
});

app.listen('3000', function() {
    console.log('listenning port :3000')
});