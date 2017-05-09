/**
 * Created by jason on 5/9/17.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * @module company
 * @description contain the details of company information, conditions and actions.
 */

var HistorySchema = new Schema({
    user_id:{type: String},
    record: {type: String }
});


HistorySchema.statics = {
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
    create: function(data, callback) {
        var record = new this(data);
        record.save(callback);
    }
};

var history = mongoose.model('history', HistorySchema);

/** export schema */
module.exports = {
    History: history
};