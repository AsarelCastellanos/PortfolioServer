var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create Contact - Schema
var contactSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPhoneNumber: {
        type: String,
        required: false
    },
    userComments: {
        type: String,
        required: true
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

var ContactForm = mongoose.model('contactform', contactSchema);
module.exports = ContactForm;