/**
 * Automate common dispatch funtions.
 */

// Setup for mongoose connection.
// Mongoose.set('strictQuery', false) is used to prepare for mongoose version 7.
const mongoose = require('mongoose');
const uri = 'mongodb+srv://ballinger5421:UqAxFGFuUTRdKTC9@cluster0.rz2zf3q.mongodb.net/test';
mongoose.set('strictQuery', false);

// Connect to mongoose.
// It is not necessary to wait for connection to interacting with the database
// Mongoose automatically buffers until connection is made.
mongoose.connect(uri, (err)=> {
    if(err) {
        console.log({'message': 'MongoDB connection failed.', 'err': err})
    } else {
        console.log({'message': 'MongoDB connection successful.'});
    }
});

// Require local modules
const database = require('./scripts/database.js')
const vinyl = require('./scripts/vinyl.js')
const data = require('./scripts/data.js')


// Main tasks:
vinyl.updateDispatch('./files/Dispatch.xlsx')