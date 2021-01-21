var express = require('express');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var bodyparser = require('body-parser');

//Sets up our middleware to use in our application
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

//Makes the connection to the database server
mongoose.connect('mongodb://localhost:27017/gameEntries',{
    useNewUrlParser:true
}).then(function(){
    console.log("Connected to MongoDB Database.");
}).catch(function(err){
    console.log(err);
});

//Load in database templates
require('./models/Game');
var Game = mongoose.model('game');

//Basic code for saving an entry 
/*var Game = mongoose.model('Game', {nameofgame:String});

var game = new Game({nameofgame:"Skyrim"});
game.save().then(function(){
    console.log("Game Saved.");
});*/

//Example of a POST route
app.post('/saveGame',function(req,res){
    console.log("Request Made");
    console.log(req.body);

    new Game(req.body).save().then(function(){
        res.redirect('gameList.html');
    })

});

//gets the data for the list
app.get('/getData', function(req,res){
    Game.find({}).then(function(game){
        res.json({game});
    });
});

//post route to delete game entries off the list
app.post('/deleteGame',function(req,res){
    console.log("Game Deleted", req.body._id);
    Game.findByIdAndDelete(req.body._id).exec()
    res.redirect('gameList.html');
});

app.use(express.static(__dirname+"/views"));

app.listen(3000, function(){
    console.log("Listening on port 3000.");
});