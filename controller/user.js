'use strict';

var User = require('../model/user').User;

/** create function to create Company. */
exports.signup = function (req, res) {
    User.get({username: req.body.username}, function(err, result){
        if(!err){
            if(result !== null){
                return res.json({error: 'user is exised'}); // 500 error
            }else{
                User.create(req.body, function(err, result) {
                    if (!err) {
                        var newUser = {username: req.body.username, password: req.body.password, email: req.body.email};
                        req.session.user = newUser;
                        res.redirect('index');
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

}

exports.logout = function (req, res){

}
/** getCompany function to get Company by id. */
exports.get = function (req, res) {
    console.log(req.params.id);
    User.get({_id: req.params.id}, function(err, result) {
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
