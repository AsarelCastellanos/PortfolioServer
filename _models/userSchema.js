var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create User - Schema
var userSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String,
    pic: {
        type: String,
        default: './assets/images/asarel.jpg'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date,
        default: Date.now()
    }
});

var User = mongoose.model('user', userSchema);
module.exports = User;