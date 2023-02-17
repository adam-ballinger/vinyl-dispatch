/**
 * Automate common dispatch funtions. 
 */

// Setup for mongoose connection.
// Mongoose.set('strictQuery', false) is used to prepare for mongoose version 7.
const mongoose = require('mongoose');
const uri = 'mongodb+srv://ballinger5421:UqAxFGFuUTRdKTC9@cluster0.rz2zf3q.mongodb.net/test';
mongoose.set('strictQuery', false);

// Require routers 
const jobsRouter = require('./routes/jobs');

// 
const reader = require('xlsx');
const file = reader.readFile('Dispatch.xlsx', {'cellDates': true});

const rawDispatch = reader.utils.sheet_to_json(
    file.Sheets[file.SheetNames[0]]);

console.log(rawDispatch[0]);

// Connect to mongoose.
// Connection callback is used to perform tasks once connection is made.
mongoose.connect(uri, (err)=> {
    console.log('MongoDB connection', err);
});




