const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var testSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
},
{
    versionKey: false
});

const testModel = mongoose.model('test', testSchema);
module.exports = testModel;
