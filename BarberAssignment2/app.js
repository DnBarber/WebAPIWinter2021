var express = require('express');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var port = process.env.PORT || 5000;
var bodyparser = require('body-parser');

//Sets up our middleware to use in our application
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(__dirname));

//Connecting to mongodb database
mongoose.connect('mongodb://localhost:27017/asteroidGame',{
    useNewUrlParser:true
}).then(function(){
    console.log("Connected to MongoDB Database")
}).catch(function(err){
    console.log(err)
})

app.listen(port, function(){
    console.log("Connected on Port 5000");
});