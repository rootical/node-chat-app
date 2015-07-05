/*jslint node: true */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Anonym = require('../middlewares/User.js').Anonym,
    availableUsers = require('../mocks/users.js').available,
    messageSchema,
    Message;


messageSchema = new Schema({
    author: {type: String, required: true},
    language: {type: String},
    content: String,
    created_at: {type: Date, "default": Date.now},
    updated_at: {type: Date, "default": Date.now},
    hidden: {type: Boolean, "default": false}
});

messageSchema.statics.getLastMessages = function getLastMessages(callback, limit) {
    'use strict';

    var q = this.model('Messages')
                .find({hidden: false})
                .sort({'updated_at': -1})
                .limit(limit || 5),
        result = [];

    q.lean().exec(function (err, data) {

        if (err) {
            throw err;
        }

        var user,
            result = [],
            anonymous = new Anonym();

        // assign user role and color for each record
        result = data.reverse().map(function (element) {

            user = availableUsers.hasOwnProperty(element.author) ? availableUsers[element.author] : anonymous;

            element.color = user.color;
            element.role = user.role;

            return element;

        });

        callback(result);
    });
};

Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
