/*jslint node: true nomen: true*/

var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    http = require('http'),
    path = require('path'),

    Server = require('./middlewares/Server').Server,
    // mongo
    //mongoUri = '',
    //collections = [""],
    //db = require("mongojs").connect(mongoUri, collections), // "username:password@example.com/mydb"

    // variables
    wss,

    // init express
    app = module.exports = express();

app.use(morgan('dev'));

// set view
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

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

app.use(require('./controllers/api/users.js'));
//app.use(require('./controllers/api'));

// lets run the Angular
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/js/app/index.html'));
});


//console.log(Users.simple.name);

app.server = http.createServer(app);
app.server.listen(3000);

// web services server start
wss = new Server({server: app.server});
wss = new Server({server: app.server});
wss.run();
