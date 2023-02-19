/**
 * Functions for working with the vinyl database.
 */

const Job = require('./models/job.js');

// Used to upload jobs directly from the server without a router.
async function uploadJob(data) {
    const job = new Job({
        _id: data['_id'],
        dept: data['dept'],
        item: data['item'],
        opSeq: data['opSeq'],
        opSeqDescription: data['opSeqDescription'],
        startDate: data['startDate'],
        completionDate: data['completionDate'],
        resource: data['resource'],
        qtySchedule: data['qtySchedule'],
        qtyRemaining: data['qtyRemaining'],
        hours: data['hours'],
        die: data['die'],
        dispatch: true
    });
    try {
        const save = await job.save();
        console.log('Save:' + save);
    } catch(err) {
        console.log('Error:' + err);
    }    
}

// Used to request jobs from the database that are current.
function requestJobs(filter) {
    return new Promise((resolve, reject) => {
        Job.find(filter, (err, job) => {
            if(err) reject;
            resolve(job);
        })
    })
}


module.exports = {uploadJob, requestJobs}