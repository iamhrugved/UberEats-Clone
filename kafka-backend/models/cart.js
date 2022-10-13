const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cartSchema = new Schema({
    po_id: {type: Number, required: true},
    quantity: {type: String, required: true, default: '1'},
    price: {type: String, required: true},
    user_email: {type: String, required: true},
    owner_email: {type: String, required: true},
    overallprice: {type: String, required: false, default: '0'}
},
{
    versionKey: false
});


const cartModel = mongoose.model('cart', cartSchema);
module.exports = cartModel;
