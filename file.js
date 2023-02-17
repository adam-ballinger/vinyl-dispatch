/**
 * Repetative file read/write funcitons stored here.
 */

const reader = require('xlsx');

// Used to read a dispatch xlsx file and return dispatch as JSON.
function readFile(loc, sheet_name=null, params={'cellDates': true}) {
     
    let file = reader.readFile(loc, params);

    // Check for sheet_name parameter, set to first sheet if sheet_name=null
    if(sheet_name === null) {
        sheet_name = file.SheetNames[0];
    }

    return reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[0]]);
}

module.exports = {readFile};