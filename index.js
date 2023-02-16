const reader = require('xlsx')
const file = reader.readFile('Dispatch.xlsx', {'cellDates': true})

const mongoose = require('mongoose')
const uri = 'mongodb+srv://ballinger5421:UqAxFGFuUTRdKTC9@cluster0.rz2zf3q.mongodb.net/test'
mongoose.set('strictQuery', false)
mongoose.connect(uri, (err)=> {
    console.log('MongoDB connection', err)
})

const sheets = file.SheetNames

    const rawDispatch = reader.utils.sheet_to_json(
        file.Sheets[sheets[0]])

console.log(rawDispatch)

