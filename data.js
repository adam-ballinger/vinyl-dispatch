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
            resolve(reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]));
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

module.exports = {requestFile, filterData};