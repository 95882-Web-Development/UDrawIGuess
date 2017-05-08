'use strict';

var User = require('../model/user').User;
var Picture = require('../model/picture').Picture;
var path    = require("path");
var globals = require('../model/global'); //<< globals.js path
var nodemailer = require('nodemailer');
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
    User.get({username: req.body.username}, function(err, result){
        if(!err){
            if(result !== null){
                // req.session.user = result;
                globals.user = result;
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
<<<<<<< Updated upstream
=======
                    if(count == draw_num) {
                        console.log(data);
                        return res.json(data);
                    }
>>>>>>> Stashed changes
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
            result.pictures_mark.push(req.params.picture_id);
            result.bookmarked_by_num ++;
            User.updateById(globals.user._id,result,function(err, result){
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
}

exports.show_bookmarks = function(req, res){
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
                    data.pictures.push(result);
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
        to: 'jasonvivi.chen@gmail.com', // list of receivers
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
