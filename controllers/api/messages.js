/*jslint node: true */

var express = require('express'),
    router = express.Router(),
    Message = require('../../models/message.js');

// getters

router.get('/api/messages', function (req, res) {
    'use strict';

    Message.getLastMessages(function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 3));
    });

});

//TODO delete messages
router.delete('/api/messages/:id', function (req, res) {
    'use strict';

    res.setHeader('Content-Type', 'application/json');
    res.send('{data:"TODO"}');
});

module.exports = router;
