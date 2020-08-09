const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packageSchema = new Schema({
   _id:false,
   packageid: String,
   packagename: String,
   packageprice: Number,
   packageQtn: Number,
   packageTotalPrice: Number
});

const orderSchema = new Schema({
   userId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accounts",  
   },
   packages:{type:[packageSchema],default:[]},
   totalPrice: {type:Number,default:0}
});

const Order = mongoose.model('Orders', orderSchema);

module.exports = Order;