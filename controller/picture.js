'use strict';

var Picture = require('../model/picture').Picture;


exports.get_global = function (req, res){

}

exports.get_mine = function (req, res){

}
/** create function to create Company. */
exports.create = function (req, res) {
    console.log(req);
    console.log("request body: " + req.body.tag);
    var results;
    var error;
    Picture.create(req.body, function(err, result) {
        if (!err) {
            res.json(result);
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
