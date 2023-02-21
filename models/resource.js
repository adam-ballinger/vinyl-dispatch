/**
 * Mongoose model for resources.
 */

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Resource', resourceSchema);