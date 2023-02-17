/**
 * Provide routers for jobs.
 */

const express = require('express');
const router = express.Router();
const Job = require('../models/job');

router.post('/', async(req, res) => {
    const job = new Job({
        job: req.body['Job'],
        item: req.body['Item'],
        opSeq: req.body['OP SEQ'],
        opSeqDescription: req.body['OP SEQ Description'],
        startDate: req.body['Start Date'],
        completionDate: req.body['Completion Date'],
        resource: req.body['Resource'],
        qtySchedule: req.body['Qty Schedule'],
        qtyRemaining: req.body['Qty Remaining'],
        hours: req.body['Hours'],
        die: req.body['Die #']
    });
    try {
        const save = await job.save();
        res.json(save);
    } catch(err) {
        res.send('Error:' + err);
    }
});

// This is a debug tool to upload jobs directly from the server without a router.
async function upload_job(data) {
    const job = new Job({
        _id: data['Job'],
        item: data['Item'],
        opSeq: data['OP SEQ'],
        opSeqDescription: data['OP SEQ Description'],
        startDate: data['Start Date'],
        completionDate: data['Completion Date'],
        resource: data['Resource'],
        qtySchedule: data['Qty Schedule'],
        qtyRemaining: data['Qty Remaining'],
        hours: data['Hours'],
        die: data['Die #']
    });
    try {
        const save = await job.save();
        console.log('Save:' + save);
    } catch(err) {
        console.log('Error:' + err);
    }    
}

module.exports = {'uploadJob': upload_job};