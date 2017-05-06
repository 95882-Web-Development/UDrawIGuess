'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * @module company
 * @description contain the details of company information, conditions and actions.
 */

var UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    email :{type: String},
    following:[String],
    follower:[String]
});


UserSchema.statics = {

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
        this.update(id, {$set: updateData}, callback);
    },
    removeById: function(removeData, callback) {
        this.remove(removeData, callback);
    },
    create: function(data, callback) {
        var picture = new this(data);
        user.save(callback);
    }
};

var user = mongoose.model('user', UserSchema);

/** export schema */
module.exports = {
    User: user
};