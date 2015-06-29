/*jslint node: true */

var crypto = require('crypto'),
    Users = {},
    User = {
        name: '',
        password: '',
        email: '',
        role: '',

        setPassword: function (decryptedPassword) {
            'use strict';

            var md5sum = crypto.createHash('md5');
            md5sum.update(decryptedPassword);
            this.password = md5sum.digest('hex');
        }
    },

    Admin = Object.create(User, {
        role: { value: 'ADMIN' }
    }),

    Simple = Object.create(User, {
        role: { value: 'SIMPLE' }
    });


// create admin role
Users.admin = Object.create(Admin, {
    name:   { value: 'Admin' },
    email:  { value: 'admn@example.com' }
});

Users.admin.setPassword('admin');

//create simple role
Users.simple = Object.create(Simple, {
    name: { value: 'User' },
    email: { value: 'user@example.com' }
});

Users.simple.setPassword('user');

module.exports.User = User;
module.exports.Users = Users;








