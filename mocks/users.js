var User = require('../middlewares/User.js').User;

// create initial users
availableUsers = {
    user: new User('user', 'SIMPLE'),
    admin: new User('admin', 'ADMIN')
}

module.exports.available = availableUsers;
