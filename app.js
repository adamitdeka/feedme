// create an express app
const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const clientSessions = require('client-sessions');

const { check, validationResult, matchedData } = require('express-validator');

const app = express();

const HTTP_PORT = process.env.PORT || 3000;

const Account = require('./models/account');
const Order = require('./models/order');
const Products = require('./models/products');

// Mongoose Setup
const MONGODB_URL = 'mongodb+srv://ireneeehuu:322574187101@senecaweb.uoihy.mongodb.net/ireneeehuu?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URL || 'mongodb://localhost:3000/account', {
  useCreateIndex: true, 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected');
});

// View engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

function onHttpStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

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

// Middleware    
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: false }));    
app.use(express.static('public'));  

// Session
app.use(clientSessions({
  cookieName: "session", 
  secret: "assignment_web322", 
  duration: 2 * 60 * 1000, 
  activeDuration: 1000 * 60 
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  res.locals.user = req.session.user;
  next();
});

// LOGIN SESSION 
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

function isClerk(req, res, next) {
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

// Routing
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home Page'
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login Page'
  });
});

app.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Signup Page'
  });
});

app.get('/logout', ensureLogin, (req, res) => {
  req.session.destroy();
  res.locals.session.destroy();
  res.redirect('/');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard Page'
  });
});

app.get('/packages', (req, res) => {
    Products.find({}).lean().exec((err, result)=>{
      if(err){
        console.log(err);
        console.log('No packages found');
      }
      else{
        console.log("RESULT TYPE",typeof result);
        console.log('RESULT',result);
        res.render('packages',{
          package: result
        })
      }
    });
  // res.render('packages', {
  //   title: 'All Packages Page'
  // });
});

app.get('/addpackage',isClerk, (req, res) => {
  console.log('addpackage running');
  return res.render('addpackage', {
    title: 'Edits Meals Page'
  });
});



// app.get('/packages/:packagename', (req, res) => {

// });

app.get('/checkout', (req, res) => {
  res.render('checkout', {
    title: 'Shopping Cart Page'
 });
});

app.post('/signup', [
  
  check('firstname', 'First name is required').not().isEmpty(),
  check('lastname', 'Last name is required').not().isEmpty(),
  check('email', 'Invalid email address').not().isEmpty()
  .isEmail().withMessage('Invalid email address'),
  check('password', 'Invalid password').not().isEmpty()
  .trim().isAlphanumeric().withMessage('Password must contain only numbers and letters'),
  check('password').trim().isLength({ min: 6 }).trim().withMessage('Password must contain 6 or more characters')
], (req, res) => {
  console.log(req);
  const errors = validationResult(req); 
  const user = matchedData(req);
  const output = `<h3>Thank you ${req.body.firstname}, for signing up to FeedME.</h3>
  
  <p>WEB322 Assignment</p>`;

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

    

    // // DATA CLERK ENTRY LOGIN
    // const cb = document.getElementById('dataclerk');

    // if(cb.checked) {
    //   res.status(404).json({message: 'Data Clerk Entry'});
    //   // res.render('dashboard', {
    //   //   Greeting: `Hi, ${ user.firstname } ${ user.lastname } {Data Clerk}`,
    //   //   title: 'Dashboard Page',
    //   //   users: req.session.user, 
    //   //   errors: errors.mapped() 
    //   // });
    // }
    // else {
    //   res.render('dashboard', {
    //     Greeting: `Hi, ${ user.firstname } ${ user.lastname }`,
    //     title: 'Dashboard Page',
    //     users: req.session.user, 
    //     errors: errors.mapped() 
    //   });
    // }
  }
});

app.post('/login', [
  check('loginemail', 'Invalid email address').not().isEmpty(),
  check('loginpassword', 'Invalid password').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req);
  const user = matchedData(req);

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
              firstname: input.firstname,
              lastname: input.lastname,
              email: input.email
            }

            if(input.employee) {     //data clerk login
              console.log("Employee Login",input); 
              req.session.user = input;
              res.render('dashboard', {
                Greeting: `Hi, ${input.firstname} ${input.lastname}`,
                title: "Employee Dashboard",
                users: req.session.user
              });
            }

            res.render('dashboard', {
              Greeting: `Hi, ${input.firstname} ${input.lastname}`,
              title: 'Customer Dashboard',
              users: req.session.user, 
              errors: errors.mapped() 
            });
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
})

app.post('/addpackage', isClerk,upload.single('productImage'), (req, res) => {
  const dataitem = {
    _id: new mongoose.Types.ObjectId(),
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

});

// start the server listening for requests
app.listen(HTTP_PORT, onHttpStart);