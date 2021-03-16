var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ScoreModel = new Schema({
    name:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required:true
    }
})

mongoose.model('score',ScoreModel);