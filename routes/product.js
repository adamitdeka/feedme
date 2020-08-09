const express = require("express");
const router = express.Router();
const {listPackagesClerk, loadAddPackage, addPackage, listPackages, removePackage, showPackage,updatePackage } = require('../controllers/product');
const { isClerk } = require('../controllers/account');
const Products = require('../models/products');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/images');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


router.get('/packages', listPackages);
// app.get('/dashboard', (req, res) => {
//     res.render('dashboard', {
//       title: 'Dashboard Page',
      
//     });
//   });
router.get('/clerkpackages',isClerk, listPackagesClerk);
router.get('/addpackage',isClerk, loadAddPackage);

router.post('/addpackage', isClerk, upload.single('productImage'), addPackage);
router.get('/showpackage/:id',showPackage);
router.get('/package/:id',updatePackage);

router.delete('/package/:id', removePackage);

router.post('/package/:id', function(req, res){

    console.log('Updating package', req.body);
    let packageData = req.body;
    packageData.meals = parseInt(packageData.meals)
    packageData.packageprice = parseInt(packageData.packageprice)

    Products.findOneAndUpdate({_id:req.params.id}, packageData, function(err, result) {
        if (err) {
            console.log('update error',err);
            res.status(500).json({
                err:err.message
            })
        }
        else{
            res.redirect('/clerkpackages')
        }
    });
});

module.exports = router;