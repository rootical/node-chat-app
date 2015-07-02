/*jslint node: true */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    messageSchema,
    Message;


messageSchema = new Schema({
    author: {type: String, required: true},
    text: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    hidden: {type: Boolean, default: false}
});


Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
