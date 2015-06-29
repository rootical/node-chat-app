/*jslint node: true */

var WSServer = require('ws').Server,

    Server = function (options) {
        'use strict';

        this.options = options;
    };


Server.prototype.run = function () {

    // create server
    var wss = new WSServer(this.options);

    // establish connection
    wss.on('connection', (this.connection.bind(this)));
};

Server.prototype.connection = function (ws) {
    'use strict';

    console.info('Server.js: Connection established');
    ws.on('message', this.incoming);

    ws.send('msg msg');
};

Server.prototype.incoming = function (message) {
    'use strict';

    console.info('Server.js: Incoming message "%s"', message);
};

module.exports.Server = Server;
