/**
 * Functions for working with the vinyl database.
 */

const Job = require('../models/job.js');
const Resource = require('../models/resource.js');

// Used to upload jobs directly from the server without a router.
function uploadJob(data) {
    return new Promise((resolve, reject) => {
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
            die: data['die']
        });
        const save = job.save((err, res) => {
            if(err) { reject(err); }
            else { resolve(res); }
        });
    }); 
}

// Used to request jobs from the database that are current.
function requestJobs(filter) {
    return new Promise((resolve, reject) => {
        Job.find(filter, (err, res) => {
            if(err) reject(err);
            else resolve(res);
        });
    });
}

// Used to delete many jobs from the database.
function deleteJobs(filter) {
    return new Promise((resolve, reject) => {
        Job.deleteMany(filter, (err, res) => {
            if(err) reject;
            resolve(res);
        });
    });
}

// Upload multiple jobs at once.
function uploadJobs(jobs) {
    return new Promise((resolve, reject) => {
        let promises = [];
        for(let i = 0; i < jobs.length; i++) {
            promises.push(uploadJob(jobs[i]))
        }
        Promise.all(promises).then((responses) => {
            resolve({'uploadCount': promises.length})
        })
    });
}

// Upload resources.
// Not returning a promise here, just executing a callback when finished.
// I think this is a better practice for implenting on the server.
async function uploadResource(data, callback) {
    const resource = new Resource({
        _id: data._id,
        description: data.description,
        shortDescription: data.shortDescription
    });
    const save = resource.save((err, res) => {
        if (err) { callback({'message': 'There was an error.', 'err': err, 'data': data}); }
        else { callback({'message': 'Upload was successful.', 'res': res, 'save': save}); }
    })
}

// Upload multiple resources.
async function uploadResources(resources, callback) {
    let promises = [];
    for(let i = 0; i < resources.length; i++) {
        promises.push(new Promise((resolve, reject) => {
            uploadResource(resources[i], (response) => {
                if(response.err) { reject(response); }
                else { resolve(response); }
            })
        }))
    }
    Promise.all(promises).then((responses) => {
        callback({'message': 'Resources uploaded successfully.', 'uploadCount': responses.length})
    })
}

module.exports = {uploadJob, requestJobs, deleteJobs, uploadJobs, uploadResource, uploadResources}