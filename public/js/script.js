
const pasta = {
   img: 'images/Pasta.png',
   caption: 'Seafood Angel Hair Pasta',
   alt: 'Pasta'
};

const sandwich = {
   img: 'images/Sandwich.png',
   caption: 'Corned Beef Sandwich with Swiss Cheese and Sauerkraut',
   alt: 'Sandwich'
};

const steak = {
   img: 'images/Steak.png',
   caption: 'Stove Top Seared Steak with Asparagus',
   alt: 'Steak'
};

const burger = {
   img: 'images/Burger.png',
   caption: 'Pulled Beef Burger with Rice Chips',
   alt: 'Burger'
};

const tacos = {
   img: 'images/Tacos.png',
   caption: 'Al Pastor Tacos',
   alt: 'Tacos'
};

const pizza = {
   img: 'images/Pizza.png',
   caption: 'Vegetarian Pizza',
   alt: 'Pizza'
};

const keto = {
   img: 'images/keto-meal.jpg',
   title: 'Keto',
   content: 'A combination of high-fat, low-carb meals with sufficient-protein',
   deal: 'Includes 3 Meals',
   price: 'from $110',
   top: 'true'
};

const veggie = {
   img: 'images/vegetarian-meal.jpg',
   title: 'Vegetarian',
   content: 'A healthy vegetarian package with all your nutritional benefits',
   deal: 'Includes 4 Meals',
   price: 'from $130'
};

const weightLoss = {
   img: 'images/weight-loss-meal.jpg',
   title: 'Weight Loss',
   content: 'A combination of low-carb, low-fat,and high-protein to keep you feeling full',
   deal: 'Includes 3 Meals',
   price: 'from $110'
};

const glutenFree = {
   img: 'images/gluten-free-meal.jpg',
   title: 'Gluten-Free',
   content: 'A gluten-free package without restricting your cravings',
   deal: 'Includes 4 Meals',
   price: 'from $130'
};

// SIGNUP CLIENT SIDE VALIDATION
const formSignup = document.getElementById('signup-form');
const formLogin = document.getElementById('login-form');

const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const password = document.getElementById('password');

const emailLogin = document.getElementById('loginemail');
const passwordLogin = document.getElementById('loginpassword');

function deletePackage(id) {
   console.log('Deleting package');
   var xhttp = new XMLHttpRequest();
   xhttp.onload = function () { 
    
      // Checking status 
      if (xhttp.status === 200) { 
         console.log('deleted')
      } else { 
         console.log('error') 
      } 
      window.location.reload();
   }

   xhttp.open("DELETE", "/package/"+id, true);
   xhttp.send();
}

function updatePackage(id) {
   console.log('Updating package');
   var xhttp = new XMLHttpRequest();
   xhttp.onload = function () { 
    
      // Checking status 
      if (xhttp.status === 200) { 
         console.log('updated')
         window.location.reload();
      } else { 
         console.log('error') 
      } 
   }

   xhttp.open("POST", "/package/delete/"+id, true);
   xhttp.send();
}

function removeFromCart(id) {
   console.log('Removing from cart ',id);
   var xhttp = new XMLHttpRequest();

   xhttp.open("DELETE", "/cart/"+id, true);
   xhttp.onload = function () { 
    
      // Checking status 
      if (xhttp.status === 200) { 
         console.log('deleted')
         window.location.reload();
      } else { 
         console.log('error') 
      } 
    }
   xhttp.send();
}

function placeOrder() {
   console.log('Placing Order for Card Id');
   var xhttp = new XMLHttpRequest();

   xhttp.open("POST", "/order", true);
   xhttp.onload = function () { 
    
      // Checking status 
      if (xhttp.status === 200) { 
         console.log(this.responseText);
         let order = JSON.parse(this.responseText)
         alert(`Order Booked.Order Id : ${order.order._id}` )

         window.location.reload();
      } else { 
         console.log('error') 
      } 
    }
   xhttp.send();
}

// function addOrder(id){
   
//    alert('js working');
//    console.log('addOrder running');
//    console.log('product id',id);
//    var qtn = document.getElementById('packageQtn').value;
//    console.log('quantity', qtn);
//    var xhr = new XMLHttpRequest();
//    xhr.open("POST", '/cart', true);
//    xhr.setRequestHeader('Content-Type', 'application/json');
//    xhr.send(JSON.stringify({
//       productId : id,
//       quantity: qtn
//    }));
//    return false;
// }
function addOrder(id){
   var qtn = document.getElementById('packageQtn').value;
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
       console.log(this);
     }
   };
   xhttp.open("POST", "/cart", true);
   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   xhttp.send({
      productId: id,
      quantity: qtn
   });
   return false;
}


