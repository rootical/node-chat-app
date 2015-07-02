/*jslint node: true */

var WSServer = require('ws').Server,

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

Server.prototype.incoming = function (message) {
    'use strict';
    console.info('Server.js: Incoming message "%s"', message);

    // TODO: save into db

    // broadcast to all users
    this.broadcast.call(this, message);
};

Server.prototype.broadcast = function (data) {
    'use strict';
    console.info('Server.js: Broadcasting message');

    this.wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

module.exports.Server = Server;
