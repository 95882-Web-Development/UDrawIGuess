'use strict';

var User = require('../model/user').User;
var Picture = require('../model/picture').Picture;
var path    = require("path");
var globals = require('../model/global'); //<< globals.js path
var nodemailer = require('nodemailer');
var History = require('../model/history').History;
/** create function to create Company. */

exports.signup = function (req, res) {
    User.get({username: req.body.username}, function(err, result){
        if(!err){
            if(result !== null){
                return res.json({error: 'user is exised'}); // 500 error
            }else{
                var newUser = req.body;
                newUser.guess_num = 0;
                newUser.guess_correct_num = 0;
                newUser.liked_by_num = 0;
                newUser.bookmarked_by_num = 0;
                newUser.bookmark_num =0;
                User.create(newUser, function(err, result) {
                    if (!err) {
                        globals.user = result;
                        // globals.user= user;
                        return res.redirect('/frontend/globalStream.html');
                    } else {
                        return res.json({code:1,message: 'user is exised',user_id:globals.user._id}); // 500 error
                    }
                });
            }
        }else{
            return res.send(err);
        }
    })

};

exports.login = function (req, res) {
    User.get({$or:[{username: req.body.username},{email:req.body.username}]}, function(err, result){
        if(!err){
            if(result !== null){
                // req.session.user = result;
                globals.user = result;

                var history = new Object();
                history.record = Date() + " User: " + globals.user.username + "-- Log in";
                history.user_id = globals.user._id;
                History.create(history, function(){
                });
                //return res.render({code:0, message: 'success',user_id:result._id}); // 500 error
                return res.redirect('/frontend/globalStream.html');
            }else{
                return res.json({code:1,message: 'log in error'}); // 500 error
            }
        }else{
            return res.send(err);
        }
    })
}

