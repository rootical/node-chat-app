var request = require('request'),
    http = require('http'),

    Requester = function () {
        this.get = function (method, path, body, callback) {
            console.log(path);
            request[method]({url: 'http://localhost:3000' + path, body: body}, callback);
        }
    };

exports.withServer = function (callback) {
    asyncSpecWait();

    var app = require('../application.js'),
        stopServer;

    app.server.listen(3000);

    stopServer = function () {
        app.server.close();
        asyncSpecDone();
    }

    callback(new Requester(), stopServer);
}
