// create an express app
const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');


const clientSessions = require('client-sessions');

const app = express();

const HTTP_PORT = process.env.PORT || 3000;


//const Order = require('./models/order');


const accountRoutes = require('./routes/account');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

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


// Middleware

app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));    
app.use(express.json());
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

// Routes middlewares
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    users: req.session.user
  });
});
app.use('/',accountRoutes);
app.use('/',productRoutes);
app.use('/',orderRoutes);







// app.get('/packages/:packagename', (req, res) => {

// });

// app.get('/checkout', (req, res) => {
//   res.render('checkout', {
//     title: 'Shopping Cart Page'
//  });
// });

// start the server listening for requests
app.listen(HTTP_PORT, onHttpStart);