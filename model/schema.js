const mongoose = require('mongoose')

const schema = mongoose.Schema;
const objectId = mongoose.ObjectId;

const studentsSchema = new schema({
    _id : objectId,
    name : String,
    std : Number,
    rank : Number

})


const usersSchema = new schema({
    _id : objectId,
    username : String,
    password : String

})

const userID = mongoose.model('userID',usersSchema,'users');
const students = mongoose.model('students',studentsSchema,'students');

module.exports = {userID,students}