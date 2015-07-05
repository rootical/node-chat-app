/*jslint node: true */

var express = require('express'),
    router = express.Router(),

    availableUsers = require('../../mocks/users.js').available,

    Anonym = require('../../middlewares/User.js').Anonym;

/*
    Get user by id.
*/
router.put('/api/users/:username', function (req, res) {
    'use strict';

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

    // at the end add browser language
    language = req.headers["accept-language"].split(';')[0].split(',')[0].split('-');
    currentUser.language = (language[1] || language[0] || '').toLowerCase();

    global.USERS.def[req.params.username] = true;

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(currentUser.getUserData(), null, 2));

});

router['delete']('/api/users/:username', function (req, res) { // jsLint reports that delete as a reserved word
    'use strict';

    delete global.USERS.def[req.params.username];

    console.info('API::users: unregistering user:', req.params.username);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({}, null, 2));

});


module.exports = router;
