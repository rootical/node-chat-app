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

    //console.info('Server.js passed options to constructor:', options);

    this.options = options;
    Server.instance = this;

    return this;
};


Server.prototype.run = function () {
    'use strict';
    console.info('Server.js: Creating WS server');

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
        msgObj = JSON.parse(msg),
        self = this;

    console.info('Server.js: Incoming message "%s"', msg);

    // if msg is maintenance do not save it just broadcast
    if (msgObj.broadcast === 'maintenance') {
        self.broadcast.call(self, msgObj, msgObj.broadcast);
        return;
    }

    // if message is has regular broadcast save it into DB
    Message.create({
        author: msgObj.user.name,
        content: msgObj.content,
        language: msgObj.user.location && msgObj.user.location.country ? msgObj.user.location.country.shortName : ''
    }, function (err, data) {
        if (err) {
            throw err;
        }

        data = data.toObject();
        data.color = msgObj.user.color;
        data.role = msgObj.user.role;

        // broadcast to all users
        self.broadcast.call(self, data);

        console.info('Server.js: Message has been saved into DB');
    });
};

Server.prototype.broadcast = function (data, type) {
    'use strict';
    console.info('Server.js: Broadcasting message');

    data.broadcast = type || 'regular';

    data = JSON.stringify(data);

    this.wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

module.exports.Server = Server;
