const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favouriteSchema = new Schema({
    user_email: {type: String, required: true},
    owner_email: {type: String, required: true, unique: true}
},
{
    versionKey: false
});

const favouriteModel = mongoose.model('favourite', favouriteSchema);
module.exports = favouriteModel;