// formSignup.addEventListener("submit", (e) => {
// 	e.preventDefault();
// });

// formLogin.addEventListener('submit', e => {
// 	e.preventDefault();
// });

// function checkSignupInputs() {
//    let firstnameValue = firstname.value.trim();
//    let lastnameValue = lastname.value.trim();
//    let emailValue = email.value.trim();
//    let passwordValue = password.value.trim();

//    if(firstnameValue === '' || firstnameValue === null) {
//       setErrorFor(firstname, 'The field is required');
//    }  

//    if(lastnameValue === '' || lastnameValue === null) {
//       setErrorFor(lastname, 'The field is required');
//    } 

//    if(emailValue === '' || emailValue === null) {
//       setErrorFor(email, 'The field is required');
//    } else if (!isEmail(emailValue)) {
//       setErrorFor(email, 'Not a valid email');
//    } 

//    if(passwordValue === '' || passwordValue === null) {
// 		setErrorFor(password, 'The field is required');
// 	} else if(passwordValue.length < 6) {
//       setErrorFor(password, 'Password must be 6 or more characters long');
//    } 
// }

// function isEmail(email) {
//    let emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
//    return emailPattern.test((email).toLowerCase());
// }

// function setErrorFor(value, msg) {
//    let error = document.querySelector('.error');
//    error.innerHTML = "";
//    document.querySelector('#error-container').style.display = "block";
// 	error.innerText += msg;
// }

// function checkLoginInputs() {
//    let emailAddress = emailLogin.value.trim();
//    let Pass = passwordLogin.value.trim();

//    if(emailAddress === '' || emailAddress === null) {
//       setErrorFor(firstname, 'The field is required');
// 	} else if (!isEmail(emailValue)) {
//       setErrorFor(email, 'Not a valid email');
//    } 

//    if(Pass === '' || Pass === null) {
//       setErrorFor(lastname, 'The field is required');
//    } 
// }

// function loginValidation(){
//    e.preventDefault();

//    let emailAddress = emailLogin.value.trim();
//    let Pass = passwordLogin.value.trim();

//    if(emailAddress === '' || emailAddress === null) {
//       return false;
// 	} else if (!isEmail(emailValue)) {
//       return false;
//    } else if (Pass === '' || Pass === null) {
//       return false;
//    } else {
//       return true;
//    }
// }

// SIGN UP SERVER SIDE VALIDATION
/*
formSignup.onsubmit = submitData;
function submitData(e) {
   //e.preventDefault(); 
   
   let formData = new FormData(formSignup);

   let Info = {
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         firstname: formData.get('firstname'),
         lastname: formData.get('lastname'),
         email: formData.get('email'),  
         password: formData.get('password')  
      }),
      method: "POST"
   }
   fetch('http://localhost:3000/signup', Info)
   .then(response => response.json())
   .then(data => {

      if(data.success === 'Ok') {
         console.log('Successful');
      }
      else {
         console.log(data);
      //    let error = document.querySelector('.error');
      //    error.innerHTML = "";
      //    document.querySelector('#error-container').style.display = "block";

      //    data.errors.forEach(err => {
      //       error.innerHTML += '<li>' + err.msg + '</li>';
      //    }); 
      }
   })
   .catch(err => console.log(err))
}

formLogin.onsubmit = sendData;
function sendData(e) {
   e.preventDefault();

   let formData = new FormData(formLogin);

   let Info = {
      headers: {
         'Content-Type': 'aaplication/json'
      },
      body: JSON.stringify({
         email: formData.get('loginemail'),
         password: formData.get('loginpassword')
      }),
      method: "POST"
   }

   fetch('http://localhost:3000/login', Info)
   .then(response => response.json())
   .then(data => {
      console.log(data);
      // if(data.success === "Ok") {
      //    console.log('successful');
      // } else {
      //    let error = document.querySelector('.error');
      //    error.innerHTML = "";
      //    document.querySelector('#error-container').style.display = "block";
      //    data.errors.forEach(function(err) {
      //       error.innerHTML += '<li>' + err.msg + '</li>';
      //    }); 
      // }
   })
   .catch(err => console.log(err))
}
*/