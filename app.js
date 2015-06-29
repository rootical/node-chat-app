/*jslint node: true */

var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    http = require('http'),
    path = require('path'),

    Server = require('./middlewares/Server').Server,
    Users = require('./models/user.js').Users,

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
app.use(require('less-middleware')('/less', {
    debug: true,
    dest: '/css',
    pathRoot: path.join(__dirname, 'public'),
    force: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

//console.log(Users.simple.name);

app.server = http.createServer(app);
app.server.listen(3000);

wss = new Server({server: app.server});
wss.run();
