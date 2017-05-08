'use strict';

var User = require('../model/user').User;
var Picture = require('../model/picture').Picture;
var path    = require("path");
var globals = require('../model/global'); //<< globals.js path
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
                    } else {
                        return res.send(err); // 500 error
                    }
                    if(count == draw_num)
                        console.log(data);
                        return res.json(data);
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
    //
    // User.get({_id: req.params.user_id}, function(err, result) {
    //     if (!err) {
    //         var data = result;
    //         data.follower.push(globals.user._id);
    //         User.updateById(req.param.user_id,data,function(err, result){
    //             if(!err) {
    //                 User.get({_id: req.params.user_id}, function(err, result) {
    //                     if(!err){
    //                         console.log(result);
    //                     }
    //                 });
    //                 return res.json({code: 0, message: 'success', user_id: globals.user._id});
    //             }// 500 error
    //             else{
    //                 return res.send(err);
    //             }
    //         });
    //     } else {
    //         return res.send(err); // 500 error
    //     }
    // });
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
                        return res.json({code:1, message:"success"});
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
            if(result.following.length + result.follower.length == 0)
                return res.json({});
            data.follower = [];
            data.following = [];
            for (var i = 0; i < result.following.length; i++) {
                User.get({_id: result.following[i]}, function (err, result) {
                    data.following.push(result);
                    count++;
                    if(count === result.following.length + result.follower.length)
                    {
                        return res.json(data);
                    }
                });
            }

            for (var i = 0; i < result.follower.length; i++) {
                User.get({_id: result.follower[i]}, function (err, result) {
                    data.follower.push(result);
                    count++;
                    if(count === result.following.length + result.follower.length) {
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

};

exports.do_dislike = function(req, res){

};

exports.show_bookmarks = function(req, res){

};


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
