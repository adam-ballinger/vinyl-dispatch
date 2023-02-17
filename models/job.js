/**
 * Mongoose model for jobs.
 */

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    opSeq: {
        type: String,
        required: true
    },
    opSeqDescription: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    completionDate: {
        type: Date,
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    qtySchedule: {
        type: Number,
        required: true
    },
    qtyRemaining: {
        type: Number,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    die: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Job', jobSchema);