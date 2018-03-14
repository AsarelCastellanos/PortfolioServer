var express = require('express');
var port = process.env.PORT || 8080;
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var xss = require("xss");

mongoose.connect('mongodb://adminAsarel:wu4azare@ds213239.mlab.com:13239/portfolio-server');
mongoose.connection.on('error', function(err) {
    if (err) throw err;
});

var Schema = mongoose.Schema;
var userSchema = new Schema({
    firstName : String,
    lastName : String,
    password: String,
    email : String,
    pic : {
        type : String,
        default :'./assets/images/asarel.jpg'
    },
    created :{
        type: Date,
        default : Date.now()
    },
    modified : {
        type: Date,
        default : Date.now()
    }
});

var User = mongoose.model('user', userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

var xssService = {
    sanitize: function (req, res, next) {
        var data = req.body
        for(var key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = xss(data[key]);
                console.log(data[key]);
            }
        }
        next();
      }
}

app.post('/admin/register', xssService.sanitize, function(req,res){
    res.status(200).send('test');
    // var newUser = new User(req.body);
    // newUser.save(function(err,product){
    //     if(err) throw err;
    //     console.log("User Saved!");
    //     res.status(200).send({
    //         type: true,
    //         data: 'Succesfully Registered'})
    //     });
    });

app.post('/admin/login', function(req, res){
User.findOne({ 'email': req.body.email }, 'password', function (err, product){
  if (err) throw err;
    console.log(product);
    if (product === null){
        res.status(200).send({
            type: false,
            data: 'Email does not exist'
    })
    
 } else {
        if (req.body.password === product.password){
            res.status(200).send({
                type: true,
                data: 'Hello World!'
            })
        } else {
            res.status(200).send({
                type: false,
                data: 'Try Again.'
            })
    
        }
    }


})
})

app.listen(port,function (){
    console.log('listening on port: ',port);
})