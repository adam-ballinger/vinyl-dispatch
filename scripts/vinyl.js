/**
 * Vinyl specific tools for scheduling.
 */

// Require local modules.
const data = require('./data.js');
const Job = require('../models/job.js');
const database = require('./database.js');


// Used to read a dispatch xlsx file and return as JSON with some data formatting.
function requestDispatch(loc, sheet_name=null) {
    
    return new Promise((resolve, reject) => {
        data.requestFile(loc, sheet_name).then((response) => {
            result = response;
            for(let i = 0; i < result.length; i++) {
                if(!isNaN(result[i].resource)) {
                    result[i].resource = result[i].resource.toString()
                }
            }
            resolve(result)
        });
    })
}

// Filter jobs on 411 resources for department specific tasks.
function filterVinylJobs(jobs_data) {
    result = []
    vinylResources = [
        '41159',
        '41158',
        '411100',
        '41116',
        '41114',
        '41115',
        '41151',
        '41152',
        '41112',
        '41199'
    ]

    for(let i = 0; i < jobs_data.length; i++) {
        if(vinylResources.includes(jobs_data[i].resource)) {
            result.push(jobs_data[i])
        }
    }

    return result
}

// Filter jobs that are late based on completion date.
function getLateJobs(jobs_data) {
    
    let result = []
    let today = new Date()
    for(let i = 0; i < jobs_data.length; i++) {
        let days_late = Math.floor((today - jobs_data[i].completionDate) / (1000 * 3600 * 24))
        if(days_late > 0) {
            result.push(jobs_data[i])
        }
    }
    return result
}

// Upload data from a new dispatch file to replace the previous day's data.
// All current jobs are pulled in from database and checked against incoming jobs.
// -Yesterday's jobs are deleted from the database.
// -Today's jobs are uploaded.
function updateDispatch(loc) {

    // Initiate requests to new dispatch file and and yesterdays's dispatch jobs from database.
    // These will be compared to report dispatch changes from previouse day.
    dispatch_request = requestDispatch(loc);
    database_request = database.requestJobs({'dispatch': true});


    Promise.all([dispatch_request, database_request]).then((responses) => {
        let dispatch_jobs = filterVinylJobs(responses[0]);
        let database_jobs = responses[1];
        
        // First delete the previous day's jobs from the database, then upload the new jobs.
        database.deleteJobs({}).then((response) => {
            
        console.log({'message': 'Deleted jobs.', 'response': response})
        database.uploadJobs(dispatch_jobs).then((response) => {
            
        console.log({'message': 'Uploaded jobs.', 'response': response})
        
        });
        });

    });
}

module.exports = {filterVinylJobs, requestDispatch, getLateJobs, updateDispatch};