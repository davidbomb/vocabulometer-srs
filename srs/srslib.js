const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const srslib = require("./srslib.js")
/*const libSportzones = require("./lib/sportzones/sportzones.js")
const libMiddlewares = require("./lib/middlewares/middlewares.js")
const libAdmins = require("./lib/admins/admins.js")*/

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId();

const MONGO_ADDRESS = "ds151820.mlab.com:51820/vocabulometer-dev"

const S0 = 1/3600,
    S1 = 1/3600 * 10,
    S2 = 1/3600 * 600,
    S3 = 12,
    S4 = 72,
    S5 = 102;
const SPACING = [S0, S1, S2, S3, S4, S5];

mongoose.connect("mongodb://" + MONGO_ADDRESS, {user: 'clejacquet', pass: 'clejacquet-imp'});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("Connected to the database...");
});




app.use(bodyParser.urlencoded( { extended: false}));
app.use(bodyParser.json())

//app.use(libMiddlewares.Cors);
var SrsSchema = mongoose.Schema;
var SrsSchema = new SrsSchema({
    word: { type: String, required: true},
    readNb: { type: Number, required: true, default: 0 },
    lv: { type: Number, required: true, default: 0 },
    testSuccess: { type: Number, default: 0},
    lastSeen : { type: Date, default: 0},
    userId : { type: String, default: '1'}
});
var Srs = mongoose.model("srs", SrsSchema);







function readWord(word_id) {
    var time = new Date()/*.toISOString()*/;
    Srs.findOneAndUpdate({'_id': word_id},
        {
            $set:{'lastSeen': time},
            $inc: {'readNb': 1 }
        },
        function(err, doc){
            if (err) return console.error(err);
            else {
                if(doc.lv === 0) lvUp(doc._id);
                if(doc.lv === 1 && doc.readNb >= 5) lvUp(doc._id);
                //if(doc.lv === 2 && doc.readNb >= 12 && doc.testSuccess >= 1) lvUp(doc._id);
                //if(doc.lv === 3 && doc.readNb >= 18 && doc.testSuccess >= 2) lvUp(doc._id);
                //if(doc.lv === 4 && doc.readNb >= 25 && doc.testSuccess >= 5) lvUp(doc._id);
                console.log("Word read");
                console.log(time)
            }
        });
}

function lvUp(id) {
    var newlv = 0;
    Srs.findOne({'_id': id},function(err,doc){ //mettre le findone and update dans le callback
        if(err) return console.error(err)
        else newlv = doc.lv + 1;
    })
    Srs.findOneAndUpdate({'_id': id},
        {$inc: {'lv': 1 }},
        function(err, doc){
            if (err) return console.error(err);
            else {
                console.log("Word level up: lv " + newlv);
            }
        });
}

function lvDown(id) {
    Srs.findOneAndUpdate({'_id': id},
        {$inc: {'lv': -1 }},
        function(err, doc){
            if (err) return console.error(err);
            else console.log("Word level down");
        });
}

function succeedTest(word_id) {
    var time = new Date()
    Srs.findOneAndUpdate({'_id': word_id},
        {$inc: {'testSuccess': 1 }},
        {$set:{'lastSeen': time}},
        function(err, doc){
            if (err) return console.error(err);
            else {
                if(doc.lv === 2 && doc.readNb >= 12 && doc.testSuccess >= 1) lvUp(doc._id);
                if(doc.lv === 3 && doc.readNb >= 18 && doc.testSuccess >= 2) lvUp(doc._id);
                if(doc.lv === 4 && doc.readNb >= 25 && doc.testSuccess >= 5) lvUp(doc._id);
                if(doc.lv === 5 && doc.testSuccess >= 6) removeWordFromSrs(doc._id)    // the word fit the condition to leave the srs
                console.log("test succeeded");
            }
        });
}

function failTest(id) {
    Srs.findOneAndUpdate({'_id': id},
        {$set: {'testSuccess': 0 }},
        function(err, doc){
            if (err) return console.error(err);
            else {
                if(doc.lv >= 3) lvDown(doc._id);
                console.log("test failed");
            }
        });
}






function findAllSrsWords(user_id){ //return all words of a specific user
    return new Promise((resolve, reject) => {
        Srs.aggregate( [
            { $match: { userId: user_id  } }], function (err, result) {
            if (err) return reject(err);
            if (result.length){
                return resolve(result)
            }
        });
    })
}

