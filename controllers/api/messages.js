/*jslint node: true nomen: true */
'use strict';

var express = require('express'),
    router = express.Router(),

    routes = require('../../config/routes.js'),
    Message = require('../../models/message.js');

/**
 *
 * Gets last messages to fill chat window with history
 *
 */
router.get(routes.messages.get.messages.path, function (req, res) {

    Message.getLastMessages(function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 3));
    });

});

/**
 *
 * Deletes message by its id
 *
 */
router['delete'](routes.messages['delete'].messages.path, function (req, res) {

    var wss = req.app.wss,
        message = {},
        result;

    message.content = 'Message has been deleted';
    message.type = 'del';
    message._id = req.params.id;

    Message.find({_id: message._id}).remove(function () {
        // broadcast information about action
        wss.broadcast(message, 'maintenance');

        res.setHeader('Content-Type', 'application/json');
        res.send(message);
    });
});

module.exports = router;
