var express = require('express'),
    router = express.Router(),
    users = require('../../models/user.js');


//router.use('/comments', require('./comments'));
//router.use('/users', require('./users'));

/*
    Get user by id.

*/
router.get('/api/users/:username', function(req, res) {

    var currentUser = users.User,
        availableUsers = users.Users;


    if(availableUsers[req.params.username]) {
        currentUser = availableUsers[req.params.username];
    } else {
        currentUser.name = req.params.username;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(currentUser.getData(), null, 2));

    /*
    res.render('index', {
        messages: [
            {
                author: 'Admin',
                content: 'M1',
                timestamp: '12:44'
            },
            {
                author: 'User',
                content: 'M2',
                timestamp: '12:45'
            }
        ]
    });
    */
});


module.exports = router
