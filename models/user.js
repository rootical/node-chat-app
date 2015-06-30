/*jslint node: true */

var crypto = require('crypto'),
    Users = {},
    User = {
        name: '',
        password: '',
        email: '',
        role: 'ANONYMOUS',

        setPassword: function (decryptedPassword) {
            'use strict';

            var md5sum = crypto.createHash('md5');
            md5sum.update(decryptedPassword);
            this.password = md5sum.digest('hex');
        },

        getData: function () {
            return {
                name: this.name,
                email: this.email,
                role: this.role
            }
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
    name:   { value: 'admin' },
    email:  { value: 'admn@example.com' }
});

Users.admin.setPassword('admin');

//create simple role
Users.user = Object.create(Simple, {
    name: { value: 'user' },
    email: { value: 'user@example.com' }
});

Users.user.setPassword('user');

module.exports.User = User;
module.exports.Users = Users;








