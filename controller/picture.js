'use strict';

var Picture = require('../model/picture').Picture;
var User = require('../model/user').User;


exports.get_global = function (req, res){
    console.log("global get req: " + req)
    Picture.getAll({},function(err,result){
        var pictures= result;
        if(!err){
            User.getAll({},function(err, result){
                var data = new Object();
                data.my_id = req.session.user._id;
                data.ranking = [];
                result.forEach(function(item, index){
                    data.ranking.push({user_id:item._id,username:item.username})
                });
                data.pictures = pictures;
                return res.json(data);
            });
        }else{
            return res.send(err); // 500 error
        }
    })
}

exports.get_mine = function (req, res){
    Picture.getAll({user_id:req.session.user._id},function(err,result){
        if(!err){
            var data = new Object();
            data.pictures = result;
            data.my_id = req.session.user._id;
            data.username = req.session.user.username;
            data.following_num = req.session.user.following.length;
            data.follower_num = req.session.user.follower.length;
            data.guess_num = req.session.user.guess_num;
            data.guess_correct_num = req.session.user.guess_correct_num;
            return res.json(data);
        }else{
            return res.send(err); // 500 error
        }
    })
}
/** create function to create Company. */
exports.create = function (req, res) {
    console.log("request: " + req.body.tag);
    console.log("userid  "+req.session.user._id);
    var data = req.body;
    data.user_id = req.session.user._id;

    Picture.create(req.body, function(err, result) {
        if (!err) {
            console.log("result_id:"+result._id);
            req.session.user.pictures_draw.push(result.id);
            User.updateById(req.session.user._id,req.session.user,function(err,result){
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
