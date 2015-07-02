/*jslint node: true */

var WSServer = require('ws').Server,
    Message = require('../models/message.js'),
    Server;


// singleton with a cached static property
Server = function (options) {
    'use strict';

    if (typeof Server.instance === 'object') {
        return Server.instance;
    }

    this.options = options;
    console.info('Server.js: Creating WS server');

    Server.instance = this;

    return this;
};


Server.prototype.run = function () {
    'use strict';
    // create server
    this.wss = new WSServer(this.options);

    // establish connection
    this.wss.on('connection', (this.connection.bind(this)));
};

Server.prototype.connection = function (ws) {
    'use strict';

    console.info('Server.js: Connection established');
    ws.on('message', (this.incoming.bind(this)));
};

Server.prototype.incoming = function (msg) {
    'use strict';
    var message,
        msgObj = JSON.parse(msg);

    console.info('Server.js: Incoming message "%s"', msg);

    // save into DB
    Message.create({
        author: msgObj.user.name,
        text: msgObj.content
    }, function (err) {
        if (err) {
            throw err;
        }

        console.info('Server.js: Message has been saved into DB');
    });

    // broadcast to all users
    this.broadcast.call(this, msg);
};

Server.prototype.broadcast = function (data) {
    'use strict';
    console.info('Server.js: Broadcasting message');

    this.wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

module.exports.Server = Server;
