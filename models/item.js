/**
 * Mongoose model for items.
 */

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Item', itemSchema);