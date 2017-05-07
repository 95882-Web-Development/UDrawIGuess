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
                        res.redirect('/');
                    } else {
                        return res.json({error: 'user is exised'}); // 500 error
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
            }
        }else{
            return res.send(err);
        }
    })
}

exports.logout = function (req, res){
    console.log(req.session.user._id);

}
/** getCompany function to get Company by id. */
exports.get_user = function (req, res) {
    console.log(req.params.user_id);
    User.get({_id: req.params.user_id}, function(err, result) {
        if (!err) {
            return res.json(result);
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
    var data = new Object();
    User.get({_id:req.params.user_id}, function(err, result) {
        if(!err){
            result.email="ddd";
            result.follower.push(globals.user._id);
            User.updateById(req.params.user_id,result,function(err, result){
                if(!err) {
                    User.get({_id:req.params.user_id}, function(err, result) {
                        if(!err){
                            console.log(result);
                        }
                    });
                }// 500 error
                else{
                    return res.send(err);
                }
            });
        }
    });
    globals.user.following.push(req.params.user_id);
    User.updateById(globals.user._id,globals.user,function(err, result){
        if(!err){
            return res.send(result);
        }else{
            return res.send(err);
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
    var data = new Object();
    User.get({_id:req.params.user_id}, function(err, result) {
        if(!err){
            result.email="ddd";
            for(var i = 0; i < result.follower.length; i++){
                if(result.follower[i]  == globals.user._id){
                   result.follower.splice(i,1);
                    break;
                }
            }

            User.updateById(req.params.user_id,result,function(err, result){
                if(!err) {
                    User.get({_id:req.params.user_id}, function(err, result) {
                        if(!err){
                            console.log(result);
                        }
                    });
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
                    res.send('success');
                }else{
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
