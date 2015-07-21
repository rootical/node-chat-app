/*jslint node: true nomen: true*/
'use strict';

var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    http = require('http'),
    mongoose = require('mongoose'),
    fs = require('fs'),

    routesPath = path.join(__dirname, "/controllers/api/"),

    Server = require('./middlewares/Server').Server,
    database = require('./config/database'),

    // clean variables
    wss,

    // init express
    app = module.exports = express();

// current users in default chat
global.USERS = {};
global.USERS.def = {};

app.use(morgan('dev'));

// set view
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// mongose
mongoose.connect(database.url);

// less, css, js, img directories
/*
app.use(require('less-middleware')('/less', {
    debug: true,
    dest: '/css',
    pathRoot: path.join(__dirname, 'public'),
    force: true
}));
*/

app.use(express.static(path.join(__dirname, 'public')));

// read all api modules from all versions
fs.readdirSync(routesPath).forEach(function(version) {
    fs.readdirSync(path.join(routesPath, version)).forEach(function(file) {
        app.use(
            require(path.join(routesPath, version, file))
        );
    });
});


// lets run the Angular
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/js/app/index.html'));
});

//console.log(Users.simple.name);

app.server = http.createServer(app);
app.server.listen(3000);

// web services server start
app.wss = new Server({server: app.server});
app.wss.run();
