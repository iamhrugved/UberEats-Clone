const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema = new Schema({
    po_id: {type: Number, required: true},
    user_email: {type: String, required: true},
    quantity: {type: String, required: true, default: '1'},
    sp_inst: {type: String, required: false, default: 'N/A'},
    order_status: {type: String, required: true},
    ordertime: {type: String, required: false}
},
{
    versionKey: false
});


const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;
