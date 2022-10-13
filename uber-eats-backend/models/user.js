const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    contact: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    location: {type: String, required: false},
    state: {type: String, required: false},
    country: {type: String, required: false},
    nickname: {type: String, required: false},
    dob: {type: String, required: false},
    about: {type: String, required: false},
    add1: {type: String, required: false},
    add2: {type: String, required: false},
    uploadPublicID: {type: String, required: false},
    uploadURL: {type: String, required: false},

},
{
    versionKey: false
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
