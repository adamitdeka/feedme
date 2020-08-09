const Account = require('../models/account');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { check, validationResult, matchedData } = require('express-validator');

exports.isClerk = (req, res, next) => {
    console.log('req.session',req.session);
    if(!req.session.user.employee) {
      console.log('req.seesion.user.employee',req.session.user.employee);
      console.log('notemployee');
      res.render('/login', {
        title: "Login Page",
        msg: "Please Sign In as an Employee"
      });
    }
    else {
      console.log('isEmployee');
      return next();
    }
}

exports.ensureLogin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

exports.loadLogin = (req, res) => {
    res.render('login', {
    title: 'Login Page'
    });
}

exports.loadDashboard = (req, res) => {
    input = req.session.user;
    //console.log('input.employee',input.employee);
    if(input.employee) {     
        //data clerk login
        console.log("Employee Login",input); 
        //req.session.user = input;
        res.render('dashboard', {
            Employee: true,
            Greeting: `Hi, ${input.firstname} ${input.lastname}`,
            title: "Employee Dashboard",
            users: req.session.user
        });
        }
        else{
            res.render('dashboard', {
                Greeting: `Hi, ${input.firstname} ${input.lastname}`,
                title: 'Customer Dashboard',
                users: req.session.user
                //errors: errors.mapped() 
            });
        }
    
}

exports.login = (req, res) => {
   

    const errors = validationResult(req);
    const user = matchedData(req);
    console.log(user);
    if(!errors.isEmpty()) {
        res.render('login', { errors: errors.mapped(), users: user });
    }
    else {
        const email = user.loginemail;
        const loginpassword = user.loginpassword;
    
        Account.findOne({ email: email })
        .then(input => {
        if(input) {
            bcrypt.compare(loginpassword, input.password, (err, result) => {
            if(err) {
                console.log('Login error has occurred')
    
                res.render('login', { 
                errorMessage: 'Error: Unable to find user', 
                users: input,
                title: 'Login Page' 
                });
            };
            if(result) {
                console.log('Login successful');
                req.session.user = {
                    userId:input._id,
                    firstname: input.firstname,
                    lastname: input.lastname,
                    email: input.email
                }
                
                if(input.employee) {     //data clerk login
                console.log("Employee Login",input); 
                req.session.user = input;
                res.render('dashboard', {
                    Employee: true,
                    Greeting: `Hi, ${input.firstname} ${input.lastname}`,
                    title: "Employee Dashboard",
                    users: req.session.user
                });
                }
                else{
                    res.render('dashboard', {
                        Greeting: `Hi, ${input.firstname} ${input.lastname}`,
                        title: 'Customer Dashboard',
                        users: req.session.user, 
                        errors: errors.mapped() 
                    });
                }
                
            }
            else {
                console.log('Password does not match')
                res.render('login', { errorMessage: 'Invalid Password' })
            };
            })
        }
        else {
            console.log('No user found!')
            res.render('login', { errorMessage: 'Error: Unable to find user' })
        }
        })
        .catch(err => {
        console.log('Login error has occurred - No user found')
        res.render('login', { errorMessage: 'Login error has occurred' })
        }); 
    }
}


exports.loadSignup = (req, res) => {
    res.render('signup', {
      title: 'Signup Page'
    });
}

exports.signup = (req, res)=>{
    console.log(req);
    const errors = validationResult(req); 
    const user = matchedData(req);
    const output = `<h3>Thank you ${req.body.firstname}, for signing up to FeedME.</h3><p>WEB322 Assignment</p>`;
    
    const hash = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hash;
    var isEmployee = false;
    if(req.body.dataclerk){
        isEmployee = true;
    }
    const formitem = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        employee: isEmployee
    };
    
    const AccountInfo = new Account(formitem);
    
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
        to: `${req.body.email}`,
        subject: 'Welcome to FeedME!',
        html: output
    };
    
    if(!errors.isEmpty()) {
        console.log(req.body);
        res.render('signup', { errors: errors.mapped(), users: user })
    }
    else {
        //SEND EMAIL
        transporter.sendMail(mailOptions, function(err, data) {
        if(err) {
            console.log('Mail has not been sent');
        } 
        else {
            console.log(`Message sent: ${data.response}`);
        }
        });
        //MONGODB - SAVE DATA
        AccountInfo.save(err => {
        if(err) {
            console.log(err);
            console.log('Data has not been saved');
        } 
        else {
            if(req.body.dataclerk){
            res.render('dashboard', {
                Greeting: `Hi, ${ user.firstname } ${ user.lastname } {Data Clerk}`,
                title: 'Dashboard Page',
                users: req.session.user, 
                errors: errors.mapped() 
            });
            }
            else{
            res.render('dashboard', {
                Greeting: `Hi, ${ user.firstname } ${ user.lastname }`,
                title: 'Dashboard Page',
                users: req.session.user, 
                errors: errors.mapped() 
            });
            }
            console.log('Data has been saved');
        }
        }); 
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.locals.session.destroy();
    res.redirect('/');
}


