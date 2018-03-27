var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create Blog - Schema
var blogSchema = new Schema({
    author: {
        type: String,
        default: "Asarel Castellanos"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

var Blog = mongoose.model('blog', blogSchema);
module.exports = Blog;