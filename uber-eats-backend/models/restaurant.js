const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var restaurantSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    location: {type: String, required: true},
    description: {type: String, required: false},
    contact: {type: String, required: false},
    timings: {type: String, required: false},
    delivery: {type: String, required: false},
    pickup: {type: String, required: false},
    uploadPublicID: {type: String, required: false},
    uploadURL: {type: String, required: false},

},
{
    versionKey: false
});

const restaurantModel = mongoose.model('restaurant', restaurantSchema);
module.exports = restaurantModel;
