var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create Comments - Schema
var commentSchema = new Schema({
    discussionId:String,
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    replies:[
        {
            name: {
                type: String,
                default:"Anonymous"
            },
            content: String
        }
    ],
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

var Comment = mongoose.model('comment', commentSchema)
module.exports = Comment;