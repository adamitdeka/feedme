const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const entrySchema = new Schema({
   packagename: {
     type: String, 
     required: true
   },
   packageprice: {
     type: Number, 
     required: true
   },
   description: {
     type: String, 
     required: true
   },
   foodcategory: {
     type: String, 
     required: true
   },
   meals: {
     type: Number, 
     required: true
   },
   istoppackage: {
     type: Boolean, 
     default: false
   },
   productImage: {
     type: String,
     default : "", 
     required: true
   }
 });
 
 const Products = mongoose.model('DataEntry', entrySchema);
 
 module.exports = Products;