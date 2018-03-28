var express = require('express');
var port = process.env.PORT || 8080;
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var xss = require("xss");
var bcrypt = require('bcrypt');
var salt = 10;
var jwt = require('jsonwebtoken');
var user = { name: 'Asarel Castellanos' };
const accountSid = 'AC50d5ef0cf130f2ec1d6aa8f871221768';
const authToken = '85c34197bc3c6c7c8b535d5b25e3a077';
const client = require('twilio')(accountSid, authToken);

//Schemas
var userSchema = require('./_models/userSchema');
var contactSchema = require('./_models/contactSchema');
var blogSchema = require('./_models/blogSchema');
var commentSchema = require('./_models/commentSchema');

//Connection to MLabs Database
mongoose.connect('mongodb://adminAsarel:wu4azare@ds213239.mlab.com:13239/portfolio-server', function(err, db){
    if (err) {
        console.log('Error Connecting with mLabs');
        process.exit(1);
        throw err
    } else {
        console.log('Connected to mLabs')
        commentCollection = db.collection("comments"),
        blogCollection = db.collection("blogs")
    }
});

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

//Santizing Inputs
var xssService = {
    sanitize: function (req, res, next) {
        var data = req.body;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = xss(data[key]);
            }
        }
        next();
    }
};

//Encrypting Passwords
var bcryptService = {
    hash: function (req, res, next) {
        bcrypt.hash(req.body.password, salt, function (err, res) {
            if (err) throw err;
            req.body.password = res;
            console.log(res)
            next();
        })
    }
};

//Saving and Adding Users
app.post('/admin/register', xssService.sanitize, bcryptService.hash, function (req, res) {
    var newUser = new userSchema(req.body);
    newUser.save(function (err, product) {
        if (err) throw err;
        console.log("User Saved!");
        res.status(200).send({
            type: true,
            data: 'Succesfully Registered'
        })
    });
});

//Login In
app.post('/admin/login', function (req, res) {
    User.findOne({ 'email': req.body.email }, 'password', function (err, product) {

        if (product === null) {
            res.status(200).send({
                type: false,
                data: 'User does not exist'
            })
        } else {
            bcrypt.compare(req.body.password, product.password, function (err, resp) {
                console.log(product.password)
                if (err) throw err;
                console.log(resp)
                if (resp) {
                    const token = jwt.sign({ user }, 'secret_key', { expiresIn: '300s' });
                    console.log("user's token: ", token);
                    res.status(200).send({
                        type: true,
                        data: 'User Logged In!',
                        token: token
                    })
                } else {
                    res.status(200).send({
                        type: false,
                        data: 'Password is incorrect'
                    })
                }
            })
            if (err) throw err;
            console.log(product)
        }

    })

});

//Submitting Contact Request Forms
app.post('/contactFormSubmit', xssService.sanitize, function (req, res) {
    var contactForm = new contactSchema(req.body);
    contactForm.save(function (err, product) {
        if (err) throw err;
        client.messages
            .create({
                to: '+13235721018',
                from: '+17208097550',
                body: 'Name: ' + contactForm.userName + ',\nEmail: ' + contactForm.userEmail + ',\nPhone Number: ' + contactForm.userPhoneNumber + ',\nComments: ' + contactForm.userComments
            })
            .then(message => {
                console.log(message.sid)
                res.status(200).send({
                    type: true,
                    data: 'Form Information Submitted to Database!'
                })
            })
            .catch((err) => {
                if (err) throw err;
            })
            
    });
});

//Posting Blogs
app.post('/postBlog', function (req, res) {
    var newBlog = new blogSchema(req.body);
    newBlog.save(function (err, product) {
        if (err) throw err;
        console.log("Blog Saved!");
        res.status(200).send({
            type: true,
            data: 'Successfully Added New Blog'
        })
    });
});

//Getting Blogs to dynamically display
app.get('/postBlog', function (req, res) {
    var id = req.headers.headerid
    id = mongoose.Types.ObjectId(id);
    blogSchema.findOne({
        _id: id
    }, function(err, data){
        if(err) throw err;
        res.status(200).send(data);
    })
});

// Add Comments
app.post('/postComment', function (req, res) {
    var newComment = new commentSchema(req.body);
    newComment.save(function(err, product){
        if (err) throw err;
        console.log("Comment Saved!");
        res.status(200).send({
            type: true,
            data: "Successfully Added New Comment"
        })
    });
});

// Getting Comments to dynamically display
app.get('/postComment', function(req, res){
    commentCollection.find({ discussionId : req.headers.id }).toArray(function(err, docs){
        if (err){
            throw err;
            res.sendStatus(500);
        } else {
            var result = docs.map(function(data){
                return data;
            })
            res.json(result);
        }
    })
});

app.listen(port, function () {
    console.log('listening on port: ', port);
})