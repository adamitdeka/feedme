const express = require("express");
const router = express.Router();
const {listPackagesClerk, loadAddPackage, addPackage, listPackages, removePackage, showPackage,updatePackage, getUpdatePackage } = require('../controllers/product');
const { isClerk } = require('../controllers/account');
const Products = require('../models/products');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: 'public/images/',
    filename: function(req, file, callback) {
      callback(null, file.originalname);
    }
  });

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
//         cb(null, true);
//     }
//     else {
//         cb(null, false);
//     }
// };

const upload = multer({ storage: storage});


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
router.get('/package/:id',getUpdatePackage);

router.delete('/package/:id', removePackage);

router.post('/package/:id', updatePackage);
module.exports = router;