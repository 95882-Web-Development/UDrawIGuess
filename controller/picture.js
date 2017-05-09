'use strict';

var Picture = require('../model/picture').Picture;
var User = require('../model/user').User;
var globals = require('../model/global'); //<< globals.js path
var History = require('../model/history').History;

exports.get_global = function (req, res){
    var history = new Object();
    history.record = Date() + "-- User: " + globals.user.username + "-- get Global Stream page";
    history.user_id = globals.user._id;
    History.create(history, function(){
    });
    Picture.getAll({},function(err,result){
        var pictures = result;
        if(!err){
            User.getAll({},function(err, result){
                var data = new Object();
                data.my_id = globals.user._id;
                data.ranking = [];
                result.forEach(function(item, index){
                    data.ranking.push({user_id:item._id,username:item.username})
                });

                for(var i = 0; i < pictures.length; i++){
                    for(var j = 0; j < pictures[i].like_users.length; j++){
                        if(pictures[i].like_users[j] == globals.user._id){
                            pictures[i].has_like = 1;
                        }
                    }
                    console.log(globals.user._id);
                    for(var j = 0; j < globals.user.pictures_mark.length; j++){
                        if(pictures[i]._id == globals.user.pictures_mark[j]){
                            pictures[i].has_bookmark = 1;
                        }
                    }
                }

                data.pictures = pictures;
                return res.json(data);
            });
        }else{
            return res.send(err); // 500 error
        }
    })
}

exports.get_no_signup_global = function(req, res){
    Picture.getAll({},function(err,result){
        var pictures = result;
        if(!err){
            var data = new Object();
            data.ranking = [];
            result.forEach(function(item, index){
                data.ranking.push({user_id:item._id,username:item.username})
            });
            var index = pictures.length < 20? pictures.length:20;
            var number = pictures.length < index? 0:pictures.length-index;
            pictures.splice(index,number);
            data.pictures = pictures;
            return res.json(data);
        }
    })
}

exports.get_mine = function (req, res){
    var history = new Object();
    history.record = Date() + "User: " + globals.user.username + "-- get my page";
    history.user_id = globals.user._id;
    History.create(history, function(){
    });
    Picture.getAll({user_id:globals.user._id},function(err,result){
        if(!err){
            var data = new Object();
            for(var i = 0; i < result.length; i++){
                for(var j = 0; j < result.like_users; j++){
                    if(result[i].like_users[j] == globals.user._id){
                        result[i].has_like = 1;
                    }
                }
            }
            for(var i = 0; i < result.length; i++){
                for(var j = 0; j < globals.user.pictures_mark.length; j++){
                    if(result[i]._id == globals.user.pictures_mark[j]){
                        result[i].has_bookmark = 1;
                    }
                }
            }
            data.pictures = result;
            data.my_id = globals.user._id;
            data.username = globals.user.username;
            data.following_num = globals.user.following.length;
            data.follower_num = globals.user.follower.length;
            data.guess_num = globals.user.guess_num;
            data.guess_correct_num = globals.user.guess_correct_num;
            return res.json(data);
        }else{
            return res.send(err); // 500 error
        }
    })
}

/** create function to create Company. */
exports.picture_submit = function (req, res) {
    var history = new Object();
    history.record = Date() + "-- User: " + globals.user.username + "-- submit a picture";
    history.user_id = globals.user._id;
    History.create(history, function(){
    });

    console.log("request: " + req.body.tag);
    console.log("userid  "+globals.user._id);
    var data = req.body;
    data.user_id = globals.user._id;
    data.username = globals.user.username;
    data.like_num = 0;
    data.bookmark_num = 0;
    data.has_like = 0;
    data.has_bookmark = 0;
    Picture.create(data, function(err, result) {
        if (!err) {
            globals.user.pictures_draw.push(result.id);
            User.updateById(globals.user._id,globals.user,function(err,result){
                if(!err){
                    return res.json({code:0, message:"success"});
                }
                else{
                    return res.send(err);
                }
            });
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.get_keyword = function(req, res){
    if(globals.user!=undefined){
        var history = new Object();
        history.record = Date() + "-- User: " + globals.user.username + "-- get a key word";
        history.user_id = globals.user._id;
        History.create(history, function(){
        });

    }
    var words = ["apple", "umbrella", "banana", "computer","watermelon","ice cream","T-shirt"]
    var min = 0;
    var max = words.length;
    var index = Math.floor(Math.random() * (max - min)) + min;
    console.log(words[index]);
    return res.json({'keyword':words[index]});
}

exports.check_answer = function(req, res){
    if(globals.user!=undefined){
        var history = new Object();
        history.record = Date() + "-- User: " + globals.user.username + "-- check answer";
        history.user_id = globals.user._id;
        History.create(history, function(){
        });
    }

    var guess_word = req.body.guess_word;
    guess_word = guess_word+"";
    guess_word = guess_word.replace(/\s/g, '');
    guess_word = guess_word.toLowerCase();
    Picture.get({_id:req.body.picture_id}, function(err, result){
        var code = 1;
        if(!err && result != null){
            if(result.keyword == "T-shirt"){
                if(guess_word == 't-shirt' || guess_word == 'tshirt'){
                    code = 0;
                }
            }
            if(result.keyword == req.body.guess_word){
                code = 0;
            }
            return res.json({code:code,keyword: result.keyword});
        }
    });
}

/** getCompany function to get Company by id. */
exports.get_picture = function (req, res) {
    console.log(req.params.picture_id);
    Picture.get({_id: req.params.picture_id}, function(err, result) {
        if (!err) {
            var history = new Object();
            history.record = Date() + "-- User: " + globals.user.username + "-- get a picture: " + result;
            history.user_id = globals.user._id;
            History.create(history, function(){
            });
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};



/** getCompany function to get Company by id. */
exports.get = function (req, res) {
    console.log(req.params.picture_id);
    Picture.get({_id: req.params.picutre_id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.getAll = function (req, res){
    Picture.getAll({},function(err, result){
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};
/** updateCompany function to get Company by id. */
exports.update = function (req, res) {
    console.log(req.params.id);
    Picture.updateById(req.params.id, req.body, function(err, result) {
        console.log(req.params.id);
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

/** removeCompany function to get Company by id. */
exports.delete = function (req, res) {
    Picture.removeById({_id: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            console.log(err);
            return res.send(err); // 500 error
        }
    });
};
