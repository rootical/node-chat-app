/*jslint node: true nomen: true */ // nomen stands for nomenclature

var crypto = require('crypto'),
    randomColor = require('randomcolor'),
    _ = require('private-parts').createKey();


function Anonym(name) {
    'use strict';

    this.name = name;

     // private map of available fields
    _(this).userDataMap = ['name', 'role', 'language'];
}

Anonym.prototype = {
    name: '',
    role: 'ANONYMOUS',
    language: '',

    // getters
    getUserData: function () {
        'use strict';

        var result = {},
            key,
            element;

        for (key in _(this).userDataMap) {
            if (_(this).userDataMap.hasOwnProperty(key)) {
                element = _(this).userDataMap[key];
                result[element] = this[element];
            }
        }

        return result;
    }
};

function User(name, role) {
    'use strict';

    Anonym.call(this, name);

    // private map of available fields
    _(this).userDataMap = ['name', 'email', 'role', 'color', 'language'];

    this.role = role || 'SIMPLE';

    this.setColor();
}

User.prototype = Object.create(Anonym.prototype, {
    password: {
        value: null,
        enumerable: true,
        configurable: true,
        writable: true
    },
    email: {
        value: '',
        enumerable: true,
        configurable: true,
        writable: true
    },
    color: {
        value: '',
        enumerable: true,
        configurable: true,
        writable: true
    },

    // setters

    setPassword: {
        value: function (decryptedPassword) {
            'use strict';

            var md5sum = crypto.createHash('md5');
            md5sum.update(decryptedPassword);
            this.password = md5sum.digest('hex');
        }
    },

    setColor: {
        value: function () {
            'use strict';

            this.color = randomColor({
                luminosity: 'dark'
            });
        }
    }
    // getters

});

module.exports.Anonym = Anonym;
module.exports.User = User;
