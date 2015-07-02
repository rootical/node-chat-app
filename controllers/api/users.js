var express = require('express'),
    router = express.Router(),

    availableUsers = require('../../mocks/users.js').available,

    Anonym = require('../../middlewares/User.js').Anonym;

/*
    Get user by id.
*/
router.get('/api/users/:username', function(req, res) {

    var currentUser;

    if(availableUsers[req.params.username]) {
        currentUser = availableUsers[req.params.username];
    } else {
        currentUser = new Anonym(req.params.username);
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(currentUser.getUserData(), null, 2));

});


module.exports = router
