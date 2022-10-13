const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var menuSchema = new Schema({
    p_id: {type: Number, required: false, unique: true, sparse:true},
    p_name: {type: String, required: true},
    p_ingredients: {type: String, required: true},
    p_description: {type: String, required: true},
    p_category: {type: String, required: true},
    p_type: {type: String, required: true},
    p_price: {type: String, required: true},
    email: {type: String, required: true},
    uploadPublicID: {type: String, required: false},
    uploadURL: {type: String, required: false},

},
{
    versionKey: false
});

const menuModel = mongoose.model('menu', menuSchema);
module.exports = menuModel;
