const path = require('path');
const Products = require('../models/products');
const mongoose = require('mongoose');


exports.listPackages = (req, res) => {
    Products.find({}).lean().exec((err, result)=>{
      if(err){
        console.log(err);
        console.log('No packages found');
        }
      else{
        
        res.render('packages',{
          package: result,
          users: req.session.user
        });
        }
    });
}
exports.listPackagesClerk = (req, res) => {
    console.log('listPackagesClerk',req.body);
    Products.find({}).lean().exec((err, result)=>{
      if(err){
        console.log(err);
        console.log('No packages found');
        }
      else{
        console.log("RESULT TYPE", typeof result);
        console.log('RESULT',result);
        res.render('clerkpackages',{
          package: result,
          users: req.session.user
        });
        }
    });
}
exports.loadAddPackage = (req,res) => {
    console.log('addpackage running');
    return res.render('addpackage', {
    title: 'Edits Meals Page'
    });
}

exports.addPackage = (req,res) => {
    const dataitem = {
        id: new mongoose.Types.ObjectId(),
        packagename: req.body.packagename,
        packageprice: req.body.packageprice,
        description: req.body.description,
        foodcategory: req.body.foodcategory,
        meals: req.body.meals,
        istoppackage: req.body.istoppackage,
        productImage: req.file.path
        };
        
        const DataInfo = new Products(dataitem);
        
        DataInfo.save()
        .then(result => {
        console.log(result);
        res.render('packages', {entry: result})
        })
        .catch(err => {
        console.log('Error: Meal package was not saved');
    });
}

exports.showPackage = (req, res) =>{
    
    Products.findById(req.params.id).exec((err, result) =>{
        if(err){
            console.log('Package not found');
        }
        res.render('showpackage',{
            packageId: result._id,
            packageTitle: result.packagename,
            packagePrice: result.packageprice,
            packageDesc: result.description,
            packageMeals: result.meals,
            packageImage: result.productImage
        })
    });
}

exports.updatePackage = (req, res) =>{
    
    Products.findById(req.params.id).exec((err, result) =>{
        if(err){
            console.log('Package not found');
        }
        console.log('update package result',result);
        res.render('updatePackage',{
            packageId: result._id,
            packageTitle: result.packagename,
            packagePrice: result.packageprice,
            packageDesc: result.description,
            packageCategory: result.foodcategory,
            packageMeals: result.meals,
            packageImage: result.productImage
        })
    });
}

exports.removePackage = (req, res)=>{
    console.log('remove running');
    Products.findByIdAndRemove(req.params.id,function(err, result) {
        if (err) {
            console.log('delete error',err);
            res.status(500).json({
                err:err.message
            })
         
        }
        else{
            res.redirect('/clerkpackages')
        }
    });
}


