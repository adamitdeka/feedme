const Products = require('../models/products');
const Orders = require('../models/order');
const Cart = require('../models/cart');
const Order = require('../models/order');
const nodemailer = require('nodemailer');


exports.addToCart = (req,res) =>{
    console.log(req.body);
    console.log("requested product ",req.params.id);
    console.log("user ID", req.session.user);
    const packageQtn =  parseInt(req.body.packageQtn)
    const userId = req.session.user.userId;
    const packageId = req.params.id;
    Products.findById(packageId)
    .then(result => {
        console.log('cart result', result);
        var packageDetails={
            packageid: packageId,
            packagename: result.packagename,
            packageprice: result.packageprice,
            packageQtn: packageQtn,
            packageTotalPrice: result.packageprice * packageQtn
        }
        Cart.findOneAndUpdate(
            {userId:userId},
            {$set:{userId:userId},$push:{packages:packageDetails},$inc:{totalPrice:packageDetails.packageTotalPrice}},
            {new:true,upsert:true}
        )
        .then(cart => {
            //Added successfully to cart or created new and added
            console.log(cart)
            res.redirect('/packages')
        })
        .catch(err => {
            console.error("Package not found",err);
            return res.status(500).json({
                error:err.message
            })
        })
    })
    .catch(err => {
        console.error("Package not found",err);
        return res.status(500).json({
            error:err.message
        })
    })
}


exports.getCart = (req,res) =>{
    const userId = req.session.user.userId;
    Cart.findOne({userId:userId})
    .lean()
    .then(cart => {
        if(!cart){
            res.render('cart',{
                packages:[],
                users: req.session.user
            })
        }
        else{
            res.render('cart',cart)
        }
    })
    .catch(err => {
        console.error("Package not found",err);
        return res.status(500).json({
            error:err.message
        })
    })
}

exports.deleteFromCart = (req,res) =>{
    const userId = req.session.user.userId;
    const packageId = req.params.id;
    console.log(packageId)
    Products.findById(packageId)
    .then(package => {
        return Cart.update(
            {userId:userId},
            { $pull: { "packages":{"packageid":packageId}},$inc:{totalPrice:-1*package.packageprice} },
        )
    })
    .then(cart => {
        res.status(200).json()
    })
    .catch(err => {
        console.error("Package not found",err);
        return res.status(500).json({
            error:err.message
        })
    })
   
}


exports.placeOrder = (req,res) =>{
    console.log('place order', req.session);
    const userId = req.session.user.userId;
    Cart.findOne({userId:userId})
    .lean()
    .then(cart => {
        delete cart._id
        let newOrder = new Order(cart);
        return newOrder.save()
        .then(order => {

            Cart.findOneAndUpdate({userId:userId},{packages:[],totalPrice:0})
            .then(cart => {
                const transporter = nodemailer.createTransport({
                    host: 'https://stark-garden-30094.herokuapp.com',
                    port: 587,
                    secure: false,
                    service: 'gmail',
                    auth: {
                        user: 'senecacpatesting@gmail.com',
                        pass: 'web322testing' 
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                let mailOptions = {
                    from: 'senecacpatesting',
                    // to: req.session.user.email,
                    to: req.session.user.email,
                    subject: 'Order Placed',
                    html: `<h3>Your order ${order._id} has been placed</h3>`
                };
    
                transporter.sendMail(mailOptions, function(err, data) {
                    if(err) {
                        console.log('Mail has not been sent',err);
                        return res.status(500).json({
                            error:err.message
                        })
                    } 
                    else {
                        console.log(`Message sent: ${data.response}`);
                        res.status(200).json()
                    }
                });

                res.status(200).json({
                    order:order
                })
            })
            .catch(err => {
                console.error("Package not found",err);
                return res.status(500).json({
                    error:err.message
                })
            })
        })
        .catch(err => {
            console.error("Package not found",err);
            return res.status(500).json({
                error:err.message
            })
        })
    })
    .catch(err => {
        console.error("Package not found",err);
        return res.status(500).json({
            error:err.message
        })
    })
       
}