/*jslint node: true nomen: true */

var express = require('express'),
    router = express.Router(),
    Message = require('../../models/message.js'),
    Server = require('../../middlewares/Server').Server;

// getters

router.get('/api/messages', function (req, res) {
    'use strict';

    Message.getLastMessages(function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 3));
    });

});

router.delete('/api/messages/:id', function (req, res) {
    'use strict';

    var wss = new Server(),
        message = {},
        result;

    message.content = 'Message has been deleted';
    message._id = req.params.id;

    Message.find({_id: message._id}).remove(function () {
        // broadcast information about action
        wss.broadcast(message, 'maintanance');

        res.setHeader('Content-Type', 'application/json');
        res.send(message);
    });
});

module.exports = router;