exports.logout = function (req, res){
    var history = new Object();
    history.record = Date() + "User: " + globals.user + "-- log out" ;
    history.user_id = globals.user._id;
    History.create(history, function(){
    });
    globals.user = undefined;
    return res.json({code:0, message:"success"});
}
/** getCompany function to get Company by id. */
exports.get_user = function (req, res) {
    console.log(req.params.user_id);
    User.get({_id: req.params.user_id}, function(err, result) {
        if (!err) {
            if(result == null){
                return res.json({message:"user is not found"});
            }
            if(req.params.user_id == globals.user._id) {
                return res.json({code: 1, message: "this is me"});
            }
            var history = new Object();
            history.record = Date() + "User: " + globals.user.username + "-- go to user: " + result +"'s page" ;
            history.user_id = globals.user._id;
            History.create(history, function(){
            });

            var data = new Object();
            data.user_id = result._id;
            data.username = result.username;
            data.liked_by_num = result.liked_by_num;
            data.bookmarked_by_num = result.bookmarked_by_num;
            data.following_num = result.following.length;
            data.follower_num = result.follower.length;
            data.check_follow = 0;
            data.pictures = [];
            for(var i = 0; i < result.follower.length; i++){
                if(result.follower[i] == globals.user._id)
                    data.check_follow= 1;
            }
            var count = 0;
            var draw_num = result.pictures_draw.length;
            for(var i = 0; i < draw_num; i++){
                Picture.get({_id: result.pictures_draw[i]}, function(err, result) {
                    if (!err) {
                        data.pictures.push(result);
                        count++;
                        if(count == draw_num) {
                            console.log(data);
                            return res.json(data);
                        }
                    } else {
                        return res.send(err); // 500 error
                    }
                });
            }
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.getAll = function (req, res){
    User.getAll({},function(err, result){
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.do_follow = function(req, res){
    User.get({_id:req.params.user_id}, function(err, result) {
        if(!err){
            var history = new Object();
            history.record = Date() + "User: " + globals.user.username + "-- follow user: " + result ;
            history.user_id = globals.user._id;
            History.create(history, function(){
            });

            result.follower.push(globals.user._id);
            User.updateById(req.params.user_id,result,function(err, result){
                if(!err) {
                    User.get({_id:req.params.user_id}, function(err, result) {
                        if(!err){
                            globals.user.following.push(req.params.user_id);
                            User.updateById(globals.user._id,globals.user,function(err, result){
                                if(!err){
                                    return res.json({code:0, message:"success"});
                                }else{
                                    return res.send(err);
                                }
                            });
                        }
                    });
                }// 500 error
                else{
                    return res.send(err);
                }
            });
        }
    });
};

exports.do_unfollow = function(req, res){
    User.get({_id:req.params.user_id}, function(err, result) {
        var flag = 0;
        if(!err){
            var history = new Object();
            history.record = Date() + "User: " + globals.user.username + "-- unfollow user: " + result ;
            history.user_id = globals.user._id;
            History.create(history, function(){
            });

            for(var i = 0; i < result.follower.length; i++){
                if(result.follower[i]  == globals.user._id){
                   result.follower.splice(i,1);
                    break;
                }
            }

            User.updateById(req.params.user_id,result,function(err, result){
                if(!err) {
                    flag ++;
                    if(flag == 2){
                        return res.json({code:0, message:"success"});
                    }
                }
                else{
                    return res.send(err);
                }
            });

            for(var i = 0; i < globals.user.following.length; i++){
                if(globals.user.following[i] == req.params.user_id) {
                    globals.user.following.splice(i, 1);
                    break;
                }
                // globals.user.following.push(req.params.user_id);
            }
        }
            User.updateById(globals.user._id,globals.user,function(err, result){
                if(!err){
                    flag ++;
                    if(flag == 2){
                        return res.json({code:1, message:"success"});
                    }                }else{
                    return res.send(err);
                }
        });
    });
};

exports.show_followlist = function(req, res) {
    var history = new Object();
    history.record = Date() + "User: " + globals.user.username + "show follow list" ;
    history.user_id = globals.user._id;
    History.create(history, function(){
    });
    User.get({_id: globals.user.id}, function (err, result) {
        if (!err) {
            var count = 0;
            var data = new Object();
            var length = result.following.length + result.follower.length;
            if(result.following.length + result.follower.length == 0)
                return res.json({});
            data.follower = [];
            data.following = [];
            for (var i = 0; i < result.following.length; i++) {
                User.get({_id: result.following[i]}, function (err, result) {
                    data.following.push(result);
                    count++;
                    if(count === length)
                    {
                        return res.json(data);
                    }
                });
            }

            for (var i = 0; i < result.follower.length; i++) {
                User.get({_id: result.follower[i]}, function (err, result) {
                    data.follower.push(result);
                    count++;
                    if(count === length) {
                        return res.json(data);
                    }
                });
            }
        } else {
            return res.send(err);
        }
    });
}

exports.do_like = function(req, res){

    Picture.get({_id:req.params.picture_id}, function(err, result) {
        if(!err && result != null){

            var history = new Object();
            history.record = Date() + "User: " + globals.user.username + "-- like picture: " + result ;
            history.user_id = globals.user._id;
            History.create(history, function(){
            });


            result.like_users.push(globals.user._id);
            result.like_num ++;
            Picture.updateById(req.params.picture_id,result,function(err, result){
                if(!err) {
                    return res.json({code:0, message:"success"});
                }// 500 error
                else{
                    return res.send(err);
                }
            });
        }
    });
};

exports.do_dislike = function(req, res){
    Picture.get({_id:req.params.picture_id}, function(err, result) {
        if(!err){
            var history = new Object();
            history.record = Date() + "User: " + globals.user.username + "-- unlike picture: " + result ;
            history.user_id = globals.user._id;
            History.create(history, function(){
            });

            for(var i = 0; i < result.like_users.length; i++)
            {
                if(result.like_users[i] == globals.user._id){
                    result.like_users.splice(i,1);
                    result.like_num --;
                    result.has_like = 0;
                }
            }
            Picture.updateById(req.params.picture_id,result,function(err, result){
                if(!err) {
                    console.log(result);
                    return res.json({code:0, message:"success"});
                }// 500 error
                else{
                    return res.send(err);
                }
            });
        }
    });
};

exports.add_bookmarks = function(req, res){
    User.get({_id:globals.user._id}, function(err, result) {
        if(!err){
            var history = new Object();
            history.record = Date() + "User: " + globals.user.username + "-- add a bookmark: " ;
            history.user_id = globals.user._id;
            History.create(history, function(){
            });

            var user = result;
            user.pictures_mark.push(req.params.picture_id);
            user.bookmarked_by_num++;
            User.updateById(globals.user._id,user,function(err, result){
                if(!err) {
                    console.log("global user" + user);
                    globals.user = user;
                    Picture.get({_id:req.params.picture_id}, function(err, result){
                        result.bookmark_num++;
                        Picture.updateById(req.params.picture_id, result, function(err, result){
                            if(!err){
                                return res.json({code:0,message:'success'});
                            }else{
                                return res.send(err);
                            }
                        });
                    });
                }// 500 error
                else{
                    return res.send(err);
                }
            });
        }
    });
}

exports.show_bookmarks = function(req, res){
    var history = new Object();
    history.record = Date() + "User: " + globals.user.username + "-- show bookmark list: " ;
    history.user_id = globals.user._id;
    History.create(history, function(){
    });

    User.get({_id: globals.user.id}, function (err, result) {
        if (!err) {
            var data = new Object();
            var count = 0;
            data.pictures = [];
            var length = result.pictures_mark.length
            if(length == 0)
                return res.json({});
            for (var i = 0; i < length; i++) {
                Picture.get({_id: result.pictures_mark[i]}, function (err, result) {
                    if(result!=null){
                        data.pictures.push(result);
                    }
                    count++;
                    if(count == length)
                        return res.json(data);
                });
            }
        }else{
            return res.send(err);
        }
    });
};

exports.invite = function(req, res){
    var history = new Object();
    history.record = Date() + "User: " + globals.user.username + "-- send a invitation: " ;
    history.user_id = globals.user._id;
    History.create(history, function(){
    });

    var email = req.body.email;
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'jasoncmu2016@gmail.com', // Your email id
            pass: 'chenjiasen' // Your password
        }
    });
    var text = 'UDrawIGuess Invitaion from \n\n' + globals.user.username;
    var mailOptions = {
        from: 'jasoncmu2016@gmail.com', // sender address
        to: email, // list of receivers
        subject: text, // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
}

exports.search = function(req, res){
    var history = new Object();
    history.record = Date() + "User: " + globals.user.username + "-- search: " + req.body.input;
    history.user_id = globals.user._id;
    History.create(history, function(){
    });
    var input = req.body.input;
    var inputs = input.split(' ');
    var code = 0;
    for(var i = 0; i < inputs.length; i++){
        if(inputs[i].indexOf("'") != -1){
            code = 11;
            var name = inputs[i].substring(0,inputs[i].indexOf("'"));
            console.log("name: "+ name);
            User.get({username:name},function(err, result){
                if(!err && result != null){
                    return res.json({code:code, user_id: result.user_id});
                }
            });
        }else if(inputs[i] == 'friend'){
            return res.json({code : 12});
        }else if(inputs[i] == 'bookmark'){
            return res.json({code:13});
        }
    }
}

exports.show_history = function(req, res){
    History.getAll({user_id:globals.user._id},function(err, result) {
        if(!err){
            return res.json(result);
        }
    })
}
/** updateCompany function to get Company by id. */
exports.update = function (req, res) {
    console.log(req.params.id);
    User.updateById(req.params.id, req.body, function(err, result) {
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
    User.removeById({_id: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            console.log(err);
            return res.send(err); // 500 error
        }
    });
};
