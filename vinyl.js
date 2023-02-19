/**
 * Vinyl specific tools for scheduling.
 */

const data = require('./data.js');
const Job = require('./models/job.js');
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

// Used to get all current jobs from database.
function getCurrentJobs() {
    try {
        const jobs = Job.find({"current": true});
        return jobs;
    } catch(err) {
        console.log('Error' + err);
    }
}

// Upload data from a new dispatch file to replace the previous day's data.
// All current jobs are pulled in from database and checked against incoming jobs.
// -If the jobs persist, the data is updated.
// -If jobs are new, new job is uploaded.
// -If jobs are no longer on dispatch, they are marked current=false in the database.
function updateDispatch(loc) {

    // Initiate requests to new dispatch file and and yesterdays's dispatch jobs from database.
    // These will be compared to report dispatch changes from previouse day.
    dispatch_request = requestDispatch(loc)
    database_request = database.requestJobs({'dispatch': true})


    Promise.all([dispatch_request, database_request]).then((responses) => {
        let dispatch = responses[0]
        let database = responses[1]
        console.log(data.filterData(dispatch, {'_id': '2266106'}))
        console.log(data.filterData(database, {'_id': '2266106'}))
    })
}

module.exports = {filterVinylJobs, requestDispatch, getLateJobs, getCurrentJobs, updateDispatch};