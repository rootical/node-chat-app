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
    text: String,
    created_at: {type: Date, "default": Date.now},
    updated_at: {type: Date, "default": Date.now},
    hidden: {type: Boolean, "default": false}
});

messageSchema.statics.getLastMessages = function getLastMessages(callback) {
    'use strict';

    var q = this.model('Messages')
                .find({hidden: false})
                .sort({'updated_at': -1})
                .limit(5),
        result = [];


    console.log(global.USERS);

    q.exec(function (err, data) {

        if (err) {
            throw err;
        }

        var user,
            anonymous = new Anonym();

        data.reverse().forEach(function (element) {

            user = availableUsers.hasOwnProperty(element.author) ? availableUsers[element.author] : anonymous;

            result.push({
                author:     element.author,
                content:    element.text,
                timestamp:  element.created_at,
                color:      user.color,
                role:       user.role,
                language:   element.language
            });
        });

        callback(result);
    });
};

Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
