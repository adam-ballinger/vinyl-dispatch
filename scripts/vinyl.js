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
                if(!isNaN(result[i]._id)) {
                    result[i]._id = result[i]._id.toString()
                }
                if(!isNaN(result[i].item)) {
                    result[i].item = result[i].item.toString()
                }
            }
            resolve(result)
        });
    })
}

// Request resources from xlsx
async function requestResources(loc, sheet_name='Resources', callback) {
    data.requestFile(loc, sheet_name).then((response) => {
        result = response;
        for(let i = 0; i < result.length; i++) {
            if(!isNaN(result[i]._id)) {
                result[i]._id = result[i]._id.toString()
            }
        }
        callback(result)
    })
}

// Request resources from xlsx
async function requestItems(loc, sheet_name='Items', callback) {
    data.requestFile(loc, sheet_name).then((response) => {
        result = response;
        for(let i = 0; i < result.length; i++) {
            if(!isNaN(result[i]._id)) {
                result[i]._id = result[i]._id.toString()
            }
        }
        callback(result)
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
// -Some update stats are provided.
function updateDispatch(loc) {

    // Initiate requests to new dispatch file and and yesterdays's dispatch jobs from database.
    // These will be compared to report dispatch changes from previouse day.
    dispatch_request = requestDispatch(loc);
    database_request = database.requestJobs();


    Promise.all([dispatch_request, database_request]).then((responses) => {
        let dispatch_jobs = filterVinylJobs(responses[0]);
        let database_jobs = responses[1];
        
        // First delete the previous day's jobs from the database, then upload the new jobs.
        database.deleteJobs({}).then((response) => {
            console.log({'message': 'Succesfully deleted old dispatch.', 'response': response});
            database.uploadJobs(dispatch_jobs).then((response) => {
                console.log({'message': 'Succesfully uploaded new dispatch.', 'response': response});
            });
        });

        // Find new jobs.
        new_jobs = [];
        for(let i = 0; i < dispatch_jobs.length; i++) {
            id = dispatch_jobs[i]._id;
            if(!data.getById(database_jobs, id)) {
                new_jobs.push(dispatch_jobs[i]);
            }
        }
        if(new_jobs.length > 1) {
            console.log({
                'message': `There are ${new_jobs.length} new jobs.`,
                'count': new_jobs.length,
                'new_jobs': new_jobs
            });
        } else if(new_jobs.length == 1) {
            console.log({
                'message': 'There is 1 new jobs.',
                'count': new_jobs.length,
                'new_jobs': new_jobs
            });
        }
        else {
            console.log({'message': 'There are no new jobs.'});
        }

        // Find late jobs.
        late_jobs = getLateJobs(dispatch_jobs);
        late_hours = data.sumProperty(late_jobs, 'hours')
        if(late_jobs.length > 1) {
            console.log({
                'message': `There are ${late_jobs.length} late jobs.`,
                'count': late_jobs.length,
                'late_hours': late_hours,
                'late_jobs': late_jobs
            });
        } else if(late_jobs.length == 1) {
            console.log({
                'message': 'There is 1 late job.',
                'count': late_jobs.length,
                'late_hours': late_hours,
                'late_jobs': late_jobs
            });
        }
        else {
            console.log({'message': 'There are no late jobs.'})
        }

        // Find today's jobs.
        now = new Date();
        today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        todays_jobs = data.getByDateProperty(dispatch_jobs, 'completionDate', today)
        if(todays_jobs.length > 1) {
            console.log({
                'message': `There are ${todays_jobs.length} jobs due today.`,
                'count': todays_jobs.length,
                'todays_jobs': todays_jobs
            });
        } else if (todays_jobs.length == 1) {
            console.log({
                'message': 'There is 1 job due today.',
                'count': todays_jobs.length,
                'todays_jobs': todays_jobs
            });
        }
        else {
            console.log({
                'message': 'There are no jobs due today.',
                'now': now,
                'today': today
            })
        }
    });
}

module.exports = {
    filterVinylJobs,
    requestDispatch,
    getLateJobs,
    updateDispatch,
    requestResources,
    requestItems
};