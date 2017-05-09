'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * @module company
 * @description contain the details of company information, conditions and actions.
 */

var PictureSchema = new Schema({
    picture_id: {type: String },
    picture :{type: String},
    user_id:{type: String},
    username:{type: String},
    keyword:{type: String},
    like_num:{type: Number},
    like_users:[String],
    tag: {type: String},
    description: {type:String},
    bookmark_num: {type: String},
    has_like: {type: Number},
    has_bookmark :{type: Number}
});


PictureSchema.statics = {
     /**
      findOnecompany. return the one company object.
      @param id: get id to find one company by id.
      @param callback: callback of this form.
    */
    get: function(query, callback) {
        this.findOne(query, callback);
    },
    /**
      findcompany. return the company objects.
      @param callback: callback of this form.
    */
    getAll: function(query, callback) {
        this.find(query, callback);
    },

    /**
      updatecompany. return the create company object result.
      @param updateData: updateData is use to update company w.r.t id.
      @param callback: callback of this form.
    */
    updateById: function(id, updateData, callback) {
        console.log(id);
        this.update({_id:id}, {$set: updateData}, callback);
    },
    removeById: function(removeData, callback) {
        this.remove(removeData, callback);
    },
    create: function(data, callback) {
        var picture = new this(data);
        picture.picture_id = picture._id;
        console.log("picture_id: " + picture.picture_id);
        picture.save(callback);
    }
};

var picture = mongoose.model('picture', PictureSchema);

/** export schema */
module.exports = {
    Picture: picture
};