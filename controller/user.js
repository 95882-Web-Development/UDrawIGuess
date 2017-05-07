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
                        req.session.user = result;
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
                req.session.user = result;
                globals.user= result;
                console.log("login session id" + req.sessionID);
                // return res.render({code:0, message: 'success',user_id:result._id}); // 500 error
                return res.redirect('/frontend/globalStream.html');
            }else{
            }
        }else{
            return res.send(err);
        }
    })
}

exports.logout = function (req, res){

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
            result.follower.push(req.session.user._id);
            User.updateById(req.params.user_id,result,function(err, result){
                if(!err) {
                    User.get({_id:req.params.user_id}, function(err, result) {
                        if(!err){
                            console.log(result);
                        }
                    });
                    return res.json({code: 0, message: 'success', user_id: req.session.user._id});
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
    //         data.follower.push(req.session.user._id);
    //         User.updateById(req.param.user_id,data,function(err, result){
    //             if(!err) {
    //                 User.get({_id: req.params.user_id}, function(err, result) {
    //                     if(!err){
    //                         console.log(result);
    //                     }
    //                 });
    //                 return res.json({code: 0, message: 'success', user_id: req.session.user._id});
    //             }// 500 error
    //             else{
    //                 return res.send(err);
    //             }
    //         });
    //     } else {
    //         return res.send(err); // 500 error
    //     }
    // });
    // req.session.user.following.push(req.params.user_id);
    // User.updateById(req.session.user._id,req.session.user,function(err, result){
    //     if(!err){
    //
    //     }else{
    //         return res.send(err);
    //     }
    // });
};

exports.do_unfollow = function(req, res){

};

exports.show_followlist = function(req, res){

};

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
