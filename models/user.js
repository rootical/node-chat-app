/*jslint node: true */

var crypto = require('crypto'),
    randomColor = require('randomcolor'),
    Users = {},
    User = {
        name: '',
        password: '',
        email: '',
        role: 'ANONYMOUS',
        color: '#989898',

        setPassword: function (decryptedPassword) {
            'use strict';

            var md5sum = crypto.createHash('md5');
            md5sum.update(decryptedPassword);
            this.password = md5sum.digest('hex');
        },

        setColor: function () {
            'use strict';

            this.color = randomColor({
                luminosity: 'dark'
            });
        },

        getData: function () {
            'use strict';

            return {
                name: this.name,
                email: this.email,
                role: this.role,
                color: this.color
            };
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
Users.admin.setColor();

//create simple role
Users.user = Object.create(Simple, {
    name: { value: 'user' },
    email: { value: 'user@example.com' }
});

Users.user.setPassword('user');
Users.user.setColor();

module.exports.User = User;
module.exports.Users = Users;








