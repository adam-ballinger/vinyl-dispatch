/**
 * Tools for working with json arrays and xlsx files.
 */

const reader = require('xlsx');

// Used to read a xlsx file and return as JSON.
function requestFile(loc, sheet_name=null, params={'cellDates': true}) {
    return new Promise((resolve, reject) => {
        
        try {
            // Check for sheet_name parameter, set to first sheet if sheet_name=null.
            let file = reader.readFile(loc, params);
            if(sheet_name === null) {
                sheet_name = file.SheetNames[0];
            }
            resolve(reader.utils.sheet_to_json(file.Sheets[sheet_name]));
        } catch(error) {
            reject(error)
        }

    })
}

function filterData(data, filter) {
    keys = Object.keys(filter)
    result = []
    for(let i  = 0; i < data.length; i++) {
        for(let j = 0; j < keys.length; j++) {
            if(data[i][keys[j]] == filter[keys[j]]) {
                result.push(data[i])
            }
        }
    }
    return result
}

// Get an object by '_id' property.
function getById(data, id) {
    for(let i = 0; i < data.length; i++) {
        if(data[i]._id == id) {
            return data[i]
        }
    }
    return false
}

// Sum all values of a property in an array.
function sumProperty(data, property) {
    result = 0;
    for(let i = 0; i < data.length; i++) {
        result += data[i][property];
    }
    return result;
}

// Get a list of objects by a date property.
function getByDateProperty(data, property, date) {
    result = [];
    for(let i = 0; i < data.length; i++) {
        if(data[i][property].getTime() == date.getTime() ) {
            result.push(data[i]);
        }
    }
    return result;
}

module.exports = {requestFile, filterData, getById, sumProperty, getByDateProperty};