function timeDiff(dateold, datenew)
{
    var ynew = datenew.getFullYear();
    var mnew = datenew.getMonth();
    var dnew = datenew.getDate();
    var yold = dateold.getFullYear();
    var mold = dateold.getMonth();
    var dold = dateold.getDate();
    var diff = datenew - dateold;
    if(mold > mnew) diff--;
    else
    {
        if(mold == mnew)
        {
            if(dold > dnew) diff--;
        }
    }
    return diff;
}
function findWordsByLastSeen(user_id, time){ //find all words that haven't be since since timeLastSeen
    return new Promise((resolve, reject) => {
        var currentDate = new Date();
        var idList = [];
        console.log("last seen")
        console.log(user_id)
        Srs.aggregate([
            {$match: {userId: user_id}}], function (err, result) {
            if (err) console.log(err);
            if(result.length) {
                console.log(result)
                for (let i = 0; i < result.length; i++) {
                    if (timeDiff(result[i].lastSeen, currentDate) > time * 3600 * 1000) {
                        //console.log(timeDiff(res[i].lastSeen, currentDate));
                        idList.push(result[i])
                        console.log(result[i])
                        //console.log(res[i].word)
                    }
                }
                if (!idList.length) console.log("No remaining words last seen");
                console.log("before resolve")
                return resolve(idList);
                }
            })
    })
}


module.exports = {

	getSrsSize: (req, res) => {
        var srsSize = 0;
        Srs.aggregate( [
            { $match: { userId: req.params.user_id  } },
            { $group: { _id: null, count: { $sum: 1 }}}], function (err, result) {
            if (err) return console.log(err);
            else { console.log("heyyy");
                res.json(result[0].count)}
        })
    },





    findWordIdByUserId: (req, res) => { //return word_id with word and userid
		console.log("enter")
		Srs.aggregate( [
			{ $match: { userId: req.params.user_id  } },
			{ $match: { word: req.params.word } } ], function (err, result) {
			if (err) console.log(err);
			if (result.length){
			    console.log("res enter")
                console.log(result)
				//word_id = result[0]._id;
				//console.log("word _id: " + word_id);
				//return result[0]._id;
				res.json(result[0]._id)
			}
			if(!result.length) {
                console.log("couldn't find word")
                res.send("No such word exists")
            }
		});
	},


    //middleware
    findAllSrsWords: (req,res, next) => { //return all words of a specific user
        Srs.aggregate( [
            { $match: { userId: req.params.user_id } }], function (err, result) {
            if (err) console.log(err);
            if (result.length){
                if(req.params.time){ next() }
                res.json(result);
            }
        })
    },



    findWordsByLastSeen: (req, res) => { //find all words that haven't be since since timeLastSeen
        var currentDate = new Date();
        var idList = [];
        var time = req.params.time;
        console.log(time)
        findAllSrsWords(req.params.user_id)
            .then( result => {
                if(result.length){
                    console.log("hey")
                    for(let i = 0; i < result.length; i++){
                        if(timeDiff(result[i].lastSeen, currentDate) > time*3600*1000){
                            //console.log(timeDiff(res[i].lastSeen, currentDate));
                            idList.push(result[i])
                            console.log(result[i])
                            //console.log(res[i].word)
                        }
                    }
                    if(!idList.length) console.log("No remaining words last seen");
                    res.json(idList);
                }
                if(!result.length) res.send("No words last sees")
            })
    },



    findWordsToLearn: (req, res) => {
        var learningArray = [ [], [], [], [], [], [] ];

        for(let i = 0; i < 6; i++){
            findWordsByLastSeen(req.params.user_id, SPACING[i])
                .then( result => {
                    console.log("in then")
                    for(let j = 0; j < result.length; j++){
                        if(result[j].lv === i) {
                            learningArray[i].push(result[j]);
                        }
                    }
                    if(i === 5) res.json(learningArray);
                })
        }
        if(!learningArray.length) {
            console.log("No remaining words to learn");
            res.send("No remaining words to learn")
        }
    },



    removeWordFromSrs: (req, result) => {
        Srs.findOneAndRemove({ _id: req.params.word_id }, function(err, res){
            if(err) console.log("the word you are removing doesn't exists")
            if(res) {
                console.log("Word removed");
            }
            else { result.send("Word you want to remove doesn't exists") }
        })
    }







}
