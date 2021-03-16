var express = require('express');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
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

//Load in Database Template for Score
require('./ScoreModel');
var Score = mongoose.model('score');

//POST Route 
app.post('/saveHighScore',function(req,res){
    console.log("Request Made");
    console.log(req.body);

    new Score(req.body).save().then(function(){
        res.redirect('scorePage.html');
    })

});

//Recieves data from database
app.get('/getData', function(req, res){
    Score.find({}).then(function(score){
        res.json({score})
    })
})

app.listen(port, function(){
    console.log("Connected on Port 3000");
});