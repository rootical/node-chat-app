/*jslint node: true nomen: true */ // nomen stands for nomenclature

var crypto = require('crypto'),
    randomColor = require('randomcolor'),
    _private = require('private-parts').createKey();

/**
 *
 * Anonym class constructor - base class for each user
 *
 * @param {String} name - user name
 */
function Anonym(name) {
    'use strict';

    this.name = name;

     // private map of available fields
    _private(this).userDataMap = ['name', 'role', 'language'];
}

Anonym.prototype.name = '';
Anonym.prototype.role = 'ANONYMOUS';
Anonym.prototype.language = '';

/**
 *
 *  Get package of all fields from this object according to map created in constructor.
 *
 */
Anonym.prototype.getUserData = function () {
    'use strict';

    var result = {},
        key,
        element;

    for (key in _private(this).userDataMap) {
        if (_private(this).userDataMap.hasOwnProperty(key)) {
            element = _private(this).userDataMap[key];
            result[element] = this[element];
        }
    }

    return result;
};

/**
 * User class constructor - advanced type of basic user
 *
 * @param {String} name - new user name
 * @param {String} role - privilages set name
 */
function User(name, role) {
    'use strict';

    Anonym.call(this, name);

    // private map of available fields
    _private(this).userDataMap = ['name', 'email', 'role', 'color', 'language'];

    this.role = role || 'SIMPLE';

    this.setColor();
}

/**
 *
 * User class prototype - instead of using node util.inherits I've used basic pattern to
 * show clean pseudoclassical inheritance
 *
 */
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

    /**
     *
     *  Creates MD5 hash to representing password
     *
     */
    setPassword: {
        value: function (decryptedPassword) {
            'use strict';

            var md5sum = crypto.createHash('md5');
            md5sum.update(decryptedPassword);
            this.password = md5sum.digest('hex');
        }
    },

    /**
     *
     *  Generates random, dark color for each user
     *
     */
    setColor: {
        value: function () {
            'use strict';

            this.color = randomColor({
                luminosity: 'dark'
            });
        }
    }
});

module.exports.Anonym = Anonym;
module.exports.User = User;
