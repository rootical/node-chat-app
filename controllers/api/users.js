/*jslint node: true */
'use strict';

var express = require('express'),
    router = express.Router(),

    routes = require('../../config/routes.js'),
    availableUsers = require('../../mocks/users.js').available,

    Anonym = require('../../middlewares/User.js').Anonym;

/**
 *
 * Get user by given id.
 *
 */
router.put(routes.users.put.users.path, function (req, res) {

    var currentUser,
        language;

    if (global.USERS.def[req.params.username]) {

        res.setHeader('Content-Type', 'application/json');
        res.status(403).send(JSON.stringify({error: 'Username exists in this conversation. Try another one.'}, null, 2));
        return;
    }

    if (availableUsers[req.params.username]) {
        currentUser = availableUsers[req.params.username];
    } else {
        currentUser = new Anonym(req.params.username);
    }

    global.USERS.def[req.params.username] = true;

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(currentUser.getUserData(), null, 2));

});


/**
 *
 * Delete user by given id.
 *
 */
router['delete'](routes.users['delete'].users.path, function (req, res) { // jsLint reports that delete as a reserved word

    delete global.USERS.def[req.params.username];

    console.info('API::users: unregistering user:', req.params.username);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({}, null, 2));

});


module.exports = router;
